let userEmail = localStorage.getItem("userEmail");
$('#lblName').text(localStorage.getItem("name"));
window.onload = function () {
    searchUserWithEmail();
};

let userId;

function searchUserWithEmail() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: userEmail},
        success: function (response) {
            userId = response.data.uid;
            getGoalsByUser();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function getGoalsByUser() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/fitnessGoals/getAllGoals/' + userId,
        method: 'GET',
        success: function (response) {
            let fitGoals = response.data;
            if (fitGoals.length === 0) {
                alert("No FitnessGoals found.");
                return;
            }

            $('.mainCardBody').empty();
            console.log(response);
            $.each(response.data, function (index, goal) {
                if (goal.startDate === null) {
                    goal.startDate = "N/A";
                }
                if (goal.endDate === null) {
                    goal.endDate = "N/A";
                }

                let card = `
                        <div class="card rounded-0">
                            <div class="card-body">
                              <div class="d-flex mb-2">
                                <h6 id="goalName" class="mb-1 flex-grow-1 text-primary pr-4">${goal.goalName}</h6>
                                <div class="dropdown position-absolute threeDots">
                                  <a class="btn dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" 
                                  aria-expanded="false">
                                    <i class="fa fa-ellipsis-v" aria-hidden="true" style="transform: rotate(90deg)"></i>
                                  </a>
                                  <ul class="dropdown-menu">
                                    <li><a class="dropdown-item btnEdit" data-target="#updFitnessGoalModal"
                                           data-toggle="modal" href="#">Edit</a></li>
                                    <li><a class="dropdown-item btnDelete" href="#">Delete</a></li>
                                  </ul>
                                </div>
                              </div>
                              <input class="hiddenId" type="hidden" value="${goal.goalId}">
                              <p id="goalDetails" class="text-muted">${goal.goalDetails}</p>
                              <div>
                                <label class="small d-inline-block">Start Date:&nbsp;</label>
                                <label id="startDate" class="small d-inline-block">${goal.startDate}</label>
                              </div>
                              <div>
                                <label class="small d-inline-block">End Date:&nbsp;</label>
                                <label id="endDate" class="small d-inline-block">${goal.endDate}</label>
                              </div>
                              <span class="badge badgeColour text-white py-2 px-3 mt-2 status">${goal.status}</span>
                            </div>
                        </div>`;

                $('.mainCardBody').append(card);

                if (goal.status === 'Not Yet Started') {
                    $('.mainCardBody .card:last-of-type .status').addClass("bg-gradient-secondary");
                } else if (goal.status === 'Ongoing') {
                    $('.mainCardBody .card:last-of-type .status').addClass("bg-gradient-info");
                } else if (goal.status === 'Completed') {
                    $('.mainCardBody .card:last-of-type .status').addClass("bg-gradient-success");
                }
            });

            btnEditOnCLick();
            btnDeleteOnClick();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

let id;

function btnEditOnCLick() {
    $(".btnEdit").click(function () {
        let cardBody = $(this).parents("div.card-body");
        id = cardBody.children("input.hiddenId").val();
        let name = cardBody.children().children("h6#goalName").text();
        let details = cardBody.children("p#goalDetails").text();
        let startDate = cardBody.children().children("label#startDate").text();
        let endDate = cardBody.children().children("label#endDate").text();
        let status = cardBody.children("span.status").text();

        if (startDate === "N/A") {
            startDate = "";
        }
        if (endDate === "N/A") {
            endDate = "";
        }

        // set values to update model
        $("#updModalGoalName").val(name);
        $("#updModalGoalDetails").val(details);
        $("#updModalStartDate").val(startDate);
        $("#updModalEndDate").val(endDate);
        $("#updModalStatus").val(status);
    });
}

$('#updateGoal').click(function () {
    let goalName = $("#updModalGoalName").val();
    let goalDetails = $("#updModalGoalDetails").val();
    let startDate = $("#updModalStartDate").val();
    let endDate = $("#updModalEndDate").val();
    let status = $("#updModalStatus").val();

    if (!goalName || !goalDetails || !status) {
        alert("Please fill in all required fields. (Goal Name, Description & Status)");
        return;
    }

    if (!isValidPlan(goalDetails)) {
        $('#updDescriptionErrorLabel').text("Please enter a description minimum 2 characters");
        return;
    } else {
        $('#updDescriptionErrorLabel').text(""); // Clear the error label
    }


    $.ajax({
        url: 'http://localhost:8080/api/v1/fitnessGoals/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({
            "goalId": id, "goalName": goalName, "goalDetails": goalDetails, "startDate": startDate, "endDate": endDate,
            "userId": userId, "status": status
        }), // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("Goal Details Updated successfully!");
            getGoalsByUser();

            $("#searchByStatus").val(1);
            $("#searchByGoal").val("");
            $("#btnSeeAllStatus, #btnSeeAllName").addClass("d-none");

            $("#updModalGoalName").val("");
            $("#updModalGoalDetails").val("");
            $("#updModalStartDate").val("");
            $("#updModalEndDate").val("");
            $("#updModalStatus").val("");
            $("#updFitnessGoalModal").data('bs.modal').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Fitness Goal Updating Process Failed! Please Try Again.");
            console.error(jqXHR.responseText);
        }
    });
});

function btnDeleteOnClick() {
    $(".btnDelete").click(function () {
        let cardBody = $(this).parents("div.card-body");
        id = cardBody.children("input.hiddenId").val();

        var result = window.confirm("Do you want to proceed?");
        if (result) {
            $.ajax({
                url: 'http://localhost:8080/api/v1/fitnessGoals/delete/' + id,
                method: 'DELETE',
                contentType: 'application/json',  // Set content type to JSON
                success: function (response) {
                    console.log(response);
                    alert("Goal Details Deleted successfully");
                    getGoalsByUser();

                    $("#searchByStatus").val(1);
                    $("#searchByGoal").val("");
                    $("#btnSeeAllStatus, #btnSeeAllName").addClass("d-none");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Process failed! Please Try Again.");
                    console.error(jqXHR.responseText);  // Log the response text for debugging
                }
            });
        } else {
            alert("Goal not deleted.");
        }
    });
}

$("#addGoal").click(function () {
    name = $("#modalGoalName").val();
    details = $("#modalGoalDetails").val();
    startDate = $("#modalStartDate").val();
    endDate = $("#modalEndDate").val();
    status = $("#modalStatus").val();

    if (!name || !status || !details) {
        alert("Please fill in all required fields. (Goal Name, Description & Status)");
        return;
    }

    if (!isValidPlan(name)) {
        $('#nameErrorLabel').text("Please enter a name. Minimum 2 characters");
        return;
    } else {
        $('#nameErrorLabel').text(""); // Clear the error label
    }



    $.ajax({
        url: 'http://localhost:8080/api/v1/fitnessGoals/save',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({
            "goalName": name, "goalDetails": details, "startDate": startDate, "endDate": endDate,
            "status": status, "userId": userId
        }),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("New Goal Added successfully!");
            getGoalsByUser();

            $("#searchByStatus").val(1);
            $("#searchByGoal").val("");
            $("#btnSeeAllStatus, #btnSeeAllName").addClass("d-none");

            name = $("#modalGoalName").val("");
            details = $("#modalGoalDetails").val("");
            startDate = $("#modalStartDate").val("");
            endDate = $("#modalEndDate").val("");
            status = $("#modalStatus").val("");
            $("#fitnessGoalModal").data('bs.modal').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Process Failed! Please check your input and try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }

    });
});

$("#btnAddNewGoal").click(function () {
    let currentDate = new Date();
    let formattedDate = currentDate.toISOString().slice(0, 10);

    $("#modalStartDate").val(formattedDate);
});

$("#modalStartDate").on("input", function() {
    let selectedDate = $(this).val();

    let endDate = $("#modalEndDate").val();
    if(endDate !== "") {
        endDate = new Date(endDate);
        let formattedEndDate = endDate.toISOString().slice(0, 10);

        let dateToCheck = new Date(selectedDate);
        let formattedDateToCheck = dateToCheck.toISOString().slice(0, 10);

        if (formattedEndDate < formattedDateToCheck) {
            alert("The end date cannot be earlier than the start date.");
            $(this).val("");
        }else if(formattedEndDate === formattedDateToCheck){
            alert("The end date and start date cannot be the same.");
            $(this).val("");
        }
    }else{
        let passed = isDateLessThanCurrent(selectedDate);
        if (passed) {
            alert("The specified date has already passed.");
            $(this).val("");
        }
    }
});

$("#modalEndDate").on("input", function() {
    let selectedDate = $(this).val();

    let startDate = $("#modalStartDate").val();
    if(startDate !== "") {
        startDate = new Date(startDate);
        let formattedStartDate = startDate.toISOString().slice(0, 10);

        let dateToCheck = new Date(selectedDate);
        let formattedDateToCheck = dateToCheck.toISOString().slice(0, 10);

        if (formattedDateToCheck < formattedStartDate) {
            alert("The end date cannot be earlier than the start date.");
            $(this).val("");
        }else if(formattedDateToCheck === formattedStartDate){
            alert("The end date and start date cannot be the same.");
            $(this).val("");
        }
    }else {
        let passed = isDateLessThanCurrent(selectedDate);
        if (passed) {
            alert("The specified date has already passed.");
            $(this).val("");
        }
    }
});

$("#updModalStartDate").on("input", function() {
    let selectedDate = $(this).val();

    let endDate = $("#updModalEndDate").val();
    if(endDate !== "") {
        endDate = new Date(endDate);
        let formattedEndDate = endDate.toISOString().slice(0, 10);

        let dateToCheck = new Date(selectedDate);
        let formattedDateToCheck = dateToCheck.toISOString().slice(0, 10);

        if (formattedEndDate < formattedDateToCheck) {
            alert("The end date cannot be earlier than the start date.");
            $(this).val("");
        }else if(formattedEndDate === formattedDateToCheck){
            alert("The end date and start date cannot be the same.");
            $(this).val("");
        }
    }
});

$("#updModalEndDate").on("input", function() {
    let selectedDate = $(this).val();

    let startDate = $("#updModalStartDate").val();
    if(startDate !== "") {
        startDate = new Date(startDate);
        let formattedStartDate = startDate.toISOString().slice(0, 10);

        let dateToCheck = new Date(selectedDate);
        let formattedDateToCheck = dateToCheck.toISOString().slice(0, 10);

        if (formattedDateToCheck < formattedStartDate) {
            alert("The end date cannot be earlier than the start date.");
            $(this).val("");
        }else if(formattedDateToCheck === formattedStartDate){
            alert("The end date and start date cannot be the same.");
            $(this).val("");
        }
    }else {
        let passed = isDateLessThanCurrent(selectedDate);
        if (passed) {
            alert("The specified date has already passed.");
            $(this).val("");
        }
    }
});

function isDateLessThanCurrent(selectedDate) {
    let currentDate = new Date();
    let formattedCurrentDate = currentDate.toISOString().slice(0, 10);

    let dateToCheck = new Date(selectedDate);
    let formattedDateToCheck = dateToCheck.toISOString().slice(0, 10);

    if (formattedDateToCheck < formattedCurrentDate) {
        return true;
    }else{
        return false;
    }
}

$("#searchByStatus").on('input', function () {
    $('#searchByGoal').val("");
    $("#btnSeeAllName").addClass("d-none");

    value = $("#searchByStatus").val();
    $.ajax({
        url: 'http://localhost:8080/api/v1/fitnessGoals/goalsByStatus',
        method: 'GET',
        dataType: 'json',
        data: {status: value, id: userId},   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $(".mainCardBody").empty();
            $('.npResImg').addClass("d-none");

            $("#btnSeeAllStatus").removeClass("d-none");

            $.each(response.data, function (index, goal) {
                if (goal.startDate === null) {
                    goal.startDate = "N/A";
                }
                if (goal.endDate === null) {
                    goal.endDate = "N/A";
                }

                let card = `
                        <div class="card rounded-0">
                            <div class="card-body">
                              <div class="d-flex mb-2">
                                <h6 id="goalName" class="mb-1 flex-grow-1 text-primary pr-4">${goal.goalName}</h6>
                                <div class="dropdown position-absolute threeDots">
                                  <a class="btn dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" 
                                  aria-expanded="false">
                                    <i class="fa fa-ellipsis-v" aria-hidden="true" style="transform: rotate(90deg)"></i>
                                  </a>
                                  <ul class="dropdown-menu">
                                    <li><a class="dropdown-item btnEdit" data-target="#updFitnessGoalModal"
                                           data-toggle="modal" href="#">Edit</a></li>
                                    <li><a class="dropdown-item btnDelete" href="#">Delete</a></li>
                                  </ul>
                                </div>
                              </div>
                              <input class="hiddenId" type="hidden" value="${goal.goalId}">
                              <p id="goalDetails" class="text-muted">${goal.goalDetails}</p>
                              <div>
                                <label class="small d-inline-block">Start Date:&nbsp;</label>
                                <label id="startDate" class="small d-inline-block">${goal.startDate}</label>
                              </div>
                              <div>
                                <label class="small d-inline-block">End Date:&nbsp;</label>
                                <label id="endDate" class="small d-inline-block">${goal.endDate}</label>
                              </div>
                              <span class="badge badgeColour text-white py-2 px-3 mt-2 status">${goal.status}</span>
                            </div>
                        </div>`;

                $('.mainCardBody').append(card);

                if (goal.status === 'Not Yet Started') {
                    $('.mainCardBody .card:last-of-type .status').addClass("bg-gradient-secondary");
                } else if (goal.status === 'Ongoing') {
                    $('.mainCardBody .card:last-of-type .status').addClass("bg-gradient-info");
                } else if (goal.status === 'Completed') {
                    $('.mainCardBody .card:last-of-type .status').addClass("bg-gradient-success");
                }
            });

            btnEditOnCLick();
            btnDeleteOnClick();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
            if (jqXHR.data == null) {
                $("#btnSeeAllStatus").removeClass("d-none");
                $(".mainCardBody").empty();

                $('.npResImg').removeClass("d-none");
            }

        }
    });
});

$("#searchByGoal").keyup(function () {
    $("#searchByStatus").val(1);
    $("#btnSeeAllStatus").addClass("d-none");

    let text = $('#searchByGoal').val();
    $.ajax({
        url: 'http://localhost:8080/api/v1/fitnessGoals/goalsByName',
        method: 'GET',
        dataType: 'json',
        data: {partialName: text, id: userId},   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $(".mainCardBody").empty();
            $('.npResImg').addClass("d-none");
            $("#btnSeeAllName").removeClass("d-none");

            $.each(response.data, function (index, goal) {
                if (goal.startDate === null) {
                    goal.startDate = "N/A";
                }
                if (goal.endDate === null) {
                    goal.endDate = "N/A";
                }

                let card = `
                        <div class="card rounded-0">
                            <div class="card-body">
                              <div class="d-flex mb-2">
                                <h6 id="goalName" class="mb-1 flex-grow-1 text-primary pr-4">${goal.goalName}</h6>
                                <div class="dropdown position-absolute threeDots">
                                  <a class="btn dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" 
                                  aria-expanded="false">
                                    <i class="fa fa-ellipsis-v" aria-hidden="true" style="transform: rotate(90deg)"></i>
                                  </a>
                                  <ul class="dropdown-menu">
                                    <li><a class="dropdown-item btnEdit" data-target="#updFitnessGoalModal"
                                           data-toggle="modal" href="#">Edit</a></li>
                                    <li><a class="dropdown-item btnDelete" href="#">Delete</a></li>
                                  </ul>
                                </div>
                              </div>
                              <input class="hiddenId" type="hidden" value="${goal.goalId}">
                              <p id="goalDetails" class="text-muted">${goal.goalDetails}</p>
                              <div>
                                <label class="small d-inline-block">Start Date:&nbsp;</label>
                                <label id="startDate" class="small d-inline-block">${goal.startDate}</label>
                              </div>
                              <div>
                                <label class="small d-inline-block">End Date:&nbsp;</label>
                                <label id="endDate" class="small d-inline-block">${goal.endDate}</label>
                              </div>
                              <span class="badge badgeColour text-white py-2 px-3 mt-2 status">${goal.status}</span>
                            </div>
                        </div>`;

                $('.mainCardBody').append(card);

                if (goal.status === 'Not Yet Started') {
                    $('.mainCardBody .card:last-of-type .status').addClass("bg-gradient-secondary");
                } else if (goal.status === 'Ongoing') {
                    $('.mainCardBody .card:last-of-type .status').addClass("bg-gradient-info");
                } else if (goal.status === 'Completed') {
                    $('.mainCardBody .card:last-of-type .status').addClass("bg-gradient-success");
                }
            });

            btnEditOnCLick();
            btnDeleteOnClick();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
            if (jqXHR.data == null) {
                $("#btnSeeAllName").removeClass("d-none");
                $(".mainCardBody").empty();
                $('.npResImg').removeClass("d-none");
            }
        }
    });
});


$("#btnSeeAllStatus, #btnSeeAllName").click(function () {
    $("#searchByStatus").val(1);

    $("#btnSeeAllStatus").addClass("d-none");
    $("#btnSeeAllName").addClass("d-none");
    getGoalsByUser();
});

