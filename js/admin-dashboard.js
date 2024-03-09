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

let adminMemberDynamicChart;
let newDynamicChart;

let adminProgressList=[];
let newCalorieDateList=[]
let newCalorieAmountList=[]
let newWorkOutCalorieDateList=[]
let newWorkOutCalorieAmountList=[]


$("#searchProgressByUser").click(function (){
    getAdminMemberDataToAreaChart($("#searchProgressByUser").val());
    getMealCalorieRecordsByUser($("#searchProgressByUser").val());

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



//adding calorie intake and burnout values to chart start here

function getMealCalorieRecordsByUser(uId) {

    newCalorieDateList=[]
    newCalorieAmountList=[]
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
            }else {
                getWorkOutCalorieRecordsByUser(uId);
            }

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


function getWorkOutCalorieRecordsByUser(uId) {
    newWorkOutCalorieDateList=[]
    newWorkOutCalorieAmountList=[]
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

    // Get current year and month
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1; // Months are zero-based, so add 1


    var aggregatedIntakeData = {};
    var aggregatedBurnOutData = {};

    for (var i = 0; i < newCalorieDateList.length; i++) {
        var date = new Date(newCalorieDateList[i]);
        if (date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth) {
            var formattedDate = ('0' + date.getDate()).slice(-2); // Convert to YYYY-MM-DD format

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
    var aggregatedDates = Object.keys(aggregatedIntakeData,aggregatedBurnOutData);
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


/*
$("#pdfBtn").click(function (){
    // getMealDetails();
    /!*downloadPDF();*!/
    // Sample client list
    var clientList = [
        { name: "John Doe", email: "john@example.com", workOutPlan: "Plan A", mealPlan: "Plan X", trainerName: "Trainer 1", age: 30, gender: "Male" },
        { name: "Jane Smith", email: "jane@example.com", workOutPlan: "Plan B", mealPlan: "Plan Y", trainerName: "Trainer 2", age: 25, gender: "Female" }
    ];

// Call the function with the sample client list
    var pdfObject = jsPDFInvoiceTemplate.default(getPdfProps(clientList));
})


function downloadPDF() {

    var canvas = document.getElementById('areaChartCalorieBurnOutIntake');

    var canvasImg = canvas.toDataURL("image/jpeg", 7.0);

    var doc = new jsPDF('landscape');

    doc.setFontSize(14);
    doc.text(10, 10, "progress chart");
    doc.addImage(canvasImg, 'JPEG', 10, 20, 150, 100 );
    doc.save('canvas.pdf');

}

function getPdfProps(clientList) {
    return {
        outputType: jsPDFInvoiceTemplate.OutputType.save,
        returnJsPDFDocObject: true,
        fileName: "Fitness Clients Report",
        orientationLandscape: false,
        compress: true,
        logo: {
            src: "https://img.icons8.com/external-nawicon-glyph-nawicon/64/00000/external-gym-hotel-nawicon-glyph-nawicon.png",
            type: 'PNG',
            width: 25,
            height: 25,
            margin: {
                top: 0,
                left: 0
            }
        },
        business: {
            name: "Ringo Fitness Centre",
            address: "NO 36/1A Thaladuwa Road ,Negombo",
            phone: "03122523675",

        },
        contact: {
            label: "Trainer :",
            name: "currntTrainerName",
            phone: "currntTrainerEmail",
            email:" ",


        },

        invoice: {
            label: "Report #: ",

            invGenDate: "Report Date: " + "formattedDate",

            headerBorder: true,
            tableBodyBorder: true,
            header: [
                {
                    title: "#",
                    style: {
                        width: 10
                    },

                },
                {
                    title: "Name",
                    style: {
                        width: 30
                    },

                },
                {
                    title: "Email",
                    style: {
                        width: 40
                    }
                },
                {title: "WorkOutPlan"},
                {title: "MealPlan",

                },
                {title: "TrainerName"},
                {title: "Age",
                    style: {
                        width: 10
                    }
                },
                {title: "Gender"},


            ],
            styles: {
                margin: 500
            },
            table: clientList.map((clients, index) => [
                index + 1,
                clients.name,
                clients.email,
                clients.workout_id ? workoutPlanName : "Not Assign",
                clients.meal_plan_id ? mealPlan : "Not Assign",
               " trainerName",
                clients.age,
                clients.gender,

            ]),
            margin: {
                top: 600,
                left: 0
            }

        },
        footer: {
            text: "FITNESS GYM Center",
        },
        pageEnable: true,
        pageLabel: "Page ",
    }
}




*/
$("#pdfBtn").click(function (){
    var canvas = document.getElementById('areaChartCalorieBurnOutIntake');

    var canvasImg = canvas.toDataURL("image/jpeg", 7.0);

    var doc = new jsPDF('landscape');

    doc.setFontSize(14);
    doc.text(10, 10, "progress chart");
    doc.addImage(canvasImg, 'JPEG', 10, 20, 150, 100 );


    var clientList = [
        { name: "John Doe", email: "john@example.com", workOutPlan: "Plan A", mealPlan: "Plan X", trainerName: "Trainer 1", age: 30, gender: "Male" },
        { name: "Jane Smith", email: "jane@example.com", workOutPlan: "Plan B", mealPlan: "Plan Y", trainerName: "Trainer 2", age: 25, gender: "Female" }
    ];

    var pdfProps = getPdfProps(clientList, canvasImg); // Pass canvas image to getPdfProps

    // Generate PDF using jsPDFInvoiceTemplate
    jsPDFInvoiceTemplate.default(pdfProps, function (instance) {
        var doc = instance.jsPDFDoc;

        // Download the PDF
        doc.save('Fitness_Clients_Report.pdf');
    });
});

function getPdfProps(clientList, canvasImg) {
    console.log(canvasImg);
    return {
        outputType: jsPDFInvoiceTemplate.OutputType.save,
        returnJsPDFDocObject: true,
        fileName: "Fitness Clients Report",
        orientationLandscape: false,
        compress: true,
        logo: {
            src: "https://img.icons8.com/external-nawicon-glyph-nawicon/64/00000/external-gym-hotel-nawicon-glyph-nawicon.png",
            type: 'PNG',
            width: 25,
            height: 25,
            margin: {
                top: 0,
                left: 0
            }
        },
        business: {
            name: "Ringo Fitness Centre",
            address: "NO 36/1A Thaladuwa Road ,Negombo",
            phone: "03122523675",
        },
        contact: {
            label: "Trainer :",
            name: "Trainer Name",
            phone: "Trainer Phone",
            email:"Trainer Email",
        },
        invoice: {
            label: "Report #: ",
            invGenDate: "Report Date: " + new Date().toLocaleDateString(),
            headerBorder: true,
            tableBodyBorder: true,
            header: [
                { title: "#", style: { width: 10 }},
                { title: "Name", style: { width: 30 }},
                { title: "Email", style: { width: 40 }},
                { title: "WorkOutPlan" },
                { title: "MealPlan" },
                { title: "TrainerName" },
                { title: "Age", style: { width: 10 }},
                { title: "Gender" },
                {title: "image"}
            ],
            styles: {
                margin: 500
            },
            table: clientList.map((clients, index) => [
                index + 1,
                clients.name,
                clients.email,
                clients.workOutPlan ? clients.workOutPlan : "Not Assign",
                clients.mealPlan ? clients.mealPlan : "Not Assign",
                clients.trainerName,
                clients.age,
                clients.gender,
                { canvasImg: canvasImg, width: 50, height: 50 },

            ]),
            margin: { top: 600, left: 0 }
        },
        footer: {
            text: "FITNESS GYM Center",
            canvasImg: canvasImg
        },
        pageEnable: true,
        pageLabel: "Page ",
       // Add canvas image to PDF properties
    }
}
