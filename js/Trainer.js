function getAllTrainers() {

// trainerGet All
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getAllTrainers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function(response) {
            console.log(response.data);
            console.log(response.data.email);

            $.each(response.data, function(index, trainer) {
                let row = `<tr><td>${trainer.tid}</td><td>${trainer.email}</td><td>${trainer.category}</td></tr>`;
                $('#tblTrainer').append(row);
            });

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}

getAllTrainers();
$('#saveTrainer').click(function () {

    let id = $('#trainer_id').val();
    let email = $('#trainer_email').val();
    let password =$('#trainer_password').val();
    let category = $('#trainer_category').val();

    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/registration',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({"id":id,  "email": email, "password": password, "category":category }),  // Convert data to JSON string
        success: function(response) {
            console.log(response);


        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

