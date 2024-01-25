$(window).on('load', function() {
    getTrainerCount();



});
var trainerCount;
var memberCount;
var workoutCount;
var mealCount;
var equipmentCount;
function pieChart() {
    const chartData = {
        labels: ["Trainers", "Members", "MealPlans", "WorkOutPlans","Equipments"],
        data: [trainerCount, memberCount, mealCount, workoutCount,equipmentCount],
    };

    const myChart = document.querySelector(".my-chart");
    const ul = document.querySelector(".programming-stats .details ul");

    new Chart(myChart, {
        type: "doughnut",
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: "Count",
                    data: chartData.data,
                },
            ],
        },
        options: {
            borderWidth: 10,
            borderRadius: 2,
            hoverBorderWidth: 0,
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });

    const populateUl = () => {
        chartData.labels.forEach((l, i) => {
            let li = document.createElement("li");
            li.innerHTML = `${l}: <span class='percentage'>${chartData.data[i]}%</span>`;
            ul.appendChild(li);
        });
    };

    populateUl();
}

function getTrainerCount(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/getTrainerCount',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            trainerCount = response.data;
            console.log(trainerCount)
            $("#trainersCount").text(trainerCount);
            getMemberCount();

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function getMemberCount(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/getMemberCount',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            memberCount = response.data;
            $("#membersCount").text(memberCount);
            getWorkoutPlansCount();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function getWorkoutPlansCount(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/getWorkoutPlanCount',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            workoutCount = response.data;

            if(workoutCount==1){
                $("#workoutCount").text(workoutCount);
                $("#lblWorkoutCount").text("Workout Plan");
            }else{
                $("#workoutCount").text(workoutCount);
            }

            getMealPlansCount();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function getMealPlansCount(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/getMealPlanCount',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            mealCount = response.data;

            if(mealCount==1){
                $("#mealCount").text(mealCount);
                $("#lblMealCount").text("Meal Plan");
            }else{
                $("#mealCount").text(workoutCount);
            }
            getEquipmentCount()
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function getEquipmentCount(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/getEquipmentCount',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            equipmentCount = response.data;


            pieChart();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}





