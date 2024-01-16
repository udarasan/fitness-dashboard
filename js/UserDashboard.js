$(document).ready(function () {
    getDataToAreaChart();

    $(".workoutTab").css({
        display: "none"
    })

    mealAndWorkoutCardHandler();
});

function mealAndWorkoutCardHandler(){
    $("#workoutLink").click(function(){
        $(".mealTab").css({
            display: "none"
        })
        $(".workoutTab").css({
            display: "block"
        })
    });

    $("#mealLink").click(function(){
        $(".workoutTab").css({
            display: "none"
        })
        $(".mealTab").css({
            display: "block"
        })
    });
}

function getDataToAreaChart(){
    var ctx = $("#myAreaChart")[0].getContext('2d');

    // Input data
    var labels = ['2024-01-16', '2024-02-17', '2024-02-19', '2024-08-20', '2024-08-30', "2024-08-31"];
    var data = [20.7, 20.8, 20.6, 21.1, 21.2, 20.7];

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
                lineTension: 0,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(92,102,130,0.75)",
                pointRadius: 3,
                pointBackgroundColor: "#2d324a",
                pointBorderColor: "rgba(92,102,130,0.75)",
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
