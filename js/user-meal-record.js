let userEmail = localStorage.getItem("userEmail");
$('#lblName').text(localStorage.getItem("name"));
window.onload = function () {
    setDateInModal();
    searchUserWithEmail();
};

function setDateInModal() {
    dateField = $("#date");

    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    dateField.val(formattedDate);
}

function getMealRecordsByUser() {

    console.log(userId);
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealRecords/getAllMealRecords/' + userId,
        method: 'GET',
        success: function (response) {
            $('#tblMemberRecBody').empty();
            console.log(response);
            let mealList = response.data;
            if (mealList.length === 0) {
                alert("No meal records found.");
                return;
            }
            $.each(response.data, function (index, mealRecord) {
                let row = `<tr><td>${mealRecord.date}</td><td>${mealRecord.meal}</td><td>${mealRecord.details}</td>
                            <td>${mealRecord.calories}</td><td class="d-none">${mealRecord.mrID}</td></tr>`;
                $('#tblMemberRecBody').append(row);
            });
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

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
            getMealRecordsByUser();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

$("#addRecord").click(function () {
    date = $("#date").val();
    mealType = $("#meal").val();
    mealDetails = $("#mealDetails").val();
    calories = $("#calories").val();

    if (!date || !mealType || !mealDetails || !calories) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!isValidPlan(mealDetails)) {
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
        url: 'http://localhost:8080/api/v1/mealRecords/save',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({
            "date": date, "meal": mealType, "details": mealDetails, "calories": calories,
            "userId": userId
        }),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("New Record Added successfully!");
            getMealRecordsByUser();
            setDateInModal();
            $('#meal').val("");
            $('#mealDetails').val("");
            $('#calories').val("");
            $("#mealRecModal").data('bs.modal').hide();
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
    let mealType = $(this).find('td:nth-child(2)').text();
    let details = $(this).find('td:nth-child(3)').text();
    let calories = $(this).find('td:nth-child(4)').text();
    let recordId = $(this).find('td:nth-child(5)').text();

    $('#manageRecModal').modal('show');

    $("#mngDate").val(date);
    $("#mngMeal").val(mealType);
    $("#mngMealDetails").val(details);
    $("#mngCalories").val(calories);
    $("#mngRecordId").val(recordId);
});

$('#updateRecord').click(function () {
    let date = $("#mngDate").val();
    let mealType = $("#mngMeal").val();
    let details = $("#mngMealDetails").val();
    let calories = $("#mngCalories").val();
    let recordId = $("#mngRecordId").val();

    console.log(date, mealType, details, calories, recordId);

    if (!date || !mealType || !details || !calories) {
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
        url: 'http://localhost:8080/api/v1/mealRecords/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({
            "date": date, "meal": mealType, "details": details, "calories": calories,
            "userId": userId, "mrID": recordId
        }), // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("Record Updated successfully!");
            $('#meal').val("");
            $('#mealDetails').val("");
            $('#calories').val("");
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
        url: 'http://localhost:8080/api/v1/mealRecords/delete/' + id,
        method: 'DELETE',
        success: function (response) {
            console.log(response);
            alert("Record Deleted successfully!");
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
        url: 'http://localhost:8080/api/v1/mealRecords/recordsByDate',
        method: 'GET',
        dataType: 'json',
        data: {date: value, id: userId},   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $("#tblMemberRecBody").empty();
            $('.npResImg').addClass("d-none");
            $('#mealRecTable').css("display", "block");

            $.each(response.data, function (index, mealRecord) {
                let row = `<tr><td>${mealRecord.date}</td><td>${mealRecord.meal}</td><td>${mealRecord.details}</td>
                            <td>${mealRecord.calories}</td><td class="d-none">${mealRecord.mrID}</td></tr>`;
                $('#tblMemberRecBody').append(row);
            });
            $("#btnSeeAll").removeClass("d-none");


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
            if (jqXHR.data == null) {
                $('#mealRecTable').css("display", "none")
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
    $('#mealRecTable').css("display", "block");
    getMealRecordsByUser();
});
