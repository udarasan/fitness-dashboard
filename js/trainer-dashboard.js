let trainerEmail;
let totalMembersCount;
let totalMealPlansCount;
let totalWorkoutsCount;



window.onload = function () {
    trainerEmail = localStorage.getItem('trainer-email');
    $("#trainerEmail").text(trainerEmail);
    loadTrainerIdUsingEmail(trainerEmail)
    loadAndCountTotalMealPlans();
    loadAndCountTotalWorkoutPlans();

}

function loadTrainerIdUsingEmail(trainerEmail) {
    console.log(trainerEmail);
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: trainerEmail},

        success: function (response) {
            console.log(response);
            console.log(response.data.tid);
            let trainerId = response.data.tid;
            countAllMembersUsingId(trainerId);

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


function countAllMembersUsingId(trainerId) {

    console.log(trainerId);
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer/' + trainerId,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        // data:{email:trainerId},

        success: function (response) {
            console.log(response);
            console.log(response.data.length);
            totalMembersCount=response.data.length;
            $("#totalClients").text(totalMembersCount);

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })

}


function loadAndCountTotalMealPlans(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getAllMealPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            console.log(response.data);
            console.log(response.data.length);
            totalMealPlansCount=response.data.length;
            $("#totalMealPlans").text(totalMealPlansCount);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });

}

function loadAndCountTotalWorkoutPlans(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/getAllWorkOutPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
           console.log( response.data);
           console.log(response.data.length);
           totalWorkoutsCount=response.data.length;
            $("#totalWorkoutPlans").text(totalWorkoutsCount);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve workouts. Please try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });

}