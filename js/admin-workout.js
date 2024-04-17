$('#nameLbl').text(localStorage.getItem('adminEmail'));
$(window).on('load', function () {
    getAllWorkoutPlans();

    $('#searchWorkoutPlans').on('input', function () {
        var newValue = $(this).val();
        if (newValue == "") {
            getAllWorkoutPlans();
        }
    });
});

$("#modalAddNew").click(function () {
    let equipmentText = "";

    $('.equipmentContainer input[type="checkbox"]:checked').each(function () {
        let labelText = $(this).parent().children(".form-check-label").text().trim();

        if (equipmentText == "") {
            equipmentText = "Equipments:\n" + labelText;
        } else {
            equipmentText = equipmentText + ", " + labelText;
        }
    });

    let name = $('#planName').val();
    let details = $('#planDetails').val();
    // let calCount = $('#planCalorieCount').val();
     let workOutType = $('#workoutType').val();

    let detailsWithEquipments = details + "\n\n" + equipmentText;

    if (!name || !details ) {
        alert("Please fill in all required fields.");
        return;
    }
    if (!isValidPlan(name)) {
        $('#nameErrorLabel').text("Please enter a name with more than 2 characters");
        return;

    } else {
        $('#nameErrorLabel').text("");
    }

    if (isValidPlan(name)) {
        // Call ChatGPT API to generate calorie count
        $.ajax({
            url: 'https://api.openai.com/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
                'OpenAI-Organization':'org-ipyjrPJzsP41M9H3lgQuPpem'

            },
            data: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": "In the workout plan, give a numerical value of the burning calories of " + details + " . The numerical value should come in the content. One answer can come. Not separately, the whole should come in one answer. No need for more details, calorie. Only the count should come.ex: 200 That's it" }]
            }),
            success: function (response) {
                let calorieCount = response.choices[0].message.content.trim();
                console.log("Calorie count:", calorieCount);

                // Make the AJAX request
                $.ajax({
                    url: 'http://localhost:8080/api/v1/workoutplan/save',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "planName": name,
                        "planDetails": detailsWithEquipments,
                        "burnsCalorieCount": calorieCount,
                        "workOutType": workOutType
                    }),  // Convert data to JSON string
                    success: function (response) {
                        console.log(response);

                        $(".gridContainer").empty();
                        alert("WorkOut Added successful!");
                        getAllWorkoutPlans();
                        $("#newWorkoutModal").data('bs.modal').hide();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("WorkOut Added failed! Please check your input and try again.");
                        console.error(jqXHR.responseText);
                    }
                });
            },
            error: function (jqXHR) {
                console.log(jqXHR);
            }
        });
    }
});

$("#searchWorkoutPlans").keyup(function () {
    let text = $('#searchWorkoutPlans').val();
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/plansByPartName',
        method: 'GET',
        dataType: 'json',
        data: {partialName: text},
        success: function (response) {
            console.log(response);
            $(".gridContainer").empty();
            $('.npResImg').addClass("d-none");
            $.each(response.data, function (index, workOut) {
                let plandetails = workOut.planDetails.trim();
                plandetails = plandetails.replace(/ (?=\n)/g, '&nbsp;');
                plandetails = plandetails.replace(/\n/g, '<br>');

                let card = `<div class="card workoutCard text-left p-0 ">
                            <div class="card-header px-4">                          
                                ${workOut.planName}
                                <div class="dropdown position-absolute threeDots">
                                     <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                     </a>
                                     <ul class="dropdown-menu">
                                        <li><a class="dropdown-item btnEdit" data-target="#updateWorkoutModal" 
                                        data-toggle="modal" href="#">Edit</a></li>
                                        <li><a class="dropdown-item btnDelete" href="#">Delete</a></li>
<!--                                        <li><a class="dropdown-item btnAssign" data-target="#assignWorkoutModal" -->
<!--                                        data-toggle="modal" href="#">Assign</a></li>-->
                                     </ul>
                                </div>  
                            </div>
                            <div class="card-body px-4">
                                <input class="hiddenWorkoutId" type="hidden" value="${workOut.wid}">
                                <p class="card-text">${plandetails}</p>
                                <p class="card-text">calorie count: ${workOut.burnsCalorieCount} calories</p>
                        
                            </div>
                        </div>`

                $(".gridContainer").append(card);
            });

            btnEditOnCLick();
            btnDeleteOnClick();
            btnAssignOnClick();


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
            if (jqXHR.data == null) {
                $(".gridContainer").empty();
                $('.npResImg').removeClass("d-none");
            }
        }
    });
});

$("#btnNewWorkout").click(function () {
    $.ajax({
        url: 'http://localhost:8080/api/v1/equipment/getAllEquipment',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            $(".equipmentContainer").empty();

            if (response.data.length != 0) {
                $(".equipmentContainer").addClass("mb-4");

                $.each(response.data, function (index, equipment) {
                    if(equipment.checkCondition == "working condition"){
                        let checkBox = `
                        <div class="form-check mb-1 d-inline-block">
                            <input class="form-check-input" type="checkbox" value="" >
                            <label class="form-check-label" for="">
                                 ${equipment.equipmentName}
                            </label>
                        </div>
                    `

                        $(".equipmentContainer").append(checkBox);
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Failed to retrieve equipments. Please try again.");
            console.error(jqXHR.responseText);
        }
    });
});

function getAllWorkoutPlans() {
    $(".gridContainer").empty();
    // work out Get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/getAllWorkOutPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            let workout = response.data;
            if (workout.length === 0) {
                alert("No workouts found.");
                return;
            }
            $.each(response.data, function (index, workOut) {
                let plandetails = workOut.planDetails.trim();
                plandetails = plandetails.replace(/ (?=\n)/g, '&nbsp;');
                plandetails = plandetails.replace(/\n/g, '<br>');

                let card = `<div class="card workoutCard text-left p-0 ">
                            <div class="card-header px-4">
                                ${workOut.planName}   
                                <p class="small mb-0">workout id:<span> ${workOut.wid}</span></p>                         
                                <div class="dropdown position-absolute threeDots">
                                     <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                     </a>
                                     <ul class="dropdown-menu">
                                        <li><a class="dropdown-item btnEdit" data-target="#updateWorkoutModal" 
                                        data-toggle="modal" href="#">Edit</a></li>
                                        <li><a class="dropdown-item btnDelete" href="#">Delete</a></li>
<!--                                        <li><a class="dropdown-item btnAssign" data-target="#assignWorkoutModal" -->
<!--                                        data-toggle="modal" href="#">Assign</a></li>-->
                                     </ul>
                                </div>                    
                            </div>
                            <div class="card-body px-4">
                                <input class="hiddenWorkoutId" type="hidden" value="${workOut.wid}">
                                <p class="card-text pPlanDetails">${plandetails}</p>
                                <p class="card-text pCalorieCount">calorie count:&nbsp; ${workOut.burnsCalorieCount} calories</p>
                                <p class="card-text">Type:&nbsp;<span class="pWorkoutType">${workOut.workOutType}</span></p>
                            </div>
                        </div>`

                $(".gridContainer").append(card);
            });

            btnEditOnCLick();
            btnDeleteOnClick();
            // btnAssignOnClick();

            // loadMembers();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve workouts. Please try again.");
            console.error(jqXHR.responseText);
        }
    });
}

let id;

function btnEditOnCLick() {
    $(".btnEdit").click(function () {
        let workoutCard = $(this).parents("div.workoutCard");
        id = workoutCard.children("div.card-body").children("input.hiddenWorkoutId").val();
        let details = workoutCard.children("div.card-body").children("p.pPlanDetails").html();
        details = details.replace(/<br\s*[\/]?>/gi, "\n");
        details = details.replace(/&nbsp;/g, " ");
        details = details.replace(/ +(?= *\n)/g, "");

        let calorieCount;
        let name;
        let workOutType = workoutCard.children("div.card-body").children("p.card-text").children("span.pWorkoutType").text();

        let countText = workoutCard.children("div.card-body").children("p.pCalorieCount").text();
        var matches = countText.match(/\d+/);
        if (matches && matches.length > 0) {
            calorieCount = parseInt(matches[0]);
        } else {
            console.log("Calorie count not found");
        }

        // get only text content
        name = workoutCard.children("div.card-header").contents().filter(function () {
            return this.nodeType === 3;
        }).text().trim();

        appendAndCheckCheckboxes(details);

        // set values to update model
        $("#updPlanName").val(name);

        var index = details.indexOf("Equipments:");
        if (index !== -1) {
            details = details.substring(0, index).trim();
        } else {
            details = details.trim();
        }
        $("#updPlanDetails").val(details);

        $("#updPlanCalorieCount").val(calorieCount);

        $("#updWorkoutType").val(workOutType);

    });
}

function appendAndCheckCheckboxes(details) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/equipment/getAllEquipment',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            $(".updEquipmentContainer").empty();

            if (response.data.length != 0) {
                $(".updEquipmentContainer").addClass("mb-4");

                $.each(response.data, function (index, equipment) {
                    let checkBox = `
                        <div class="form-check mb-1 d-inline-block mr-3">
                            <input class="form-check-input" type="checkbox" value="" >
                            <label class="form-check-label" for="">
                                 ${equipment.equipmentName}
                            </label>
                        </div>
                    `

                    $(".updEquipmentContainer").append(checkBox);
                });
            }

            //split equipments
            var equipmentsStartIndex = details.indexOf("Equipments:");
            if (equipmentsStartIndex !== -1) {
                var equipmentsSubstring = details.substring(equipmentsStartIndex + "Equipments:".length);
                var equipmentsArray = equipmentsSubstring.split(',');
                for (var i = 0; i < equipmentsArray.length; i++) {

                    var equipment = equipmentsArray[i].trim();
                    if (equipment !== "") {
                        $(".updEquipmentContainer .form-check-label").each(function () {
                            let labelText = $(this).text().trim();

                            if (equipment === labelText) {
                                $(this).parent().children(".form-check-input").prop("checked", true);
                            }
                        });

                    }
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Failed to retrieve equipments. Please try again.");
            console.error(jqXHR.responseText);
        }
    });
}

$("#modalUpdateBtn").click(function () {
    let equipmentText = "";

    $('.updEquipmentContainer input[type="checkbox"]:checked').each(function () {
        let labelText = $(this).parent().children(".form-check-label").text().trim();

        if (equipmentText == "") {
            equipmentText = "Equipments:\n" + labelText;
        } else {
            equipmentText = equipmentText + ", " + labelText;
        }
    });

    let name = $("#updPlanName").val();
    let details = $("#updPlanDetails").val();
    // let calCount = $("#updPlanCalorieCount").val();
    let workOutType = $("#updWorkoutType").val();

    let detailsWithEquipments = details + "\n\n" + equipmentText;

    if (!name || !details) {
        alert("Please fill in all required fields.");
        return;
    }
    if (!isValidPlan(name)) {
        $('#unameErrorLabel').text("Please enter a name with more than 2 characters");
        return;

    } else {
        $('#unameErrorLabel').text("");
    }


    // if (isNaN(calCount)) {
    //     $('#ucalaryErrorLabel').text("Invalid input type");
    // } else {
    //     $('#ucalaryErrorLabel').text("");
    // }
    if (isValidPlan(name)) {

        // Call ChatGPT API to generate calorie count
        $.ajax({
            url: 'https://api.openai.com/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
                'OpenAI-Organization':'org-ipyjrPJzsP41M9H3lgQuPpem'

            },
            data: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{ "role": "user", "content": "In the workout plan, give a numerical value of the burning calories of " + details + " . The numerical value should come in the content. One answer can come. Not separately, the whole should come in one answer. No need for more details, calorie. Only the count should come.ex: 200 That's it" }]
            }),
            success: function (response) {
                let calorieCount = response.choices[0].message.content.trim();
                console.log("Calorie count:", calorieCount);

                // Make the AJAX request
                $.ajax({
                    url: 'http://localhost:8080/api/v1/workoutplan/update',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "wid": id,
                        "planName": name,
                        "planDetails": detailsWithEquipments,
                        "burnsCalorieCount": calorieCount,
                        "workOutType": workOutType
                    }),  // Convert data to JSON string
                    success: function (response) {
                        alert("Workout Update successful!");
                        $("#updateWorkoutModal").data('bs.modal').hide();
                        console.log(response);
                        $(".gridContainer").empty();
                        getAllWorkoutPlans();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Workout Update failed! Please check your input and try again.");
                        console.error(jqXHR.responseText);
                    }
                });

            },
            error: function (jqXHR) {
                console.log(jqXHR);
            }
        });
    }
});

function btnDeleteOnClick() {
    $(".btnDelete").click(function () {
        let workoutCard = $(this).parents("div.workoutCard");
        let deleteId = workoutCard.children("div.card-body").children("input.hiddenWorkoutId").val();

        var result = window.confirm("Do you want to proceed?");
        if (result) {
            $.ajax({
                url: 'http://localhost:8080/api/v1/workoutplan/delete/' + deleteId,
                method: 'DELETE',
                contentType: 'application/json',
                success: function (response) {
                    console.log(response);
                    alert("Workout Delete successful!");
                    $(".gridContainer").empty();
                    getAllWorkoutPlans();

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Workout Delete failed! Please check your input and try again.");
                    console.error(jqXHR.responseText);
                }
            });
        } else {
            alert("WorkOut Plan  Is Safe !!")
        }

    });
}

let workoutId;

// function btnAssignOnClick() {
//     $(".btnAssign").click(function () {
//         let workoutCard = $(this).parents("div.workoutCard");
//         workoutId = workoutCard.children("div.card-body").children("input.hiddenWorkoutId").val();
//     });
// }

let memberList;

// function loadMembers() {
//     $("#memberSelect").empty();
//     let firstOpt = ` <option class="d-none" value="" selected></option>`;
//     $("#memberSelect").append(firstOpt);
//     $.ajax({
//         url: 'http://localhost:8080/api/v1/user/getAllUsers',
//         method: 'GET',
//         success: function (response) {
//             console.log(response);
//             memberList = response.data;
//             $.each(response.data, function (index, member) {
//                 console.log(member);
//                 let memberData = `<option value="${member.uid}">${member.name}</option>`;
//                 $("#memberSelect").append(memberData);
//             })
//         },
//         error: function (xhr) {
//             console.log(xhr);
//         }
//     })
// }

// let currUserEmail;
// let currUserMealId;
// let currUserTrainerId;
// let currUserName;
// let currUserPassword;
// let currUserAge;
// let currUserGender;
// $("#memberSelect").change(function () {
//     let currUserId = $(this).val();
//
//     $.each(memberList, function (index, member) {
//         if (currUserId == member.uid) {
//             currUserEmail = member.email;
//             currUserMealId = member.meal_plan_id;
//             currUserTrainerId = member.trainer_id;
//             currUserName = member.name;
//             currUserPassword = member.password;
//             currUserAge = member.age;
//             currUserGender = member.gender;
//
//             console.log(currUserMealId + " " + currUserTrainerId + " " + currUserName + " " + currUserPassword);
//             console.log(currUserAge)
//             console.log(currUserGender)
//
//             $("#lblMemberName").val(member.name);
//         }
//     })
// });

// $("#modalAssignBtn").click(function () {
//     let userId = $("#memberSelect").val();
//     if (!userId) {
//         alert("Please Select User Id.");
//         return;
//     }
//     console.log(workoutId)
//     // Make the AJAX request
//     $.ajax({
//         url: 'http://localhost:8080/api/v1/user/update',
//         method: 'POST',
//         dataType: 'json',
//         contentType: 'application/json',
//         data: JSON.stringify({
//             "uid": userId,
//             "name": currUserName,
//             "email": currUserEmail,
//             "password": currUserPassword,
//             "trainer_id": currUserTrainerId,
//             "meal_plan_id": currUserMealId,
//             "workout_id": workoutId,
//             "age": currUserAge,
//             "gender": currUserGender
//         }),   // Convert data to JSON string
//         success: function (response) {
//             console.log(response);
//             alert("Workout Assigned Successfully !!")
//             $('#assignWorkoutModal').data('bs.modal').hide();
//             $("#memberSelect").val("");
//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             console.error(jqXHR.responseText);
//         }
//     });
// });






