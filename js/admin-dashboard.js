$('#nameLbl').text(localStorage.getItem('adminEmail'));
$(window).on('load', function () {
    getTrainerCount();
    loadUserIdsToProgress();


});
var trainerCount;
var memberCount;
var workoutCount;
var mealCount;
var equipmentCount;

function barChart(mealRegisteredMembers, workoutRegisteredMembers) {
    const chartData = {
        labels: ["T", "M", "W"],
        data: [memberCount, mealRegisteredMembers, workoutRegisteredMembers],
    };

    const myChart = document.querySelector(".my-bar-chart");
    const ul = document.querySelector("#bar-chart .programming-stats .details ul");

    new Chart(myChart, {
        type: "bar",
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

            if(l === "T") {
                li.innerHTML = `${l} -Total Members: <span class='percentage'>${chartData.data[i]}</span>`;
            }else if(l === "M") {
                li.innerHTML = `${l} -Meal Plan Registered Members: <span class='percentage'>${chartData.data[i]}</span>`;
            }else if(l === "W") {
                li.innerHTML = `${l} -Workout Plan Registered Members: <span class='percentage'>${chartData.data[i]}</span>`;
            }
            ul.appendChild(li);
        });
    };

    populateUl();
}

function pieChart(activeTrainerCount) {

    let inactiveTrainerCount = trainerCount - activeTrainerCount;

    let letActiveTrainerPercentage = ((activeTrainerCount / trainerCount) * 100).toFixed(2);
    let letInactiveTrainerPercentage = ((inactiveTrainerCount / trainerCount) * 100).toFixed(2);

    const chartData = {
        labels: ["Active Trainers", "Inactive Trainers"],
        data: [letActiveTrainerPercentage, letInactiveTrainerPercentage],
    };

    const myChart = document.querySelector("#trainer-pie-chart .my-pie-chart");
    const ul = document.querySelector("#trainer-pie-chart .programming-stats .details ul");

    new Chart(myChart, {
        type: "pie",
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: "Percentage(%)",
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
        let li1 = document.createElement("li");
        li1.innerHTML = `Total Trainers: <span class='percentage'>${trainerCount}</span>`;
        ul.appendChild(li1);

        chartData.labels.forEach((l, i) => {
            let li = document.createElement("li");
            li.innerHTML = `${l}: <span class='percentage'>${chartData.data[i]}%</span>`;
            ul.appendChild(li);
        });
    };

    populateUl();
}

function getTrainerCount() {
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

function getMemberCount() {
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

function getWorkoutPlansCount() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/getWorkoutPlanCount',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            workoutCount = response.data;
            if (workoutCount == 1) {
                $("#workoutCount").text(workoutCount);
                $("#lblWorkoutCount").text("Workout Plan");
            } else {
                $("#workoutCount").text(workoutCount);
            }
            getMealPlansCount();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function getMealPlansCount() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/getMealPlanCount',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            mealCount = response.data;
            if (mealCount == 1) {
                $("#mealCount").text(mealCount);
                $("#lblMealCount").text("Meal Plan");
            } else {
                $("#mealCount").text(workoutCount);
            }
            getEquipmentCount()
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function getEquipmentCount() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/getEquipmentCount',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            equipmentCount = response.data;
            // pieChart();
            getMealAndWorkoutRegisteredMembersCount();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function getMealAndWorkoutRegisteredMembersCount() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAllUsers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            let mealRegisteredMembers=0;
            let workoutRegisteredMembers=0;
            response.data.forEach(function(member) {
                if(member.meal_plan_id != 0) {
                    mealRegisteredMembers++;
                }
                if(member.workout_id != 0) {
                    workoutRegisteredMembers++;
                }
            });

            barChart(mealRegisteredMembers, workoutRegisteredMembers);

            getActiveTrainerCount();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function getActiveTrainerCount() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/admin/getActiveTrainerCount',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            let activeTrainerCount = response.data;

            pieChart(activeTrainerCount);
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

//new

function loadUserIdsToProgress() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAllUsers',
        method: 'GET',
        success: function (response) {
            getAllMembersResponse = response;
            console.log(response);

            $("#searchProgressByUser").empty();
            let firstOpt = ` <option class="d-none" value="" selected>-- select member --</option>`;
            $("#searchProgressByUser").append(firstOpt);

            $.each(response.data, function (index, members) {
                console.log(members);
                $("#searchProgressByUser").append(`<option value="${members.uid}">${members.name}</option>`)
            })
        },
        error: function (xhr) {
            console.log(xhr);
        }
    })
}

let adminMemberDynamicChart;
let newDynamicChart;

let adminProgressList = [];
let newCalorieDateList = []
let newCalorieAmountList = []
let newWorkOutCalorieDateList = []
let newWorkOutCalorieAmountList = []

let userName;
let mealPlan;
let workoutPlanName;

function getMemberDetail(uId) {

    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser/' + uId,
        method: 'GET',
        success: function (response) {
            console.log(response.data.name);
            userName = response.data.name;
            console.log(response.data.gender);
            let meal_plan_id = response.data.meal_plan_id;
            let workoutId = response.data.workout_id
            if (meal_plan_id !== 0) {
                $.ajax({
                    url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + meal_plan_id,
                    method: 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (mealResponse) {


                        mealPlan = mealResponse.data.planName;


                        $.ajax({
                            url: 'http://localhost:8080/api/v1/workoutplan/getWorkOutPlan/' + workoutId,
                            method: 'GET',
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (workoutResponse) {
                                console.log(workoutResponse);
                                workoutPlanName = workoutResponse.data.planName;

                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.error(jqXHR.responseText);
                                workoutPlanName = "Not Assign"
                            }
                        });


                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR.responseText);

                    }
                });
            } else {
                $.ajax({
                    url: 'http://localhost:8080/api/v1/workoutplan/getWorkOutPlan/' + workoutId,
                    method: 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (workoutResponse) {
                        console.log(workoutResponse);
                        workoutPlanName = workoutResponse.data.planName;
                        mealPlan = "Not Assign"

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR.responseText);
                        workoutPlanName = "Not Assign"

                    }
                });
            }

        },
        error: function (error) {

        }
    });
}

$("#searchProgressByUser").click(function () {
    getAdminMemberDataToAreaChart($("#searchProgressByUser").val());
    getMealCalorieRecordsByUser($("#searchProgressByUser").val());
    getMemberDetail($("#searchProgressByUser").val())
    if (typeof newDynamicChart !== 'undefined') {
        newDynamicChart.destroy();
    }

    if (typeof adminMemberDynamicChart !== 'undefined') {
        adminMemberDynamicChart.destroy();
    }
})


//adding bmi values to chart start here

function getAdminMemberDataToAreaChart(uId) {
    console.log(uId)
    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/getAllProgress/' + uId,
        method: 'GET',

        contentType: 'application/json',
        success: function (progressResponse) {
            console.log(progressResponse.data);

            adminProgressList = progressResponse.data;
            console.log(adminProgressList)
            addAdminFormatAreaChartData();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
}

let dateList = [];
let trainerBmiList = [];

function addAdminFormatAreaChartData() {
    dateList = [];
    trainerBmiList = [];


    $.each(adminProgressList, function (index, progress) {
        dateList.push(progress.date);

        let weight = progress.weight;
        let height = progress.height;
        let newHeight = height / 100;
        let bmi = parseFloat((weight / (newHeight * newHeight)).toFixed(1));
        trainerBmiList.push(bmi);
    });
    setAdminMemberDataToAreaChart();
}

function setAdminMemberDataToAreaChart() {
    var ctx = $("#myAdminProgressAreaChart")[0].getContext('2d');

    // Input data
    var labels = dateList;
    var data = trainerBmiList;

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

    adminMemberDynamicChart = new Chart(ctx, {
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


function getMealCalorieRecordsByUser(uId) {

    newCalorieDateList = []
    newCalorieAmountList = []
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealRecords/getAllMealRecords/' + uId,
        method: 'GET',
        success: function (response) {
            console.log(response);
            $.each(response.data, function (index, mealRecord) {
                newCalorieDateList.push(mealRecord.date);
                newCalorieAmountList.push(mealRecord.calories);
            });

            if (response.data.length !== 0) {
                setDataToCalorieIntakeAndBurnout();
                getWorkOutCalorieRecordsByUser(uId);
            } else {
                getWorkOutCalorieRecordsByUser(uId);
            }

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


function getWorkOutCalorieRecordsByUser(uId) {
    newWorkOutCalorieDateList = []
    newWorkOutCalorieAmountList = []
    console.log(uId);
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutRecords/getAllWorkOutRecords/' + uId,
        method: 'GET',
        success: function (response) {
            console.log(response);
            $.each(response.data, function (index, workOutRec) {
                newWorkOutCalorieDateList.push(workOutRec.date);
                newWorkOutCalorieAmountList.push(workOutRec.calories);

            });
            if (response.data.length !== 0) {
                setDataToCalorieIntakeAndBurnout();
            }
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


function setDataToCalorieIntakeAndBurnout() {
    var ctx = $("#areaChartCalorieBurnOutIntake")[0].getContext('2d');


    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1;


    var aggregatedIntakeData = {};
    var aggregatedBurnOutData = {};

    for (var i = 0; i < newCalorieDateList.length; i++) {
        var date = new Date(newCalorieDateList[i]);
        if (date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth) {
            var formattedDate = ('0' + date.getDate()).slice(-2);

            if (!aggregatedIntakeData[formattedDate]) {
                aggregatedIntakeData[formattedDate] = 0;
            }

            aggregatedIntakeData[formattedDate] += newCalorieAmountList[i];

            if (!aggregatedBurnOutData[formattedDate]) {
                aggregatedBurnOutData[formattedDate] = 0;
            }

            aggregatedBurnOutData[formattedDate] += newWorkOutCalorieAmountList[i];
        }
    }
    var aggregatedDates = Object.keys(aggregatedIntakeData, aggregatedBurnOutData);
    var aggregatedIntakeAmounts = Object.values(aggregatedIntakeData);
    var aggregatedBurnOutAmounts = Object.values(aggregatedBurnOutData);


    newDynamicChart = new Chart(ctx, {
        type: 'line',
        data: {

            labels: aggregatedDates,
            datasets: [
                {
                    label: 'Calorie Count',
                    data: aggregatedIntakeAmounts,
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
                },

                {
                    label: 'Calorie Burn',
                    data: aggregatedBurnOutAmounts,
                    lineTension: 0.2,
                    backgroundColor: "rgba(78, 115, 110, 0.08)",
                    borderColor: "rgba(255, 0, 0, 1)", // Red color
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(255, 0, 0, 1)", // Red color
                    pointBorderColor: "rgba(255, 0, 0, 1)", // Red color
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgb(255,0,0)",
                    pointHoverBorderColor: "rgb(255,0,0)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2
                }


            ]
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


$("#pdfBtn").click(function () {
    downloadPDF();

})


function downloadPDF() {

    var calorie = document.getElementById('areaChartCalorieBurnOutIntake');

    var calorieChart = calorie.toDataURL("image/jpeg", 10);

    var progress = document.getElementById('myAdminProgressAreaChart');

    var progressChart = progress.toDataURL("image/jpeg", 10);

    var doc = new jsPDF('Portrait', 'px', [600, 1200]);

    doc.setFontSize(11);

    var logoImg = new Image();
    logoImg.src = "https://img.icons8.com/external-nawicon-glyph-nawicon/64/00000/external-gym-hotel-nawicon-glyph-nawicon.png";
    var logoHeight = 50; // Adjust as needed based on the height of your logo
    var logoWidth = logoHeight * (logoImg.width / logoImg.height); // Maintain aspect ratio
    var headerX = 20; // Positioning it 10 units from the left
    var headerY = 10; // Positioning it 10 units from the top
    doc.addImage(logoImg, 'PNG', 20, 10, 50, 50);

    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text(285, 15, "Ringo Fitness Centre");
    doc.setFontSize(12);
    doc.setTextColor(127, 140, 141);
    doc.text(285, 35, "NO 36/1A Thaladuwa Road, Negombo");
    doc.text(285, 55, "03122523675");

    /*
        doc.text(0,70,"-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
    */

    doc.setLineWidth(1);
    doc.setDrawColor(127, 140, 141);
    doc.line(5, 10 + 35 + 20, doc.internal.pageSize.getWidth() - 5, 10 + 35 + 20);

    doc.text(10, 100, "Name : " + userName);
    doc.text(10, 120, "meal plan : " + mealPlan);
    doc.text(10, 140, "workout plan : " + workoutPlanName);

    doc.text(10, 170, "01)  calorie Intake and burn out details chart :");
    doc.addImage(calorieChart, 'JPEG', 25, 190, 260, 160);

    doc.text(10, 380, "02)  Monthly Progress Details Chart :");
    doc.addImage(progressChart, 'JPEG', 25, 400, 260, 160);


    var footerText = "Fitness Gym Center - " + new Date().toLocaleString();
    var footerHeight = 10;
    var footerX = doc.internal.pageSize.getWidth() / 2;
    var footerY = doc.internal.pageSize.getHeight() - 10;
    doc.text(footerText, footerX, footerY, {align: 'center'});


    doc.save('canvas.pdf');

}




