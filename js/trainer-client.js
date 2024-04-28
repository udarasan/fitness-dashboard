let email = localStorage.getItem('trainer-email');
let trainerId;
$(window).on('load', function () {
    $('#trainerEmail').text(email);
    getClients();

});

function getClients() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: email},
        success: function (response) {
            let client = response.data.users;
            if (client.length === 0) {
                alert("No clients found.");
                return;
            }
            console.log(response.data);
            trainerId = response.data.tid;
            console.log(trainerId)
            getClientsWithTrainer(trainerId);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });

}

/*function getClientsWithTrainer(trainerId) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer/' + trainerId,
        method: 'GET',

        contentType: 'application/json',

        success: function (response) {
            if (response.data.length === undefined) {
                getClients();
                return;
            }

            console.log(response.data);
       /!*     $.each(response.data, function (index, client) {

                let row = `<tr><td>${client.uid}</td><td>${client.name}</td><td>${client.email}</td><td>${client.meal_plan_id}</td><td >${client.workout_id}</td><td >${client.age}</td><td >${client.gender}</td></tr>`;
                $('#tblClient').append(row);
            });

*!/
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
                            /!*  appendRow(member, mealPlan, "", "");*!/
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
                    /!*     }
                     let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td><td></td><td>${member.workout_id}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
                     $('#tblMember').append(row);*!/
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });

}*/
async function getClientsWithTrainer(trainerId) {
    $('#tblMember').empty();
    try {
        const response = await $.ajax({
            url: 'http://localhost:8080/api/v1/trainer/getOneTrainer/' + trainerId,
            method: 'GET',
            contentType: 'application/json'
        });

        if (!Array.isArray(response.data) || response.data.length === 0) {
            alert("No members found.");
            return;
        }

        for (const member of response.data) {
            let trainerName = "Not Assign";
            let mealPlan = "Not Assign";
            let workoutPlanName = "Not Assign";

            if (member.trainer_id !== 0) {
                const trainerResponse = await $.ajax({
                    url: 'http://localhost:8080/api/v1/trainer/getTrainer/' + member.trainer_id,
                    method: 'GET',
                    dataType: 'json',
                    contentType: 'application/json'
                });
                trainerName = trainerResponse.data.name;
            }

            if (member.meal_plan_id !== 0) {
                const mealResponse = await $.ajax({
                    url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + member.meal_plan_id,
                    method: 'GET',
                    dataType: 'json',
                    contentType: 'application/json'
                });
                mealPlan = mealResponse.data.planName;
            }

            if (member.workout_id !== 0) {
                const workoutResponse = await $.ajax({
                    url: 'http://localhost:8080/api/v1/workoutplan/getWorkOutPlan/' + member.workout_id,
                    method: 'GET',
                    dataType: 'json',
                    contentType: 'application/json'
                });
                workoutPlanName = workoutResponse.data.planName;
            }

            appendRow(member, mealPlan, workoutPlanName, trainerName);
        }
    } catch (error) {
        alert("Failed to retrieve members. Please try again.");
        console.error(error);
    }
}


function appendRow(member, mealPlanName, workoutPlanName, trainerName) {
    let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td style="display: none">${member.password}</td><td>${mealPlanName}</td><td>${workoutPlanName}</td><td>${member.age}</td><td>${member.gender}</td><td>${member.workoutType}</td></tr>`;
    $('#tblClient').append(row);
}

$('#tblMember').on('click', 'tr', function () {
    $('#tblClientProgress').empty();
    let memberId = $(this).find('td:first').text();

    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/getAllProgress/' + memberId,
        method: 'GET',

        contentType: 'application/json',
        success: function (response) {
            progressList = response.data;

            $.each(progressList, function (index, progress) {
                date = progress.date;
                height = progress.height;
                weight = progress.weight;

                currentHeightInMeters = height / 100;

                bmi = parseFloat((weight / (currentHeightInMeters * currentHeightInMeters)).toFixed(1));

                row = `<tr><td>${date}</td><td>${height}</td><td>${weight}</td><td>${bmi}</td></tr>`;
                $('#tblClientProgress').append(row);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });

    $('#progressModal').modal('show');
});
