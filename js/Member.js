let meal_id;
let workout_id;
var selectedValue;
$(document).ready(function () {
    // Your JavaScript code goes here
    getAllMembers();
    loadTrainerId();
});
$(".form-check-input").on("click", function () {
     selectedValue = $("input[name='inlineRadioOptions']:checked").val();
    console.log("Selected value: " + selectedValue);
    // Perform additional actions with the selected value as needed
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
    let age = $('#age').val();
    let gender = selectedValue  ;
    // let male = $('#inlineRadio1').val();
    // let female = $('#inlineRadio2').val();
    // let custom = $('#inlineRadio3').val();
    // if (male!=null){
    //     gender=male;
    // }
    // if (female!=null){
    //     gender=female;
    // }
    // if (custom!=null){
    //     gender=custom;
    // }
    if ( !email || !name || !password) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!isValidEmail(email)) {
        $('#emailErrorLabel').text("Please enter a valid email address.");

    } else {
        $('#emailErrorLabel').text(""); // Clear the error label
    }
    if (!isValidPassword(password)) {
        $('#pwdErrorLabel').text("Please enter a password with 6 to 20 characters.");

    } else {
        $('#pwdErrorLabel').text(""); // Clear the error label
    }

    if (!isValidName(name)) {
        $('#nameErrorLabel').text("Please enter a name with 2 to 50 characters");

    } else {
        $('#nameErrorLabel').text(""); // Clear the error label
    }
    if (isNaN(age)) {
        $('#ageErrorLabel').text("Invalid input type");

    } else {
        $('#ageErrorLabel').text(""); // Clear the error label
    }
    console.log(trainer_id);
    if (isValidName(name) && isValidEmail(email) && isValidPassword(password)  && !isNaN(age)) {
        // Make the AJAX request
        $.ajax({
            url: 'http://localhost:8080/api/v1/user/update',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',  // Set content type to JSON

            data: JSON.stringify({
                "uid": id,
                "email": email,
                "password": password,
                "name": name,
                "trainer_id": trainer_id,
                "meal_plan_id": meal_id,
                "workout_id": workout_id,
                "age":age ,
                "gender":gender
            }),  // Convert data to JSON string
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
    }
});

//save memeber

$('#saveMemeber').click(function () {

    let id = $('#member_id').val();
    let email = $('#member_email').val();
    let name = $('#member_name').val();
    let trainer_id = $('#tra_id').val();
    let password = $('#memeber_password').val();
    let age = $('#age').val();
    let gender =  selectedValue ;
    // let male = $('#inlineRadio1').val();
    // let female = $('#inlineRadio2').val();
    // let custom = $('#inlineRadio3').val();
    // if (male!=null){
    //     gender=male;
    //
    // }
    // if (female!=null){
    //     gender=female;
    // }
    // if (custom!=null){
    //     gender=custom;
    // }
    if ( !email || !name || !password ) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!isValidEmail(email)) {
        $('#emailErrorLabel').text("Please enter a valid email address.");

    } else {
        $('#emailErrorLabel').text(""); // Clear the error label
    }
    if (!isValidPassword(password)) {
        $('#pwdErrorLabel').text("Please enter a password with 6 to 20 characters.");

    } else {
        $('#pwdErrorLabel').text(""); // Clear the error label
    }

    if (!isValidName(name)) {
        $('#nameErrorLabel').text("Please enter a name with 2 to 50 characters");

    } else {
        $('#nameErrorLabel').text(""); // Clear the error label
    }
    if (isNaN(age)) {
        $('#ageErrorLabel').text("Invalid input type");

    } else {
        $('#ageErrorLabel').text(""); // Clear the error label
    }

if (isValidName(name) && isValidEmail(email) && isValidPassword(password) && !isNaN(age)) {
    console.log(id);
    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/registration',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({"uid": id, "email": email, "password": password, "name": name, "trainer_id": trainer_id, "age":age ,"gender":gender}),  // Convert data to JSON string
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
}
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
             memberList = response.data;
            if (memberList.length === 0) {
                alert("No members found.");
                return;
            }

            $.each(response.data, function (index, member) {
                meal_id = member.meal_plan_id;
                workout_id = member.workout_id;
                let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td><td>${member.meal_plan_id}</td><td>${member.workout_id}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
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
    let age = $(this).find('td:nth-child(8)').text();
    let gender = $(this).find('td:nth-child(9)').text();
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
    $('#age').val(age);
    // $('#gender').val(gender);
    if (gender === 'male') {
        $('#inlineRadio1').prop('checked', true);
    } else if (gender === 'female') {
        $('#inlineRadio2').prop('checked', true);
    } else if (gender === 'custom') {
        $('#inlineRadio3').prop('checked', true);
    }

});
$('#closeBtn').click(function () {
    $('#updateMember').css("display", 'none');
    $('#deleteMember').css("display", 'none');
    $('#emailErrorLabel').text("");
    $('#nameErrorLabel').text("");
    $('#pwdErrorLabel').text("");
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
    $('#emailErrorLabel').text("");
    $('#nameErrorLabel').text("");
    $('#pwdErrorLabel').text("");
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
