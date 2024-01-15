let email = localStorage.getItem('trainer-email');
$(document).ready(function () {
    // Your JavaScript code goes here

    $('#trainerEmail').text(email);
    getClients();
});

function getClients() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: email},
        success: function (response) {
            console.log(response.data.users);
            $.each(response.data.users, function (index, trainer) {
                let row = `<tr><td>${trainer.uid}</td><td>${trainer.name}</td><td>${trainer.email}</td><td>${trainer.meal_plan_id}</td><td >${trainer.workout_id}</td></tr>`;
                $('#tblClient').append(row);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });

}
