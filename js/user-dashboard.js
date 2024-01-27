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

    var currentDate = new Date();
    var currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
    var currentYear = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(currentDate);

    $("#lblCalorieIntake").text("Daily Calorie Intake - " + currentMonthName +" "+ currentYear);
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
            getMealRecordsByUser(uId);
            getWorkOutRecordsByUser(uId)
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

// calorie intake chart ------------------------------------------------------------------------------------------------
let calorieDateList = [];
let calorieAmountList = [];
function getMealRecordsByUser(uId){
    console.log(uId);
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealRecords/getAllMealRecords/'+uId,
        method: 'GET',
        success: function (response) {
            console.log(response);
            $.each(response.data, function (index, mealRecord) {
                calorieDateList.push(mealRecord.date);
                calorieAmountList.push(mealRecord.calories);

            });
            setDataToCalorieIntakeChart();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


let workOutCalorieDateList = [];
let workOutCalorieAmountList = [];
function getWorkOutRecordsByUser(uId){
    console.log(uId);
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutRecords/getAllWorkOutRecords/'+uId,
        method: 'GET',
        success: function (response) {
            console.log(response);
            $.each(response.data, function (index, workOutRec) {
                workOutCalorieDateList.push(workOutRec.date);
                workOutCalorieAmountList.push(workOutRec.calories);

            });

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function setDataToCalorieIntakeChart(){
    var ctx = $("#areaChartCalorieIntake")[0].getContext('2d');

    // Get current year and month
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1; // Months are zero-based, so add 1

    // Aggregate data by date
    var aggregatedData = {};
    for (var i = 0; i < calorieDateList.length; i++) {
        var date = new Date(calorieDateList[i]);
        if (date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth) {
            var formattedDate = ('0' + date.getDate()).slice(-2); // Convert to YYYY-MM-DD format
            if (!aggregatedData[formattedDate]) {
                aggregatedData[formattedDate] = 0;
            }
            aggregatedData[formattedDate] += calorieAmountList[i];
        }
    }

    // Extract aggregated dates and amounts
    var aggregatedDates = Object.keys(aggregatedData);
    var aggregatedAmounts = Object.values(aggregatedData);

    var dynamicChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: aggregatedDates,
            datasets: [{
                label: 'Calorie Count',
                data: aggregatedAmounts,
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