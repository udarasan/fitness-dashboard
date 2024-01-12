// work out Get All
$.ajax({
    url: 'http://localhost:8080/api/v1/workoutplan/getAllWorkOutPlans',
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',  // Set content type to JSON
    success: function(response) {


        $.each(response.data, function(index, workOut) {
            // let row = `<tr><td>${trainer.tid}</td><td>${trainer.email}</td><td>${trainer.category}</td></tr>`;
            // $('#tblTrainer').append(row);
        });

    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error(jqXHR.responseText);  // Log the response text for debugging
    }
});