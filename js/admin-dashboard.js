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

function pieChart() {
    const chartData = {
        labels: ["Trainers", "Members", "MealPlans", "WorkOutPlans", "Equipments"],
        data: [trainerCount, memberCount, mealCount, workoutCount, equipmentCount],
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
            pieChart();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


//new

function loadUserIdsToProgress(){
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
                $("#searchProgressByUser").append( `<option value="${members.uid}">${members.name}</option>`)
            })
        },
        error: function (xhr) {
            console.log(xhr);
        }
    })
}

let adminProgressList=[];
let adminMemberDynamicChart;

$("#searchProgressByUser").click(function (){
    getAdminMemberDataToAreaChart($("#searchProgressByUser").val());
    if (typeof adminMemberDynamicChart !== 'undefined') {
        adminMemberDynamicChart.destroy();
    }
})

function getAdminMemberDataToAreaChart(uId) {
    console.log(uId)
    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/getAllProgress/' + uId,
        method: 'GET',

        contentType: 'application/json',  // Set content type to JSON
        success: function (progressResponse) {
            console.log(progressResponse.data);

            adminProgressList = progressResponse.data;
            console.log(adminProgressList)
            addAdminFormatAreaChartData();

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}

let dateList = [];
let trainerBmiList = [];

function addAdminFormatAreaChartData() {
    dateList = []; // Clear the array
    trainerBmiList = []; // Clear the array


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






