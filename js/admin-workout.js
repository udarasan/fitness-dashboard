$(window).on('load', function() {
    getAllWorkoutPlans();
    loadMembers();

    $('#searchWorkoutPlans').on('input', function () {
        var newValue = $(this).val();
        if (newValue==""){
            getAllWorkoutPlans();
        }
    });
});

$("#modalAddNew").click(function () {
    let name = $('#planName').val();
    let details = $('#planDetails').val();
    let calCount = $('#planCalorieCount').val();


    if ( !name || !details || !calCount) {
        alert("Please fill in all required fields.");
        return;
    }
    if (!isValidPlan(name)) {
        $('#nameErrorLabel').text("Please enter a name with 2 to 50 characters");
        return;

    } else {
        $('#nameErrorLabel').text(""); // Clear the error label
    }
    if (!isValidPlan(details)) {
        $('#workOutPlanDetailsErrorLabel').text("Please enter a description minimum 2 characters");
        return;

    } else {
        $('#workOutPlanDetailsErrorLabel').text(""); // Clear the error label
    }
    if(isNaN(calCount)){
        $('#calaryErrorLabel').text("Invalid input type");
    }else {
        $('#calaryErrorLabel').text("");
    }

    if (isValidName(name) && isValidPlan(details) && !isNaN(calCount)) {
        // Make the AJAX request
        $.ajax({
            url: 'http://localhost:8080/api/v1/workoutplan/save',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',  // Set content type to JSON
            data: JSON.stringify({"planName": name, "planDetails": details, "burnsCalorieCount": calCount}),  // Convert data to JSON string
            success: function (response) {
                console.log(response);

                $(".gridContainer").empty();
                alert("WorkOut Added successful!");
                getAllWorkoutPlans();
                $("#newWorkoutModal").data('bs.modal').hide();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("WorkOut Added failed! Please check your input and try again.");
                console.error(jqXHR.responseText);  // Log the response text for debugging
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
        data: {partialName: text},   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $(".gridContainer").empty();
            $.each(response.data, function (index, workOut) {
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
                                        <li><a class="dropdown-item btnAssign" data-target="#assignWorkoutModal" 
                                        data-toggle="modal" href="#">Assign</a></li>
                                     </ul>
                                </div>  
                            </div>
                            <div class="card-body px-4">
                                <input class="hiddenWorkoutId" type="hidden" value="${workOut.wid}">
                                <p class="card-text">${workOut.planDetails}</p>
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
            console.error(jqXHR.responseText);  // Log the response text for debugging
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
            let workout = response.data;
            if (workout.length === 0) {
                alert("No workouts found.");
                return;
            }
            $.each(response.data, function (index, workOut) {

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
                                        <li><a class="dropdown-item btnAssign" data-target="#assignWorkoutModal" 
                                        data-toggle="modal" href="#">Assign</a></li>
                                     </ul>
                                </div>                    
                            </div>
                            <div class="card-body px-4">
                                <input class="hiddenWorkoutId" type="hidden" value="${workOut.wid}">
                                <p class="card-text pPlanDetails">${workOut.planDetails}</p>
                                <p class="card-text pCalorieCount">calorie count:&nbsp; ${workOut.burnsCalorieCount} calories</p>
                            </div>
                        </div>`

                $(".gridContainer").append(card);
            });

            btnEditOnCLick();
            btnDeleteOnClick();
            btnAssignOnClick();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve workouts. Please try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}

let id;
function btnEditOnCLick(){
    $(".btnEdit").click(function(){
        let workoutCard = $(this).parents("div.workoutCard");
        id = workoutCard.children("div.card-body").children("input.hiddenWorkoutId").val();
        let details = workoutCard.children("div.card-body").children("p.pPlanDetails").text();
        let calorieCount;
        let name;

        let countText = workoutCard.children("div.card-body").children("p.pCalorieCount").text();
        var matches = countText.match(/\d+/);   //get only integer part
        if (matches && matches.length > 0) {
            calorieCount = parseInt(matches[0]);
        } else {
            console.log("Calorie count not found");
        }

        // get only text content
        name = workoutCard.children("div.card-header").contents().filter(function() {
            return this.nodeType === 3; // Filter out non-text nodes
        }).text().trim();

        // set values to update model
        $("#updPlanName").val(name);
        $("#updPlanDetails").val(details);
        $("#updPlanCalorieCount").val(calorieCount);
    });
}

$("#modalUpdateBtn").click(function () {
    let name = $("#updPlanName").val();
    let details = $("#updPlanDetails").val();
    let calCount = $("#updPlanCalorieCount").val();

    if ( !name || !details || !calCount) {
        alert("Please fill in all required fields.");
        return;
    }
    if (!isValidPlan(name)) {
        $('#unameErrorLabel').text("Please enter a name with 2 to 50 characters");
        return;

    } else {
        $('#unameErrorLabel').text(""); // Clear the error label
    }


    if (!isValidPlan(details)) {

        $('#uworkOutPlanDetailsErrorLabel').text("Please enter a description minimum 2 characters");
        return;

    } else {
        $('#uworkOutPlanDetailsErrorLabel').text(""); // Clear the error label
    }
    if(isNaN(calCount)){
        $('#ucalaryErrorLabel').text("Invalid input type");
    }else {
        $('#ucalaryErrorLabel').text("");
    }
    if (isValidPlan(name) && isValidPlan(details) && !isNaN(calCount)) {
        $.ajax({
            url: 'http://localhost:8080/api/v1/workoutplan/update',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',  // Set content type to JSON
            data: JSON.stringify({"wid": id, "planName": name, "planDetails": details, "burnsCalorieCount": calCount}),  // Convert data to JSON string
            success: function (response) {
                alert("Workout Update successful!");
                $("#updateWorkoutModal").data('bs.modal').hide();
                console.log(response);
                $(".gridContainer").empty();
                getAllWorkoutPlans();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Workout Update failed! Please check your input and try again.");
                console.error(jqXHR.responseText);  // Log the response text for debugging
            }
        });
    }
});

function btnDeleteOnClick(){
    $(".btnDelete").click(function(){
        let workoutCard = $(this).parents("div.workoutCard");
        let deleteId = workoutCard.children("div.card-body").children("input.hiddenWorkoutId").val();

        var result = window.confirm("Do you want to proceed?");
        if (result) {
                $.ajax({
                    url: 'http://localhost:8080/api/v1/workoutplan/delete/'+ deleteId,
                    method: 'DELETE',
                    contentType: 'application/json',  // Set content type to JSON
                    success: function (response) {
                        console.log(response);
                        alert("Workout Delete successful!");
                        $(".gridContainer").empty();
                        getAllWorkoutPlans();

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Workout Delete failed! Please check your input and try again.");
                        console.error(jqXHR.responseText);  // Log the response text for debugging
                    }
                });
        } else {
            alert("WorkOut Plan  Is Safe !!")
        }

        });
    }


let workoutId;
function btnAssignOnClick(){
    $(".btnAssign").click(function(){
        let workoutCard = $(this).parents("div.workoutCard");
        workoutId = workoutCard.children("div.card-body").children("input.hiddenWorkoutId").val();
    });
}

let memberList;
function loadMembers(){
    $("#memberSelect").empty();
    let firstOpt = ` <option class="d-none" value="" selected></option>`;
    $("#memberSelect").append(firstOpt);
    $.ajax({
        url:'http://localhost:8080/api/v1/user/getAllUsers',
        method:'GET',
        success:function (response){
            console.log(response);
            memberList = response.data;
            $.each(response.data,function (index,member){
                console.log(member);
                let memberData= `<option>${member.uid}</option>`;
                $("#memberSelect").append(memberData);
            })
        },
        error:function (xhr){
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
$("#memberSelect").change(function(){
    let currUserId = $(this).val();

    $.each(memberList,function (index,member){
        if(currUserId == member.uid){
            currUserEmail = member.email;
            currUserMealId = member.meal_plan_id;
            currUserTrainerId = member.trainer_id;
            currUserName = member.name;
            currUserPassword = member.password;
            currUserAge=member.age;
            currUserGender=member.gender;

            console.log(currUserMealId+" "+currUserTrainerId+" "+currUserName+" "+currUserPassword);
            console.log(currUserAge)
            console.log(currUserGender)

            $("#lblMemberName").val(member.name);
        }
    })
});

$("#modalAssignBtn").click(function(){
    let userId = $("#memberSelect").val();
    if (!userId) {
        alert("Please Select User Id.");
        return;
    }
    console.log(workoutId)
    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({"uid": userId,
            "name":currUserName,
            "email": currUserEmail,
            "password":currUserPassword,
            "trainer_id":currUserTrainerId,
            "meal_plan_id": currUserMealId,
            "workout_id": workoutId,
            "age":currUserAge,
            "gender":currUserGender
        }),   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("Workout Assigned Successfully !!")
            $('#assignWorkoutModal').data('bs.modal').hide();
            $("#memberSelect").val("");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});






