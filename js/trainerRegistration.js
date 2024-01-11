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