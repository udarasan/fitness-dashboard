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
let trainerName;
let mealPlan;
let workoutPlanName
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
             /*   $.each(response.data, function (index, member) {

                    let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td><td>${member.meal_plan_id}</td><td>${member.workout_id}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
                    $('#tblMember').append(row);
                });*/

                $.each(response.data, function (index, member) {
                    console.log(member);
                    meal_id = member.meal_plan_id;
                    workout_id = member.workout_id;
                    if (member.trainer_id !== 0) {
                        $.ajax({
                            url: 'http://localhost:8080/api/v1/trainer/getTrainer/' + member.trainer_id,
                            method: 'GET',
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (response) {
                                console.log(response);
                                 trainerName = response.data.name;
                                if (member.meal_plan_id  !== 0) {
                                    $.ajax({
                                        url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + member.meal_plan_id,
                                        method: 'GET',
                                        dataType: 'json',
                                        contentType: 'application/json',
                                        success: function (mealResponse) {
                                            console.log(mealResponse);
                                             mealPlan = mealResponse.data.planName;

                                            if (member.workout_id !== 0) {
                                                $.ajax({
                                                    url: 'http://localhost:8080/api/v1/workoutplan/getWorkOutPlan/' + member.workout_id,
                                                    method: 'GET',
                                                    dataType: 'json',
                                                    contentType: 'application/json',
                                                    success: function (workoutResponse) {
                                                        console.log(workoutResponse);
                                                         workoutPlanName = workoutResponse.data.planName;
                                                        appendRow(member, mealPlan, workoutPlanName, trainerName);
                                                    },
                                                    error: function (jqXHR, textStatus, errorThrown) {
                                                        console.error(jqXHR.responseText);
                                                        appendRow(member, mealPlan, "", trainerName);
                                                    }
                                                });
                                            }else {
                                                appendRow(member, mealPlan, "", trainerName);
                                            }

                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            console.error(jqXHR.responseText);
                                            appendRow(member, "", "", "");
                                        }
                                    });
                                } else {
                                    $.ajax({
                                        url: 'http://localhost:8080/api/v1/workoutplan/getWorkOutPlan/' + member.workout_id,
                                        method: 'GET',
                                        dataType: 'json',
                                        contentType: 'application/json',
                                        success: function (workoutResponse) {
                                            console.log(workoutResponse);
                                             workoutPlanName = workoutResponse.data.planName;
                                            appendRow(member, "", workoutPlanName, trainerName);
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            console.error(jqXHR.responseText);
                                            appendRow(member, "", "", trainerName);
                                        }
                                    });
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.error(jqXHR.responseText);
                            }
                        });
                    } else {
                        $.ajax({
                            url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + member.meal_plan_id,
                            method: 'GET',
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (mealResponse) {
                                console.log(mealResponse);
                                 mealPlan = mealResponse.data.planName;
                                /*  appendRow(member, mealPlan, "", "");*/
                                $.ajax({
                                    url: 'http://localhost:8080/api/v1/workoutplan/getWorkOutPlan/' + member.workout_id,
                                    method: 'GET',
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (workoutResponse) {
                                        console.log(workoutResponse);
                                         workoutPlanName = workoutResponse.data.planName;
                                        appendRow(member, mealPlan, workoutPlanName, "");
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        console.error(jqXHR.responseText);
                                        appendRow(member, mealPlan, "", "");
                                    }
                                });
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.error(jqXHR.responseText);
                                appendRow(member, "", "", "");
                            }
                        });
                        /*     }
                         let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td><td></td><td>${member.workout_id}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
                         $('#tblMember').append(row);*/
                    }
                });
            }

        },
        error: function (xhr) {
            console.log(xhr);
        }
    })
}
function appendRow(member, mealPlanName, workoutPlanName, trainerName) {
    let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${trainerName}</td><td style="display: none">${member.password}</td><td>${mealPlanName}</td><td>${workoutPlanName}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
    $('#tblMember').append(row);
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
               trainerName,
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

