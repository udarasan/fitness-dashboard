let userEmail=localStorage.getItem("userEmail");

$(window).on('load', function() {
    $(".mealTab").css({
        display: "none"
    })

    $("#mealLink").removeClass("text-primary")
    $("#mealLink").css({
        color: "#5c7ddcb5"
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
            $('#nameLbl').text(response.data.name);
            localStorage.setItem("name",response.data.name);
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
                lineTension: 0.2,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgb(255,0,0)",
                pointHoverBorderColor: "rgb(255,0,0)",
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
            color: "#4e73df"
        })
        $("#mealLink").css({
            color: "#5c7ddcb5"
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
            color: "#4e73df"
        })
        $("#workoutLink").removeClass("text-primary")
        $("#workoutLink").css({
            color: "#5c7ddcb5"
        })
    });
};
