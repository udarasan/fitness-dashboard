getAllTrainers();

//save trainer
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




$('#tblTrainer').on('click', 'tr', function() {


    // Access the data in the clicked row
    let trainerId = $(this).find('td:first').text(); // Assuming the first cell contains the trainer ID
    let trainerEmail = $(this).find('td:nth-child(2)').text(); // Assuming the second cell contains the trainer email

    // Perform actions with the retrieved data
    console.log("Clicked trainer ID: " + trainerId);
    console.log("Clicked trainer email: " + trainerEmail);
    $('#trainerModal').modal('show');
    $('#trainer_id').val(trainerId);
    $('#trainer_email').val(trainerEmail);
    // Add your additional logic here based on the clicked row
});

