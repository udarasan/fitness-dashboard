let userEmail = localStorage.getItem("userEmail");
$('#lblName').text(localStorage.getItem("name"));

window.onload = function () {
    // setDateInModal();
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
            getWorkoutRecordsByUser();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


function getWorkoutRecordsByUser() {
    console.log(userId);
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutRecords/getAllWorkOutRecords/' + userId,
        method: 'GET',
        success: function (response) {
            $('#tblMemberRecBody').empty();
            console.log(response);

            $.each(response.data, function (index, workOutRec) {
                let row = `<tr><td>${workOutRec.date}</td><td>${workOutRec.workout}</td><td>${workOutRec.details}</td>
                            <td>${workOutRec.calories}</td><td class="d-none">${workOutRec.wrID}</td></tr>`;
                $('#tblMemberRecBody').append(row);
            });
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


$("#addRecord").click(function () {
    date = $("#date").val();
    workOut = $("#wr_name").val();
    workOutDetails = $("#wr_details").val();
    calories = $("#wr_calories").val();


    if (!date || !workOut || !workOutDetails || !calories) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!isValidPlan(workOutDetails)) {
        $('#descriptionErrorLabel').text("Please enter a description minimum 2 characters");
        return;
    } else {
        $('#descriptionErrorLabel').text(""); // Clear the error label
    }

    if (isNaN(calories)) {
        $('#calorieErrorLabel').text("Invalid input type!! Please input number");
        return;
    } else {
        $('#calorieErrorLabel').text("");
    }

    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutRecords/save',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({
            "date": date, "workout": workOut, "details": workOutDetails, "calories": calories,
            "userId": userId
        }),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("New Record Added successfully!");
            getWorkoutRecordsByUser();
            // setDateInModal();
            $('#wr_name').val("");
            $('#wr_details').val("");
            $('#wr_calories').val("");
            $("#workoutRecModal").data('bs.modal').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 409) {
                alert("Record already added. Please try updating the record");
                return;
            }
            alert("Process Failed! Please check your input and try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }

    });
});


$('#tblMemberRecBody').on('click', 'tr', function () {
    $('#mngDescriptionErrorLabel').text("");
    $('#mngCalorieErrorLabel').text("");

    let date = $(this).find('td:first').text();
    let workOut = $(this).find('td:nth-child(2)').text();
    let details = $(this).find('td:nth-child(3)').text();
    let calories = $(this).find('td:nth-child(4)').text();
    let recordId = $(this).find('td:nth-child(5)').text();
    console.log(recordId)

    $('#manageRecModal').modal('show');

    $("#mngDate").val(date);
    $("#mng_wr_name").val(workOut);
    $("#mng_wr_details").val(details);
    $("#mng_wr_calories").val(calories);
    $("#mngRecordId").val(recordId);
});


$('#updateRecord').click(function () {
    let date = $("#mngDate").val();
    let workout = $("#mng_wr_name").val();
    let details = $("#mng_wr_details").val();
    let calories = $("#mng_wr_calories").val();
    let recordId = $("#mngRecordId").val();

    console.log(date, workout, details, calories, recordId);

    if (!date || !workout || !details || !calories) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!isValidPlan(details)) {
        $('#mngDescriptionErrorLabel').text("Please enter a description minimum 2 characters");
        return;
    } else {
        $('#mngDescriptionErrorLabel').text(""); // Clear the error label
    }

    if (isNaN(calories)) {
        $('#mngCalorieErrorLabel').text("Invalid input type!! Please input number");
        return;
    } else {
        $('#mngCalorieErrorLabel').text("");
    }

    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutRecords/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({
            "date": date, "workout": workout, "details": details, "calories": calories,
            "userId": userId, "wrID": recordId
        }), // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("Record Updated successfully!");
            $('#mng_wr_name').val("");
            $('#mng_wr_details').val("");
            $('#mng_wr_calories').val("");
            $("#manageRecModal").data('bs.modal').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 409) {
                alert("Duplicate Record Values. Please check your details again");
                return;
            }
            alert("Record Updating Process Failed! Please check your input and try again.");
            console.error(jqXHR.responseText);
        }
    });
});


$('#deleteRecord').click(function () {
    let id = $("#mngRecordId").val();

    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutRecords/delete/' + id,
        method: 'DELETE',
        success: function (response) {
            console.log(response);
            alert("Record Deleted successfully!");
            getWorkoutRecordsByUser();
            $("#manageRecModal").data('bs.modal').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Record deleting process failed!");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});


$("#searchByDate").on('input', function () {

    value = $("#searchByDate").val();
    console.log(typeof (value));
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutRecords/recordsByDate',
        method: 'GET',
        dataType: 'json',
        data: {date: value, id: userId},   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $("#tblMemberRecBody").empty();
            $('.npResImg').addClass("d-none");
            $('#workOutRecTable').css("display", "block");

            $.each(response.data, function (index, workOutRec) {
                let row = `<tr><td>${workOutRec.date}</td><td>${workOutRec.workout}</td><td>${workOutRec.details}</td>
                            <td>${workOutRec.calories}</td><td class="d-none">${workOutRec.wrID}</td></tr>`;
                $('#tblMemberRecBody').append(row);
            });
            $("#btnSeeAll").removeClass("d-none");


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
            if (jqXHR.data == null) {
                $('#workOutRecTable').css("display", "none")
                $("#btnSeeAll").removeClass("d-none");
                $('.npResImg').removeClass("d-none");
            }
        }
    });
});

$("#btnSeeAll").click(function () {
    $("#btnSeeAll").addClass("d-none");
    $('.npResImg').addClass("d-none");
    $("#searchByDate").val("");
    $('#workOutRecTable').css("display", "block");
    getWorkoutRecordsByUser();
});