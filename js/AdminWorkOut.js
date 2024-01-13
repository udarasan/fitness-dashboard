getAllWorkoutPlans();

$("#modalAddNew").click(function() {
    let name = $('#planName').val();
    let details = $('#planDetails').val();
    let calCount =$('#planCalorieCount').val();

    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/save',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({"planName":name,  "planDetails": details, "burnsCalorieCount": calCount }),  // Convert data to JSON string
        success: function(response) {
            console.log(response);
            $(".gridContainer").empty();
            getAllWorkoutPlans();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

$("#searchWorkoutPlans").keyup(function(){
    let text = $('#searchWorkoutPlans').val();
    console.log(text);
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/plansByPartName',
        method: 'GET',
        dataType: 'json',
        // contentType: 'application/json',  // Set content type to JSON
        data: { partialName: text },   // Convert data to JSON string
        success: function(response) {
            console.log(response);
            $(".gridContainer").empty();
            $.each(response.data, function(index, workOut) {
                let card = `<div class="card workoutCard text-left p-0 ">
                            <div class="card-header px-4">
                                ${workOut.planName}
                            </div>
                            <div class="card-body px-4">
                                <p class="card-text">${workOut.planDetails}</p>
                                <p class="card-text">calorie count: ${workOut.burnsCalorieCount} calories</p>
                            </div>
                        </div>`

                $(".gridContainer").append(card);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

function getAllWorkoutPlans(){
    // work out Get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/getAllWorkOutPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function(response) {

            $.each(response.data, function(index, workOut) {
                let card = `<div class="card workoutCard text-left p-0 ">
                            <div class="card-header px-4">
                                ${workOut.planName}
                            </div>
                            <div class="card-body px-4">
                                <p class="card-text">${workOut.planDetails}</p>
                                <p class="card-text">calorie count: ${workOut.burnsCalorieCount} calories</p>
                            </div>
                        </div>`

                $(".gridContainer").append(card);
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}