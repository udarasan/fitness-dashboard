let userEmail=localStorage.getItem("userEmail");

window.onload = function() {
    setDateInModal();
    searchUserWithEmail();
};

function setDateInModal(){
    dateField = $("#date");

    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    dateField.val(formattedDate);
}

function getMealRecordsByUser(){
    console.log(userId);
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealRecords/getAllMealRecords/'+userId,
        method: 'GET',
        success: function (response) {
            $('#tblMemberRecBody').empty();
            console.log(response);

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
function searchUserWithEmail(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data:{email:userEmail},
        success: function (response) {
            userId= response.data.uid;
            getMealRecordsByUser();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

$("#addRecord").click(function (){
    date = $("#date").val();
    mealType = $("#meal").val();
    mealDetails = $("#mealDetails").val();
    calories = $("#calories").val();

    $.ajax({
        url: 'http://localhost:8080/api/v1/mealRecords/save',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({  "date": date, "meal": mealType, "details": mealDetails, "calories": calories,
            "userId" : userId }),  // Convert data to JSON string
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
            console.log(jqXHR.status);
            if(jqXHR.status == 409){
                alert("Record already added. Please try updating the record");
                return;
            }
            alert("Process Failed! Please check your input and try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }

    });
});

$('#tblMemberRecBody').on('click', 'tr', function () {
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
    let date =  $("#mngDate").val(date);
    let mealType = $("#mngMeal").val(mealType);
    let details =   $("#mngMealDetails").val(details);
    let calories =   $("#mngCalories").val(calories);
    let recordId =    $("#mngRecordId").val(recordId);

    if ( !date || !mealType || !details || !calories) {
        alert("Please fill in all required fields.");
        return;
    }

    if(isNaN(calories)){
        $('#mngCalorieErrorLabel').text("Invalid input type!! Please input number");
    }else {
        $('#mngCalorieErrorLabel').text("");
    }

    $.ajax({
        url: 'http://localhost:8080/api/v1/mealRecords/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({"pid": pid, "height": height, "weight": weight, "userId": uId, "date": date}),  // Convert data to JSON string
        success: function (response) {
            alert("Progress Details Update successful!");
            searchUserWithEmail();
            $('#pId').val("");
            $('#height').val("");
            $('#weight').val("");
            $('#date').val("");

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Progress Details Update failed! Please check your input and try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });

});