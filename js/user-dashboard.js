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
            age = response.data.age;
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

            // getMealRecordsByUser(uId);

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
                        getMealPlan();

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
                    console.log(currUserWorkoutDescription);
                    console.log(currUserWorkoutCalories);
                    // getMealPlan(currUserWorkoutName,currUserWorkoutDescription,currUserWorkoutCalories);
                    // getMealPlan(currUserBreakfastMealId,currUserLunchMealId,currUserDinnerMealId)
                    $("#lblWorkPLanName").text(currUserWorkoutName);
                    $("#pWorkTab").text(currUserWorkoutDescription);
                    $("#lblWorkCalories").text(currUserWorkoutCalories + " calories");
                }
            });

            if ($("#lblWorkPLanName").text() === "") {
                $("#lblWorkPLanName").text("No Workout Plan");
            }
            getGoalsByUser();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
}

// getMealPlan();
function getMealPlan() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getAllMealPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (mealResponse) {
            console.log(mealResponse);


            $.each(mealResponse.data, function (index, meal) {
                console.log(currUserBreakfastMealId)
                console.log(meal.mid)
                let bMealId= meal.mid;
                let lMealId=meal.mid
                let dMealId=meal.mid

                if (bMealId ==currUserBreakfastMealId) {
                    console.log("breakfast")
                    currUserBreakfastMealName = meal.planName;
                    currUserBreakfastMealDescription = meal.planDetails;
                    currUserBreakfastMealCalories = meal.calorieCount;

                    $("#lblBreakfastMealPLanName").text(currUserBreakfastMealName);
                    $("#pBreakfastMealTab").text(currUserBreakfastMealDescription);
                    $("#lblBreakfastMealCalories").text(currUserBreakfastMealCalories + " calories");
                }
                if (lMealId==currUserLunchMealId) {

                    currUserLunchMealName = meal.planName;
                    currUserLunchMealDescription = meal.planDetails;
                    currUserLunchMealCalories = meal.calorieCount;

                    $("#lblLunchMealPLanName").text(currUserLunchMealName);
                    $("#pLunchMealTab").text(currUserLunchMealDescription);
                    $("#lblLunchMealCalories").text(currUserLunchMealCalories + " calories");
                }
                if (dMealId==currUserDinnerMealId) {
                    console.log("dinner")

                    currUserDinnerMealName = meal.planName;
                    currUserDinnerMealDescription = meal.planDetails;
                    currUserDinnerMealCalories = meal.calorieCount;

                    $("#lblDinnerMealPLanName").text(currUserDinnerMealName);
                    $("#pDinnerMealTab").text(currUserDinnerMealDescription);
                    $("#lblDinnerMealCalories").text(currUserDinnerMealCalories + " calories");
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
        url: 'http://localhost:8080/api/v1/mealRecords/getAllMealRecords/' +uId,
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

            console.log(response);
            $.each(response.data, function (index, goal) {

            });
            getMealPlanDetails();
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
        url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/'+breakFastId,
        method: 'GET',
        success: function (response) {
            breakmealPlanDetails = response.data.planDetails;
            breakmealCalaroy =response.data.calorieCount;
            console.log(response);

            getAllProgress()

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/'+lunchId,
        method: 'GET',
        success: function (response) {
            console.log(response);
            lunchMealPlanDetails = response.data.planDetails;
            lunchMealCalary =response.data.calorieCount;

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });

    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/'+dinnerId,
        method: 'GET',
        success: function (response) {
            console.log(response);
            dinnerMealPlanDetails = response.data.planDetails;
            dinnerMealCalary =response.data.calorieCount;

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
            console.log(response);

            console.log("__________________________")
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


                generateReport();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
}
$('#Summary').click(function () {
  generateReport();

});
function generateReport() {
    // Define reportData object
    let reportData = {
        name: userName,
        email: userEmail,
        age: age,
        gender: gender,
        fitGoals: fitGoals,
        currUserWorkoutDescription: currUserWorkoutDescription,
        currUserWorkoutCalories: currUserWorkoutCalories,
        breakmealPlanDetails: breakmealPlanDetails,
        breakmealCalaroy: breakmealCalaroy,
        lunchMealPlanDetails: lunchMealPlanDetails,
        lunchMealCalary: lunchMealCalary,
        dinnerMealPlanDetails: dinnerMealPlanDetails,
        dinnerMealCalary: dinnerMealCalary,
        progressData: progressData
    };

    // Add fitness goals to the array
    let fitnessGoals = [];
    for (let i = 0; i < fitGoals.length; i++) {
        fitnessGoals.push({
            goalName: fitGoals[i].goalName,
            goalDetails: fitGoals[i].goalDetails
        });
    }

    // Prepare progress data for report generation
    let progressEntries = [];
    for (let i = 0; i < progressData.length; i++) {
        progressEntries.push({
            "height": progressData[i].height,
            "weight": progressData[i].weight,
            "date": progressData[i].date
        });
    }

    let fitnessGoalsText = "";
    for (let i = 0; i < fitnessGoals.length; i++) {
        fitnessGoalsText += "{\n" +
            "My Fitness Goal\n" +
            "goalName - " + fitnessGoals[i].goalName + "\n" +
            "goalDetails - " + fitnessGoals[i].goalDetails + "\n" +
            "},\n";
    }
// Remove the trailing comma and newline
    fitnessGoalsText = fitnessGoalsText.slice(0, -2);
    console.log(fitnessGoalsText+" gpt 01")

    let progressText = "";
    for (let i = 0; i < progressEntries.length; i++) {
        progressText +="{\n" +
            "My progress \n" +
            "\"height\": " + progressEntries[i].height + ",\n" +
            "\"weight\": " + progressEntries[i].weight + ",\n" +
            "\"date\": " + progressEntries[i].date + "\n" +
            "}";
    }
    console.log(progressText+ " gpt 02")
// Remove the trailing comma and newline
    progressText = progressText.slice(0, -2);

    // Send data to OpenAI API for report generation
    $.ajax({
        url: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+Authorization,
            'OpenAI-Organization': OpenAI_Organization
        },
        data: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{
                "role": "user",
                "content": "generate detailed reports using the below data. generate a report using these points,\n" +
                    "greeting the user, what section needs to improve to achieve the goals, don't add progress details to the report.but generate summary using progress data.\n" +
                    "{\n" +
                    "My details - \n" +
                    "name - " + reportData.name + "\n" +
                    "email - " + reportData.email + "\n" +
                    "age - " + reportData.age + "\n" +
                    "gender - " + reportData.gender + "\n" +
                    "},\n" +
                     fitnessGoalsText +
                    "{\n" +
                    "My Workout plan - " + reportData.currUserWorkoutDescription + "\n" +
                    "details - " + reportData.currUserWorkoutCalories + "\n" +
                    "},\n" +
                    "{\n" +
                    "My Breakfast meal plan detail - " + reportData.breakmealPlanDetails + "\n" +
                    "gain calories - " + reportData.breakmealCalaroy + "\n" +
                    "\n" +
                    "My Lunch meal plan detail - " + reportData.lunchMealPlanDetails + "\n" +
                    "gain calories - " + reportData.lunchMealCalary + "\n" +
                    "},\n" +
                    progressText+
                    "]  remove   best regards  and add thank you word and add gym name is fitness gym center"

            }]
        }),
        success: function (response) {
            let summary = response.choices[0].message.content.trim();
            console.log("summary:", summary);
            $("#summary_textarea").append(summary);
        },
        error: function (jqXHR) {
            console.log(jqXHR);
        }
    });
}




