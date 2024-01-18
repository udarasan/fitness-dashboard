$(document).ready(function () {
    getAllWorkoutPlans();
    loadMembers();

    $('#searchWorkoutPlans').on('input', function () {
        var newValue = $(this).val();
        if (newValue==""){
            getAllWorkoutPlans();
        }
    });
});

$("#searchWorkoutPlans").keyup(function () {
    let text = $('#searchWorkoutPlans').val();
    console.log(text);
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
            $.each(response.data, function (index, workOut) {
                let card = `<div class="card workoutCard text-left p-0 ">
                            <div class="card-header px-4">
                                ${workOut.planName}                            
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
                                <p class="card-text pPlanDetails">${workOut.planDetails}</p>
                                <p class="card-text pCalorieCount">calorie count:&nbsp; ${workOut.burnsCalorieCount} calories</p>
                            </div>
                        </div>`

                $(".gridContainer").append(card);
            });

            btnAssignOnClick();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
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
    $(".memberSelect").empty();
    let firstOpt = ` <option class="d-none" value="" selected></option>`;
    $(".memberSelect").append(firstOpt);
    $.ajax({
        url:'http://localhost:8080/api/v1/user/getAllUsers',
        method:'GET',
        success:function (response){
            console.log(response);
            memberList = response.data;
            $.each(response.data,function (index,member){
                console.log(member);
                let memberData= `<option>${member.uid}</option>`;
                $(".memberSelect").append(memberData);
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
$(".memberSelect").change(function(){
    let currUserId = $(this).val();

    $.each(memberList,function (index,member){
        if(currUserId == member.uid){
            currUserEmail = member.email;
            currUserMealId = member.meal_plan_id;
            currUserTrainerId = member.trainer_id;
            currUserName = member.name;
            currUserPassword = member.password;

            console.log(currUserMealId+" "+currUserTrainerId+" "+currUserName+" "+currUserPassword);

            $(".lblMemberName").val(member.name);
        }
    })
});

$("#modalAssignBtn").click(function(){
    let userId = $("#assignWorkoutModal .memberSelect").val();
    console.log(userId);
    console.log(workoutId)
    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({"uid": userId, "name":currUserName, "email": currUserEmail,
            "password":currUserPassword, "trainer_id":currUserTrainerId, "meal_plan_id": currUserMealId,
            "workout_id": workoutId }),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $('#assignWorkoutModal').data('bs.modal').hide();
            $(".memberSelect").val("");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

$("#modalAssignNew").click(function () {
    let name = $('#planName').val();
    let details = $('#planDetails').val();
    let calCount = $('#planCalorieCount').val();

    let userId = $("#assignNewWorkoutModal .memberSelect").val();

    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/assignNewWorkout',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify( {
            "workOutPlanDTO": {
                "planName": name,
                "planDetails": details,
                "burnsCalorieCount": calCount
            },
            "userDTO": {
                "uid": userId,
                "name": currUserName,
                "email": currUserEmail,
                "password": currUserPassword,
                "trainer_id": currUserTrainerId,
                "meal_plan_id": currUserMealId,
            }
        }),   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $('#assignNewWorkoutModal').data('bs.modal').hide();
            $(".memberSelect").val("");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});




