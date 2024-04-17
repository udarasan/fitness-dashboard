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

            if(response.data.length==0) {
                alert("No workout records found");
                return;
            }
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
    let date = $("#date").val();
    let workOut = $("#wr_name").val();
    let workOutDetails = $("#wr_details").val();
    // calories = $("#wr_calories").val();


    if (!date || !workOut || !workOutDetails) {
        alert("Please fill in all required fields.");
        return;
    }

    // if (isNaN(calories)) {
    //     $('#calorieErrorLabel').text("Invalid input type!! Please input number");
    //     return;
    // } else {
    //     $('#calorieErrorLabel').text("");
    // }

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
            "messages": [{ "role": "user", "content": "In the workout plan, give a numerical value of the burning calories of " + workOutDetails + " . The numerical value should come in the content. One answer can come. Not separately, the whole should come in one answer. No need for more details, calorie. Only the count should come.ex: 200 That's it" }]
        }),
        success: function (response) {
            let caloriesBurnt = response.choices[0].message.content.trim();
            console.log("Calorie count:", caloriesBurnt);

            $.ajax({
                url: 'http://localhost:8080/api/v1/workoutRecords/save',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({
                    "date": date, "workout": workOut, "details": workOutDetails, "calories": caloriesBurnt,
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
                    console.error(jqXHR.responseText);
                }

            });
        },
        error: function (jqXHR) {
            console.log(jqXHR);
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
    // let calories = $("#mng_wr_calories").val();
    let recordId = $("#mngRecordId").val();

    console.log(date, workout, details, recordId);

    if (!date || !workout || !details) {
        alert("Please fill in all required fields.");
        return;
    }


    // if (isNaN(calories)) {
    //     $('#mngCalorieErrorLabel').text("Invalid input type!! Please input number");
    //     return;
    // } else {
    //     $('#mngCalorieErrorLabel').text("");
    // }

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
            let caloriesBurnt = response.choices[0].message.content.trim();
            console.log("Calorie count:", caloriesBurnt);

            $.ajax({
                url: 'http://localhost:8080/api/v1/workoutRecords/update',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',

                data: JSON.stringify({
                    "date": date, "workout": workout, "details": details, "calories": caloriesBurnt,
                    "userId": userId, "wrID": recordId
                }), // Convert data to JSON string
                success: function (response) {
                    console.log(response);
                    alert("Record Updated successfully!");
                    getWorkoutRecordsByUser();
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
        },
        error: function (jqXHR) {
            console.log(jqXHR);
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
            console.error(jqXHR.responseText);
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
        data: {date: value, id: userId},
        success: function (response) {
            console.log(response);
            $("#tblMemberRecBody").empty();
            $('.npResImg').addClass("d-none");
            $('#workOutRecTable').css("display", "inline-table");

            $.each(response.data, function (index, workOutRec) {
                let row = `<tr><td>${workOutRec.date}</td><td>${workOutRec.workout}</td><td>${workOutRec.details}</td>
                            <td>${workOutRec.calories}</td><td class="d-none">${workOutRec.wrID}</td></tr>`;
                $('#tblMemberRecBody').append(row);
            });
            $("#btnSeeAll").removeClass("d-none");


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
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
    $('#workOutRecTable').css("display", "inline-table");
    getWorkoutRecordsByUser();
});