let userEmail = localStorage.getItem("userEmail");
let currUserWorkoutId;
let currUserBreakfastMealId;
let currUserLunchMealId;
let currUserDinnerMealId;
let currUserTrainerId;
let userId;
let userName;
let age;
let email;
let gender;
let breakFastId;
let lunchId;
let dinnerId;
$(window).on('load', function () {
    $(".mealTab").css({
        display: "none"
    })

    $("#mealLink").removeClass("text-primary")
    $("#mealLink").css({
        color: "#5c7ddcb5"
    })

    mealAndWorkoutCardHandler();
    searchUserWithEmail();
    getGoalsByUser();
    getMealPlanDetails();
    getAllProgress()
    var currentDate = new Date();
    var currentMonthName = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(currentDate);
    var currentYear = new Intl.DateTimeFormat('en-US', {year: 'numeric'}).format(currentDate);

    $("#lblCalorieIntake").text("Daily Calorie Intake - " + currentMonthName + " " + currentYear);
    $("#lblCalorieBurnOut").text("Daily Calorie Burnout - " + currentMonthName + " " + currentYear);

});


function searchUserWithEmail() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: userEmail},
        success: function (response) {
            $('#nameLbl').text(response.data.name);
            localStorage.setItem("name", response.data.name);
            uId = response.data.uid;
            userId = response.data.uid;
              userName = response.data.name;
              age = response.data.name;
              email = response.data.email;
              gender = response.data.gender;
              breakFastId = response.data.breakFastMeal;
              lunchId = response.data.lunchMeal;
              dinnerId = response.data.dinnerMeal;

            currUserWorkoutId = response.data.workout_id;
            currUserBreakfastMealId = response.data.breakFastMeal;
            currUserLunchMealId = response.data.lunchMeal;
            currUserDinnerMealId = response.data.dinnerMeal;
            currUserTrainerId = response.data.trainer_id;

            if (currUserTrainerId == 0) {
                $("#trainerId").text("No trainer");
            } else {
                $.ajax({
                    url: 'http://localhost:8080/api/v1/trainer/getTrainer/'+ currUserTrainerId,
                    method: 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (response) {
                        console.log(response);
                        let currUserTrainerName = response.data.name;
                        $("#trainerId").text(currUserTrainerName);
                    },
                    error: function (jqXHR) {
                        console.log(jqXHR.responseText);
                    }
                })
            }

            getDataToAreaChart(uId);
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}
let currUserWorkoutDescription;
let currUserWorkoutName;
let currUserWorkoutCalories;

function getWorkoutPlan() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/getAllWorkOutPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (workoutResponse) {
            console.log(workoutResponse);
            $.each(workoutResponse.data, function (index, workOut) {

                if (currUserWorkoutId == workOut.wid) {

                    currUserWorkoutName = workOut.planName;
                    currUserWorkoutDescription = workOut.planDetails;
                    currUserWorkoutCalories = workOut.burnsCalorieCount;

                    $("#lblWorkPLanName").text(currUserWorkoutName);
                    $("#pWorkTab").text(currUserWorkoutDescription);
                    $("#lblWorkCalories").text(currUserWorkoutCalories + " calories");
                }
            });

            if ($("#lblWorkPLanName").text() === "") {
                $("#lblWorkPLanName").text("No Workout Plan");
            }
            getMealPlan();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
}

function getMealPlan() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getAllMealPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (mealResponse) {
            console.log(mealResponse);

            $.each(mealResponse.data, function (index, meal) {
                if (currUserBreakfastMealId == meal.mid) {
                    currUserBreakfastMealName = meal.planName;
                    currUserBreakfastMealDescription = meal.planDetails;
                    currUserBreakfastMealCalories = meal.calorieCount;

                    $("#lblBreakfastMealPLanName").text(currUserBreakfastMealName);
                    $("#pBreakfastMealTab").text(currUserBreakfastMealDescription);
                    $("#lblBreakfastMealCalories").text(currUserBreakfastMealCalories + " calories");
                }
                if (currUserLunchMealId == meal.mid) {
                    currUserLunchMealName = meal.planName;
                    currUserLunchMealDescription = meal.planDetails;
                    currUserLunchMealCalories = meal.calorieCount;

                    $("#lblLunchMealPLanName").text(currUserBreakfastMealName);
                    $("#pLunchMealTab").text(currUserBreakfastMealDescription);
                    $("#lblLunchMealCalories").text(currUserBreakfastMealCalories + " calories");
                }
                if (currUserDinnerMealId == meal.mid) {
                    currUserDinnerMealName = meal.planName;
                    currUserDinnerMealDescription = meal.planDetails;
                    currUserDinnerMealCalories = meal.calorieCount;

                    $("#lblDinnerMealPLanName").text(currUserBreakfastMealName);
                    $("#pDinnerMealTab").text(currUserBreakfastMealDescription);
                    $("#lblDinnerMealCalories").text(currUserBreakfastMealCalories + " calories");
                }
            });

            if ($("#lblMealPLanName").text() === "") {
                $("#lblMealPLanName").text("No Meal Plan");
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
}


let progressList;

function getDataToAreaChart(uId) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/getAllProgress/' + uId,
        method: 'GET',

        contentType: 'application/json',  // Set content type to JSON
        success: function (progressResponse) {
            console.log(progressResponse.data);
            console.log("@@" + progressResponse.data.length);

            progressList = progressResponse.data;
            formatAreaChartData();
            setCurrentBMIvalue();

            getMealRecordsByUser(uId);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}

function setCurrentBMIvalue() {
    if (progressList.length == 0) {
        $("#currentBMI").text("No Details Yet");
        return;
    }

    currentProgressValues = progressList[progressList.length - 1];
    currentHeight = currentProgressValues.height;
    currentWeight = currentProgressValues.weight;
    let currentHeightInMeters = currentHeight / 100;
    let currentBMI = parseFloat((currentWeight / (currentHeightInMeters * currentHeightInMeters)).toFixed(1));

    $("#currentBMI").text(currentBMI);
}

let dateList = [];
let bmiList = [];

function formatAreaChartData() {
    $.each(progressList, function (index, progress) {
        dateList.push(progress.date);

        let weight = progress.weight;
        let height = progress.height;
        let newHeight = height / 100;
        let bmi = parseFloat((weight / (newHeight * newHeight)).toFixed(1));
        bmiList.push(bmi);
    });
    setDataToAreaChart();
}

function setDataToAreaChart() {
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



































function mealAndWorkoutCardHandler() {
    $("#workoutLink").click(function () {
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

    $("#mealLink").click(function () {
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
}

// calorie intake chart ------------------------------------------------------------------------------------------------
let calorieDateList = [];
let calorieAmountList = [];
let mealType = [];

let dynamicChart;
let dynamicChart1;

function getMealRecordsByUser(uId) {
    console.log(uId);
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealRecords/getAllMealRecords/' + uId,
        method: 'GET',
        success: function (response) {
            console.log(response);

            $.each(response.data, function (index, mealRecord) {
                calorieDateList.push(mealRecord.date);
                console.log(mealRecord.meal)
                calorieAmountList.push(mealRecord.calories);
                mealType.push(mealRecord.meal);
                console.log(mealType)

            });
            setDataToCalorieIntakeChart();

            getWorkOutRecordsByUser(uId)
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


function setDataToCalorieIntakeChart() {
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


     dynamicChart = new Chart(ctx, {
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


// calorie burnOut chart ------------------------------------------------------------------------------------------------

let workOutCalorieDateList = [];
let workOutCalorieAmountList = [];

function getWorkOutRecordsByUser(uId) {
    console.log(uId);
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutRecords/getAllWorkOutRecords/' + uId,
        method: 'GET',
        success: function (response) {
            console.log(response);

            $.each(response.data, function (index, workOutRec) {
                workOutCalorieDateList.push(workOutRec.date);
                workOutCalorieAmountList.push(workOutRec.calories);
                console.log(workOutCalorieAmountList);

            });
            setDataToCalorieBurnOutChart();

            getWorkoutPlan();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


function setDataToCalorieBurnOutChart() {
    var ctx = $("#areaChartCalorieBurnOut")[0].getContext('2d');

    // Get current year and month
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1; // Months are zero-based, so add 1

    // Aggregate data by date
    var aggregatedData = {};
    for (var i = 0; i < workOutCalorieDateList.length; i++) {
        var date = new Date(workOutCalorieDateList[i]);
        if (date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth) {
            var formattedDate = ('0' + date.getDate()).slice(-2); // Convert to YYYY-MM-DD format
            if (!aggregatedData[formattedDate]) {
                aggregatedData[formattedDate] = 0;
            }
            aggregatedData[formattedDate] += workOutCalorieAmountList[i];
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

// new filter data


$("#mealFilter").click(function () {
    let filter = $("#mealFilter").val();
    console.log(filter)

    if (typeof dynamicChart !== 'undefined') {
        dynamicChart.destroy();
    } if (typeof dynamicChart1 !== 'undefined') {
        dynamicChart1.destroy();
    }
    setFilterDataToCalorieIntakeChart(filter);

})

function setFilterDataToCalorieIntakeChart(filter) {
    var ctx = $("#areaChartCalorieIntake")[0].getContext('2d');

    // Get current year and month
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1; // Months are zero-based, so add 1

    // Aggregate data by date
    var aggregatedData = {};
    for (var i = 0; i < calorieDateList.length; i++) {
        var date = new Date(calorieDateList[i]);
        if (date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth && mealType[i] === filter) {
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


     dynamicChart1 = new Chart(ctx, {
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

let fitGoals;
function getGoalsByUser() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/fitnessGoals/getAllGoals/' + userId,
        method: 'GET',
        success: function (response) {
            fitGoals = response.data;

              console.log(fitGoals)
            $.each(response.data, function (index, goal) {

            });
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

let breakmealPlanDetails;
let breakmealCalaroy;
let lunchMealPlanDetails;
let lunchMealCalary;
let dinnerMealPlanDetails;
let dinnerMealCalary;
function getMealPlanDetails() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + breakFastId,
        method: 'GET',
        success: function (response) {
            breakmealPlanDetails = response.data.meal_details;
            breakmealCalaroy =response.data.calories;
            console.log(response);

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + lunchId,
        method: 'GET',
        success: function (response) {
            console.log(response);
            lunchMealPlanDetails = response.data.meal_details;
            lunchMealCalary =response.data.calories;

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + dinnerId,
        method: 'GET',
        success: function (response) {
            console.log(response);
            dinnerMealPlanDetails = response.data.meal_details;
            dinnerMealCalary =response.data.calories;

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}

let progressData;
function getAllProgress() {

    // members get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/getAllProgress/' + userId,
        method: 'GET',

        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
             progressData = response.data;




        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
}

console.log("______________________________________________________________________________")
console.log(userName);
console.log(userEmail);
console.log(age);
console.log(gender);
console.log(fitGoals);
console.log(currUserWorkoutDescription);
console.log(currUserWorkoutCalories);
console.log(breakmealPlanDetails);
console.log(breakmealCalaroy);
console.log(lunchMealPlanDetails);
console.log(lunchMealCalary);
console.log(dinnerMealPlanDetails);
console.log(dinnerMealCalary);
console.log(progressData);

///chat gpt prompt

// $.ajax({
//     url: 'https://api.openai.com/v1/chat/completions',
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer '+Authorization,
//         'OpenAI-Organization':OpenAI_Organization
//
//     },
//     data: JSON.stringify({
//         "model": "gpt-3.5-turbo",
//         "messages": [{ "role": "user", "content": "In the food plan, give a numerical value of the calories of " + meal_details + " . The numerical value should come in the content. One answer can come. Not separately, the whole should come in one answer. No need for more details, calorie. Only the count should come.ex: 200 That's it" }]
//     }),
//     success: function (response) {
//         let calorieCount = response.choices[0].message.content.trim();
//         console.log("Calorie count:", calorieCount);
//
//
//     },
//     error: function (jqXHR) {
//         console.log(jqXHR);
//     }
// });

