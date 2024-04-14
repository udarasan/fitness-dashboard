$(window).on('load', function () {
    trainerEmail = localStorage.getItem('trainer-email');
    $("#trainerEmail").text(trainerEmail);
    getAllWorkoutPlans();
    loadTrainerId();

    $('#searchWorkoutPlans').on('input', function () {
        var newValue = $(this).val();
        if (newValue == "") {
            getAllWorkoutPlans();
        }
    });
});

let trainerId;

function loadTrainerId() {
    console.log(trainerEmail);
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: trainerEmail},

        success: function (response) {
            console.log(response);
            console.log(response.data.tid);
            trainerId = response.data.tid;
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

$("#searchWorkoutPlans").keyup(function () {
    let text = $('#searchWorkoutPlans').val();
    console.log(text);
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
                                <p class="small mb-0">workout id:<span> ${workOut.wid}</span></p>   
                                <div class="dropdown position-absolute threeDots">
                                     <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                     </a>
                                     <ul class="dropdown-menu">
                                        <li><a class="dropdown-item btnAssign" data-target="#assignWorkoutModal" 
                                        data-toggle="modal" href="#">Assign</a></li>
                                     </ul>
                                </div>  
                            </div>
                            <div class="card-body px-4">
                                <input class="hiddenWorkoutId" type="hidden" value="${workOut.wid}">
                                <p class="card-text">${plandetails}</p>
                                <p class="card-text">calorie count: ${workOut.burnsCalorieCount} calories</p>
                                 <p class="card-text pCalorieCount">Type:&nbsp; ${workOut.workOutType}</p>
                            </div>
                        </div>`

                $(".gridContainer").append(card);
            });

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
        contentType: 'application/json',  // Set content type to JSON
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
                        </div>`

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
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {

            if (response.data.length === undefined) {
                getAllWorkoutPlans();
                return;
            }
            if (response.data.length == 0) {
                alert("No workout plans found.")
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
                                        <li><a class="dropdown-item btnAssign" data-target="#assignWorkoutModal" 
                                        data-toggle="modal" href="#">Assign</a></li>
                                     </ul>
                                </div>                    
                            </div>
                            <div class="card-body px-4">
                                <input class="hiddenWorkoutId" type="hidden" value="${workOut.wid}">
                                <p class="card-text pPlanDetails">${plandetails}</p>
                                <p class="card-text pCalorieCount">calorie count:&nbsp; ${workOut.burnsCalorieCount} calories</p>
                                 <p class="card-text pCalorieCount">Type:&nbsp; ${workOut.workOutType}</p>
                            </div>
                        </div>`

                $(".gridContainer").append(card);
            });

            btnAssignOnClick();
            loadMembers();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });

}

let workoutId;

function btnAssignOnClick() {
    $(".btnAssign").click(function () {
        let workoutCard = $(this).parents("div.workoutCard");
        workoutId = workoutCard.children("div.card-body").children("input.hiddenWorkoutId").val();
    });
}

let memberList;

function loadMembers() {
    $(".memberSelect").empty();
    let firstOpt = ` <option class="d-none" value="" selected></option>`;
    $(".memberSelect").append(firstOpt);
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAllUsers',
        method: 'GET',
        success: function (response) {
            console.log(response);
            memberList = response.data;
            $.each(response.data, function (index, member) {
                console.log(member);

                if (member.trainer_id == trainerId) {
                    let memberData = `<option value="${member.uid}">${member.name}</option>`;
                    $(".memberSelect").append(memberData);
                }

            })
        },
        error: function (xhr) {
            console.log(xhr);
        }
    })
}

let currUserEmail;
let currUserMealId;
let currUserTrainerId;
let currUserName;
let currUserPassword;
let currUserAge;
let currUserGender;
let currWorkoutType;
let currBreakfast;
let currLunch;
let currDinner;
$(".memberSelect").change(function () {
    let currUserId = $(this).val();

    $.each(memberList, function (index, member) {
        if (currUserId == member.uid) {
            currUserEmail = member.email;
            currUserMealId = member.meal_plan_id;
            currUserTrainerId = member.trainer_id;
            currUserName = member.name;
            currUserPassword = member.password;
            currUserAge = member.age;
            currUserGender = member.gender;
            currWorkoutType = member.workoutType;
            currBreakfast = member.breakFastMeal;
            currLunch = member.lunchMeal;
            currDinner = member.dinnerMeal;


            console.log(currUserMealId + " " + currUserTrainerId + " " + currUserName + " " + currUserPassword);
            console.log(currUserAge)
            console.log(currUserGender)

            $(".lblMemberName").val(member.name);
        }
    })
});

$("#modalAssignBtn").click(function () {
    let userId = $("#assignWorkoutModal .memberSelect").val();

    if (!userId) {
        alert("Please Select User Id.");
        return;
    }
    console.log(userId);
    console.log(workoutId)
    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({
            "uid": userId,
            "name": currUserName,
            "email": currUserEmail,
            "password": currUserPassword,
            "trainer_id": currUserTrainerId,
            "meal_plan_id": currUserMealId,
            "workout_id": workoutId,
            "age": currUserAge,
            "gender": currUserGender,
            "workoutType":currWorkoutType,
            "breakFastMeal":currBreakfast,
            "lunchMeal":currLunch,
            "dinnerMeal":currDinner
        }),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("Workout Assigned Successfully !!")
            $('#assignWorkoutModal').data('bs.modal').hide();
            $(".memberSelect").val("");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

$("#modalAssignNew").click(function () {
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

    let userId = $("#assignNewWorkoutModal .memberSelect").val();

    if (!name || !details) {
        alert("Please fill in all required fields.");
        return;
    }
    if (!isValidPlan(name)) {
        $('#nameErrorLabel').text("Please enter a name with more than 2 characters");
        return;
    } else {
        $('#nameErrorLabel').text(""); // Clear the error label
    }

    if (isValidPlan(name)) {

        // Call ChatGPT API to generate calorie count
        $.ajax({
            url: 'https://api.openai.com/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR-KEY',
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
                    url: 'http://localhost:8080/api/v1/workoutplan/assignNewWorkout',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',  // Set content type to JSON
                    data: JSON.stringify({
                        "workOutPlanDTO": {
                            "planName": name,
                            "planDetails": detailsWithEquipments,
                            "burnsCalorieCount": calorieCount,
                            "workOutType": workOutType
                        },
                        "userDTO": {
                            "uid": userId,
                            "name": currUserName,
                            "email": currUserEmail,
                            "password": currUserPassword,
                            "trainer_id": currUserTrainerId,
                            "meal_plan_id": currUserMealId,
                            "age": currUserAge,
                            "gender": currUserGender
                        }
                    }),   // Convert data to JSON string
                    success: function (response) {
                        console.log(response);
                        alert("WorkOut Added successful!");
                        $('#assignNewWorkoutModal').data('bs.modal').hide();
                        $(".memberSelect").val("");
                        getAllWorkoutPlans();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("WorkOut Added failed! Please check your input and try again.");
                        console.error(jqXHR.responseText);  // Log the response text for debugging
                    }
                });

            },
            error: function (jqXHR) {
                console.log(jqXHR);
            }
        });

    }
});





