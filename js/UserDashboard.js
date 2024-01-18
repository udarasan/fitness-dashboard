let userEmail=localStorage.getItem("userEmail");

$(document).ready(function () {
    $(".mealTab").css({
        display: "none"
    })

    $("#mealLink").css({
        color: "#ffffff96"
    })


    mealAndWorkoutCardHandler();
    searchUserWithEmail();
});

let currUserWorkoutId;
let currUserMealId;
let currUserTrainerId;
function searchUserWithEmail(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data:{email:userEmail},
        success: function (response) {
            uId= response.data.uid;
            currUserWorkoutId = response.data.workout_id;
            currUserMealId = response.data.meal_plan_id;
            currUserTrainerId = response.data.trainer_id;

            $("#trainerId").text(currUserTrainerId);

            getDataToAreaChart(uId);
            getWorkoutPlan();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function getWorkoutPlan(){
    // get All workout plans
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/getAllWorkOutPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            $.each(response.data, function (index, workOut) {
                // check for current users' workout plan
                if(currUserWorkoutId == workOut.wid){
                    currUserWorkoutName = workOut.planName;
                    currUserWorkoutDescription = workOut.planDetails;
                    currUserWorkoutCalories = workOut.burnsCalorieCount;

                    $("#lblWorkPLanName").text(currUserWorkoutName);
                    $("#pWorkTab").text(currUserWorkoutDescription);
                    $("#lblWorkCalories").text(currUserWorkoutCalories+" calories");
                }
            });
            getMealPlan();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
};

function getMealPlan(){
    // get All meal plans
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getAllMealPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            $.each(response.data, function (index, meal) {
                // check for current users' meal plan
                if(currUserMealId == meal.mid){
                    currUserMealName = meal.planName;
                    currUserMealDescription = meal.planDetails;
                    currUserMealCalories = meal.calorieCount;

                    $("#lblMealPLanName").text(currUserMealName);
                    $("#pMealTab").text(currUserMealDescription);
                    $("#lblMealCalories").text(currUserMealCalories+" calories");
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}

let progressList;
function getDataToAreaChart(uId){
    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/getAllProgress/'+uId,
        method: 'GET',

        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            progressList=response.data;
            formatAreaChartData();
            setCurrentBMIvalue();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
};

function setCurrentBMIvalue() {
    currentProgressValues = progressList[progressList.length - 1];
    currentHeight = currentProgressValues.height;
     currentWeight = currentProgressValues.weight;
    let currentHeightInMeters = currentHeight / 100;
    let currentBMI = parseFloat((currentWeight / (currentHeightInMeters * currentHeightInMeters)).toFixed(1));
    $("#currentBMI").text(currentBMI);
}

let dateList = [];
let bmiList = [];
function formatAreaChartData(){
    $.each(progressList, function (index, progress) {
        dateList.push(progress.date);

        let weight = progress.weight;
        let height = progress.height;
        let newHeight = height / 100;
        let bmi = parseFloat((weight / (newHeight * newHeight)).toFixed(1));
        bmiList.push(bmi);
    });
    setDataToAreaChart();
};

function setDataToAreaChart(){
    var ctx = $("#myAreaChart")[0].getContext('2d');

    // Input data
    var labels = dateList;
    var data = bmiList;

    // Calculate average BMI for each month
    var monthlyAverages = {};
    labels.forEach(function (label, index) {
        var date = new Date(label);
        var monthYear = date.toLocaleString('default', {month: 'long', year: 'numeric'});
        if (!monthlyAverages[monthYear]) {
            monthlyAverages[monthYear] = {sum: 0, count: 0};
        }
        monthlyAverages[monthYear].sum += data[index];
        monthlyAverages[monthYear].count++;
    });

    var averageBMIs = Object.keys(monthlyAverages).map(function (monthYear) {
        return monthlyAverages[monthYear].sum / monthlyAverages[monthYear].count;
    });

    var dynamicChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(monthlyAverages),
            datasets: [{
                label: 'Average BMI',
                data: averageBMIs,
                lineTension: 0.1,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "#2d324a",
                pointRadius: 3,
                pointBackgroundColor: "#2d324a",
                pointBorderColor: "#2d324a",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
            }]
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'day',
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        // maxTicksLimit: 7,
                        padding: 10
                    },
                }],
                yAxes: [{
                    ticks: {
                        // maxTicksLimit: 5,
                        padding: 10,
                        // suggestedMin: 5,
                        // beginAtZero: true,
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
            }
        }

    });
}

function mealAndWorkoutCardHandler(){
    $("#workoutLink").click(function(){
        $(".mealTab").css({
            display: "none"
        })
        $(".workoutTab").css({
            display: "block"
        })
        $("#workoutLink").css({
            color: "white"
        })
        $("#mealLink").css({
            color: "#ffffff96"
        })
    });

    $("#mealLink").click(function(){
        $(".workoutTab").css({
            display: "none"
        })
        $(".mealTab").css({
            display: "block"
        })
        $("#mealLink").css({
            color: "white"
        })
        $("#workoutLink").css({
            color: "#ffffff96"
        })
    });
};
