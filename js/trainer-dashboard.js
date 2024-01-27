let trainerEmail;
let totalMembersCount;
let totalMealPlansCount;
let totalWorkoutsCount;


$(window).on('load', function() {
    trainerEmail = localStorage.getItem('trainer-email');
    $("#trainerEmail").text(trainerEmail);
    loadTrainerIdUsingEmail(trainerEmail)
    loadAndCountTotalMealPlans();
    loadAndCountTotalWorkoutPlans();
    loadMembers();
    var currentDate = new Date();
    var currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);
    var currentYear = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(currentDate);

    $("#lblCalorieIntake").text("Daily Calorie Intake - " + currentMonthName +" "+ currentYear);

});

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
let calorieDateList = [];
let calorieAmountList = [];
var dynamicChart ;
var  dynamicChart1;
$('#searchByUser').click(function () {

    let uid = $('#searchByUser').val();
    calorieDateList= [];
    calorieAmountList=[];
    if (typeof dynamicChart !== 'undefined') {
        dynamicChart.destroy();
    }
    console.log(uid)
    getMealRecordsByUser(uid)
});
$('#searchByUserWorkOut').click(function () {

    let uid = $('#searchByUserWorkOut').val();

    if (typeof dynamicChart1 !== 'undefined') {
        dynamicChart1.destroy();
    }
    console.log(uid)
    getWorkOutRecordsByUser(uid)
});
function loadMembers() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: trainerEmail},
        success: function (response) {
            let client = response.data.users;
            if (client.length === 0) {
                alert("No clients found.");
                return;
            }
            console.log(response.data.users);
            $.each(response.data.users, function (index, trainer) {
                userId = trainer.uid;
                getClientsWithTrainer();
                // let row = `<tr><td>${trainer.uid}</td><td>${trainer.name}</td><td>${trainer.email}</td><td>${trainer.meal_plan_id}</td><td >${trainer.workout_id}</td></tr>`;
                // $('#tblClient').append(row);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });

}

function getClientsWithTrainer() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer/'+userId,
        method: 'GET',

        contentType: 'application/json',

        success: function (response) {


            console.log(response.data);
            $.each(response.data, function (index, member) {
                $('#searchByUser').append(`<option>${member.uid}</option>`);
                $('#searchByUserWorkOut').append(`<option>${member.uid}</option>`);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });

}


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

            if(response.data.length!==0){
                setDataToCalorieIntakeChart();
            }else {
                $('.npResImg').removeClass("d-none");
            }

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

    if (aggregatedDates.length === 0) {
        // Display a message or take any other action
        $('.npResImg').removeClass("d-none");
        console.log("No data available for the selected user.");
        return;
    }else {
        $('.npResImg').addClass("d-none");
    }
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
                console.log(workOutCalorieAmountList);

            });
            if(response.data.length!==0){
                setDataToCalorieBurnOutChart();
            }else {
                $('.npResImg1').removeClass("d-none");
            }


        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


function setDataToCalorieBurnOutChart(){
    var ctx = $("#areaChartCalorieIntakeWorkOut")[0].getContext('2d');

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
    if (aggregatedDates.length === 0) {
        // Display a message or take any other action
        $('.npResImg1').removeClass("d-none");
        console.log("No data available for the selected user.");
        return;
    }else {
        $('.npResImg1').addClass("d-none");
    }
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