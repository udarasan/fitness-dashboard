let meal_id;
let workout_id;
$(document).ready(function () {
    // Your JavaScript code goes here
    getAllMembers();
    loadTrainerId();
});

//delete member
$('#deleteMember').click(function () {

    let id = $('#member_id').val();

            // Make the AJAX request
            $.ajax({
                url: 'http://localhost:8080/api/v1/user/delete/' + id,
                method: 'DELETE',
                contentType: 'application/json',  // Set content type to JSON
                success: function (response) {
                    alert("Member Delete successful!");
                    $('#memberModal').modal('hide');
                    getAllMembers();
                    loadTrainerId();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Member Delete failed! Please check your input and try again.");

                    console.error(jqXHR.responseText);  // Log the response text for debugging
                }
            });




});

//update member
$('#updateMember').click(function () {

    let id = $('#member_id').val();
    let email = $('#member_email').val();
    let name = $('#member_name').val();
    let trainer_id = $('#tra_id').val();
    let password = $('#memeber_password').val();

    console.log(trainer_id);
    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({"uid": id, "email": email, "password": password, "name": name, "trainer_id": trainer_id,"meal_plan_id":meal_id,"workout_id":workout_id}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("Member update successful!");
            $('#memberModal').modal('hide');
            getAllMembers();
            loadTrainerId();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Member update failed! Please check your input and try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

//save memeber

$('#saveMemeber').click(function () {

    let id = $('#member_id').val();
    let email = $('#member_email').val();
    let name = $('#member_name').val();
    let trainer_id = $('#tra_id').val();
    let password = $('#memeber_password').val();

    console.log(id);
    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/registration',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({"uid": id, "email": email, "password": password, "name": name, "trainer_id": trainer_id}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("Member registration successful!");
            $('#memberModal').modal('hide');
            getAllMembers();
            loadTrainerId();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Member registration failed! Please check your input and try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

function getAllMembers() {
    $('#tblMember').empty();
    // members get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAllUsers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            console.log(response.data);
            console.log(response.data);
             memberList = response.data;
            if (memberList.length === 0) {
                alert("No members found.");
                return;
            }

            $.each(response.data, function (index, member) {
                meal_id = member.meal_plan_id;
                workout_id = member.workout_id;
                let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td></tr>`;
                $('#tblMember').append(row);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve members. Please try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}

$('#tblMember').on('click', 'tr', function () {

    // Access the data in the clicked row
    let memberId = $(this).find('td:first').text(); // Assuming the first cell contains the trainer ID
    let memberName = $(this).find('td:nth-child(2)').text(); // Assuming the second cell contains the trainer email
    let memberEmail = $(this).find('td:nth-child(3)').text();
    let trainerId = $(this).find('td:nth-child(4)').text();
    let password = $(this).find('td:nth-child(5)').text();
    // Perform actions with the retrieved data
    $('#memberModal').modal('show');
    $('#saveMemeber').css("display", 'none');
    $('#updateMember').css("display", 'block');
    $('#deleteMember').css("display", 'block');
    $('#member_id').val(memberId);
    $('#member_name').val(memberName);
    $('#member_email').val(memberEmail);
    $('#tra_id').val(trainerId);
    $('#memeber_password').val(password);

});
$('#closeBtn').click(function () {
    $('#updateMember').css("display", 'none');
    $('#deleteMember').css("display", 'none');
});
$('#addMemberBTn').click(function () {
    $('#updateMember').css("display", 'none');
    $('#deleteMember').css("display", 'none');
    $('#saveMemeber').css("display", 'block');
    $('#member_id').val("");
    $('#member_name').val("");
    $('#member_email').val("");
    $('#tra_id').val("");
    $('#memeber_password').val("");
});

function loadTrainerId() {
    $('#tra_id').empty();
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getAllTrainers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {

            $.each(response.data, function (index, trainer) {
                $('#tra_id').append(`<option>${trainer.tid}</option>`);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}
