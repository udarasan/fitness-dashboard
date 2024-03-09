$('#nameLbl').text(localStorage.getItem('adminEmail'));

$(window).on('load', function () {

    loadTrainerId();
});
var today = new Date();
var formattedDate = today.toLocaleDateString();
let clientList;
let trainerList;

function loadTrainerId() {

    $('#tra_id').empty();
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getAllTrainers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            trainerList = response.data
            response.data.sort((a, b) => a.users.length - b.users.length);
            $('#tra_id').append(`<option selected disabled>Select Trainer</option>`);
            $.each(response.data, function (index, trainer) {
                $('#tra_id').append(`<option value="${trainer.tid}">${trainer.name}</option>`);

            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
}

function setClientDetails() {
    $('#tblMember').empty();
    let trainerId = $("#tra_id").val();
    console.log(trainerId)
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer/' + trainerId,
        method: 'GET',
        success: function (response) {
            clientList = response.data;
            $('#printDetails').click(function () {


                var pdfObject = jsPDFInvoiceTemplate.default(getPdfProps(clientList));
                console.log(pdfObject);
            });
            console.log(response);
            if (response.data.length == 0) {
                $('#memberTable').css("display", "none");
                $('.npResImg').removeClass("d-none");

            } else {
                $('.npResImg').addClass("d-none");
                $('#memberTable').css("display", "block");
                $.each(response.data, function (index, member) {

                    let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td><td>${member.meal_plan_id}</td><td>${member.workout_id}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
                    $('#tblMember').append(row);
                });
            }

        },
        error: function (xhr) {
            console.log(xhr);
        }
    })
}

let currntTrainerName;
let currntTrainerEmail;
$('#tra_id').on('click', function () {
    let trainerId = $("#tra_id").val();
    setClientDetails();

    $.each(trainerList, function (index, trainer) {
        if (trainerId == trainer.tid) {
            currntTrainerName = trainer.name;
            currntTrainerEmail = trainer.email;
            console.log(currntTrainerName);
        }
    })

});

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
            name: currntTrainerName,
            phone: currntTrainerEmail,
            email:" ",


        },

        invoice: {
            label: "Report #: ",

            invGenDate: "Report Date: " + formattedDate,

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
                        width: 50
                    }
                },
                {title: "WorkOut Id"},
                {title: "MealPlan Id"},
                {title: "Trainer Id"},
                {title: "Age"},
                {title: "Gender"},


            ],
            styles: {
                margin: 500
            },
            table: clientList.map((clients, index) => [
                index + 1,
                clients.name,
                clients.email,
                clients.workout_id,
                clients.meal_plan_id,
                clients.trainer_id,
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



//new here
let mealList;
let workoutList;

$("#printDetailsOfMealAndWorkout").click(function (){
    getMealDetails();


});

function getMealDetails(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getAllMealPlans',
        method: 'GET',
        success: function (response) {

            $.each(response.data, function (index, member) {
                mealList = response.data;
                console.log(mealList);
                getWorkoutDetails();

            });


        },
        error: function (xhr) {
            console.log(xhr);
        }
    })
}

function getWorkoutDetails(){
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/getAllWorkOutPlans',
        method: 'GET',
        success: function (response) {

            $.each(response.data, function (index, member) {
                workoutList = response.data;
                console.log(workoutList);

                let pdfObject = jsPDFInvoiceTemplate.default(getPdfOfMealAndWorkout(mealList,workoutList));
                console.log(pdfObject);

                console.log(response);

            });


        },
        error: function (xhr) {
            console.log(xhr);
        }
    })
}


function getPdfOfMealAndWorkout(mealList,workoutList) {
    var canvas = document.getElementById('areaChartCalorieBurnOutIntake');
    console.log(canvas)
    var dataURL = canvas.toDataURL(); // This will contain the image data in base64 format
    console.log(dataURL)

    return {
        outputType: jsPDFInvoiceTemplate.OutputType.save,
        returnJsPDFDocObject: true,
        fileName: "Fitness Meal and Workout Report",
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
            name: currntTrainerName,
            phone: currntTrainerEmail,
            email: " ",


        },

        invoice: {
            label: "Report #: ",

            invGenDate: "Report Date: " + formattedDate,

            headerBorder: true,
            tableBodyBorder: true,
            header: [
                {
                    title: "#",
                    style: {
                        width: 10
                    },

                },

                {title: "MealPlan Id"},
                {title: "MealPlan name"},
                {title: "Workout Id"},
                {title: "Workout name"},


            ],
            styles: {
                margin: 500
            },
            table: mealList.map((mealList, index) => [
                index + 1,
                mealList.mid,
                mealList.planName,
                (workoutList[index] && workoutList[index].wid) || "", // Fetching workout ID based on meal index
                (workoutList[index] && workoutList[index].planName) || "", // Fetching workout name based on meal index


            ]),

            margin: {
                top: 600,
                left: 0
            }


        },

        footer: {
            text: "FITNESS GYM Center",
            canvasImage: dataURL
        },
        pageEnable: true,
        pageLabel: "Page ",
    }
}