$(document).ready(function () {
    getAllWorkoutPlans();
    loadMembers();
});

$("#modalAddNew").click(function () {
    let name = $('#planName').val();
    let details = $('#planDetails').val();
    let calCount = $('#planCalorieCount').val();

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
            getAllWorkoutPlans();
            $("#newWorkoutModal").data('bs.modal').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
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

    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({"wid": id, "planName": name, "planDetails": details, "burnsCalorieCount": calCount}),  // Convert data to JSON string
        success: function (response) {
            $("#updateWorkoutModal").data('bs.modal').hide();
            console.log(response);
            $(".gridContainer").empty();
            getAllWorkoutPlans();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

function btnDeleteOnClick(){
    $(".btnDelete").click(function(){
        let workoutCard = $(this).parents("div.workoutCard");
        let deleteId = workoutCard.children("div.card-body").children("input.hiddenWorkoutId").val();

        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this record!',
            icon: 'warning', // warning icon
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Close'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: 'http://localhost:8080/api/v1/workoutplan/delete/'+ deleteId,
                    method: 'DELETE',
                    contentType: 'application/json',  // Set content type to JSON
                    success: function (response) {
                        console.log(response);
                        $(".gridContainer").empty();
                        getAllWorkoutPlans();
                        Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR.responseText);  // Log the response text for debugging
                    }
                });

            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // User clicked "Close" or outside the modal
                Swal.fire('Cancelled', 'Your record is safe :)', 'info');
            }
        });
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
$("#memberSelect").change(function(){
    let currUserId = $(this).val();

    $.each(memberList,function (index,member){
        if(currUserId == member.uid){
            currUserEmail = member.email;
            $("#lblMemberName").val(member.name);
        }
    })
});

$("#modalAssignBtn").click(function(){
    let userId = $("#memberSelect").val();

    console.log(workoutId)
    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({"email": currUserEmail, "workout_id": workoutId, "uid": userId,"trainer_id":1}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $('#assignWorkoutModal').data('bs.modal').hide();
            $("#memberSelect").val("");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

$("#cancelSearch").click(function () {
   getAllWorkoutPlans();
});





