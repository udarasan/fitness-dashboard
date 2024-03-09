$('#nameLbl').text(localStorage.getItem('adminEmail'));
let meal_id;
let workout_id;
var selectedValue;
$(window).on('load', function () {

    getAllMembers();
});
$(".form-check-input").on("click", function () {
    selectedValue = $("input[name='inlineRadioOptions']:checked").val();
    console.log("Selected value: " + selectedValue);

});
//delete member
$('#deleteMember').click(function () {

    let id = $('#member_id').val();
    var result = window.confirm("Do you want to proceed?");
    if (result) {
        // Make the AJAX request
        $.ajax({
            url: 'http://localhost:8080/api/v1/user/delete/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            success: function (response) {
                alert("Member Delete successful!");
                $('#memberModal').modal('hide');
                getAllMembers();
                loadTrainerId();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Member Delete failed! Please check your input and try again.");

                console.error(jqXHR.responseText);
            }
        });
    } else {
        alert("Member Details Is Safe !!")
    }


});
let newPassword;
//update member
$('#updateMember').click(function () {

    let id = $('#member_id').val();
    let email = $('#member_email').val();
    let name = $('#member_name').val();
    let trainer_id = $('#tra_id').val();

    let password = $('#memeber_password').val();
    console.log(password);
    hashPassword($('#memeber_password').val())
        .then(hashedPassword => {
            console.log('Hashed Password:', hashedPassword);
            newPassword = hashedPassword;
            if (isValidName(name) && isValidEmail(email) && isValidPassword(password) && !isNaN(age) && age > 15 && age < 100) {
                // Make the AJAX request
                $.ajax({
                    url: 'http://localhost:8080/api/v1/user/update',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',

                    data: JSON.stringify({
                        "uid": id,
                        "email": email,
                        "password": newPassword,
                        "name": name,
                        "trainer_id": trainer_id,
                        "meal_plan_id": meal_id,
                        "workout_id": workout_id,
                        "age": age,
                        "gender": gender
                    }),
                    success: function (response) {
                        console.log(response);
                        alert("Member update successful!");
                        getAllMembers();


                        $('#memberModal').modal('hide');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Member update failed! Please check your input and try again.");
                        console.error(jqXHR.responseText);
                    }
                });
            }

        })
        .catch(error => {
            console.error('Error hashing password:', error);
        });

    let age = $('#age').val();
    let gender = selectedValue;
    if (!email || !name || !password) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!isValidEmail(email)) {
        $('#emailErrorLabel').text("Please enter a valid email address.");

    } else {
        $('#emailErrorLabel').text("");
    }
    if (!isValidPassword(password)) {
        $('#pwdErrorLabel').text("Please enter a password with 6 to 20 characters.");

    } else {
        $('#pwdErrorLabel').text("");
    }

    if (!isValidName(name)) {
        $('#nameErrorLabel').text("Please enter a name with 2 to 50 characters and only use letters");

    } else {
        $('#nameErrorLabel').text("");
    }
    if (isNaN(age)) {
        $('#ageErrorLabel').text("Invalid input type");

    } else {
        $('#ageErrorLabel').text("");
    }
    if (age < 16 || age > 100) {
        $('#ageErrorLabel').text("Age must be between 16 and 100");

    }

});

async function hashPassword(password) {
    const base64Encoded = btoa(password);
    console.log(base64Encoded);

    return base64Encoded;
}

//save memeber

$('#saveMemeber').click(function () {

    let id = $('#member_id').val();
    let email = $('#member_email').val();
    let name = $('#member_name').val();
    let trainer_id = $('#tra_id').val();

    let password = $('#memeber_password').val();
    console.log(trainer_id);
    hashPassword($('#memeber_password').val())
        .then(hashedPassword => {
            console.log('Hashed Password:', hashedPassword);
            newPassword = hashedPassword;
            if (isValidName(name) && isValidEmail(email) && isValidPassword(password) && !isNaN(age) && age > 15 && age < 100) {
                console.log(id);
                // Make the AJAX request
                $.ajax({
                    url: 'http://localhost:8080/api/v1/user/registration',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',

                    data: JSON.stringify({
                        "uid": id,
                        "email": email,
                        "password": newPassword,
                        "name": name,
                        "trainer_id": trainer_id,
                        "age": age,
                        "gender": gender
                    }),  // Convert data to JSON string
                    success: function (response) {
                        console.log(response);
                        alert("Member registration successful!");
                        $('#memberModal').modal('hide');
                        getAllMembers();

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Member registration failed! Please check your input and try again.");
                        console.error(jqXHR.responseText);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error hashing password:', error);
        });
    let age = $('#age').val();
    let gender = selectedValue;

    if (!email || !name || !password || !gender) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!isValidEmail(email)) {
        $('#emailErrorLabel').text("Please enter a valid email address.");

    } else {
        $('#emailErrorLabel').text("");
    }
    if (!isValidPassword(password)) {
        $('#pwdErrorLabel').text("Please enter a password with 6 to 20 characters.");

    } else {
        $('#pwdErrorLabel').text("");
    }

    if (!isValidName(name)) {
        $('#nameErrorLabel').text("Please enter a name with 2 to 50 characters and only use letters");

    } else {
        $('#nameErrorLabel').text("");
    }
    if (isNaN(age)) {
        $('#ageErrorLabel').text("Invalid input type");

    } else {
        $('#ageErrorLabel').text("");
    }
    if (age < 16 || age > 100) {
        $('#ageErrorLabel').text("Age must be between 16 and 100");

    }


});

function getAllMembers() {
    $('#tblMember').empty();
    // members get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAllUsers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            if (response.data.length === undefined) {
                getAllMembers();
                return;
            }
            loadTrainerId();
            memberList = response.data;

            if (memberList.length === 0) {
                alert("No members found.");
                return;
            }

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
                            let trainerName = response.data.name;
                            if (member.meal_plan_id  !== 0) {
                                $.ajax({
                                    url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + member.meal_plan_id,
                                    method: 'GET',
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (mealResponse) {
                                        console.log(mealResponse);
                                        let mealPlan = mealResponse.data.planName;

                                        if (member.workout_id !== 0) {
                                            $.ajax({
                                                url: 'http://localhost:8080/api/v1/workoutplan/getWorkOutPlan/' + member.workout_id,
                                                method: 'GET',
                                                dataType: 'json',
                                                contentType: 'application/json',
                                                success: function (workoutResponse) {
                                                    console.log(workoutResponse);
                                                    let workoutPlanName = workoutResponse.data.planName;
                                                    appendRow(member, mealPlan, workoutPlanName, trainerName);
                                                },
                                                error: function (jqXHR, textStatus, errorThrown) {
                                                    console.error(jqXHR.responseText);
                                                    appendRow(member, mealPlan, "Not Assign", trainerName);
                                                }
                                            });
                                        }else {
                                            appendRow(member, mealPlan, "Not Assign", trainerName);
                                        }

                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        console.error(jqXHR.responseText);
                                        appendRow(member, "Not Assign", "Not Assign", "Not Assign");
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
                                        let workoutPlanName = workoutResponse.data.planName;
                                        appendRow(member, "Not Assign", workoutPlanName, trainerName);
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        console.error(jqXHR.responseText);
                                        appendRow(member, "Not Assign", "Not Assign", trainerName);
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
                            let mealPlan = mealResponse.data.planName;
                          /*  appendRow(member, mealPlan, "", "");*/
                            $.ajax({
                                url: 'http://localhost:8080/api/v1/workoutplan/getWorkOutPlan/' + member.workout_id,
                                method: 'GET',
                                dataType: 'json',
                                contentType: 'application/json',
                                success: function (workoutResponse) {
                                    console.log(workoutResponse);
                                    let workoutPlanName = workoutResponse.data.planName;
                                    appendRow(member, mealPlan, workoutPlanName, "Not Assign");
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    console.error(jqXHR.responseText);
                                    appendRow(member, mealPlan, "Not Assign", "Not Assign");
                                }
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error(jqXHR.responseText);
                            appendRow(member, "Not Assign", "Not Assign", "Not Assign");
                        }
                    });
                   /*     }
                    let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td><td></td><td>${member.workout_id}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
                    $('#tblMember').append(row);*/
                }
            });



        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve members. Please try again.");
            console.error(jqXHR.responseText);
        }
    });
}
/*function getAllMembers() {
    $('#tblMember').empty();

    // Function to append row to the table


    // members get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAllUsers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            if (response.data.length === undefined) {
                getAllMembers();
                return;
            }
            loadTrainerId();
            memberList = response.data;

            if (memberList.length === 0) {
                alert("No members found.");
                return;
            }

            $.each(response.data, function (index, member) {
                console.log(member);
                meal_id = member.meal_plan_id;
                workout_id = member.workout_id;
                trainerId = member.trainer_id;

                // AJAX request to get meal plan
                if (meal_id !== 0) {
                    $.ajax({
                        url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + meal_id,
                        method: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (mealResponse) {
                            let mealPlanName = mealResponse.data.planName;

                            // AJAX request to get workout plan
                            if (workout_id !== 0) {
                                $.ajax({
                                    url: 'http://localhost:8080/api/v1/workoutPlan/getWorkoutPlan/' + workout_id,
                                    method: 'GET',
                                    dataType: 'json',
                                    contentType: 'application/json',
                                    success: function (workoutResponse) {
                                        let workoutPlanName = workoutResponse.data.planName;

                                        // AJAX request to get trainer name
                                        $.ajax({
                                            url: 'http://localhost:8080/api/v1/trainer/getTrainer/' + member.trainer_id,
                                            method: 'GET',
                                            dataType: 'json',
                                            contentType: 'application/json',
                                            success: function (trainerResponse) {
                                                let trainerName = trainerResponse.data.name;
                                                console.log(trainerName);
                                                appendRow(member, mealPlanName, workoutPlanName, trainerName);
                                            },
                                            error: function (jqXHR, textStatus, errorThrown) {
                                                console.error(jqXHR.responseText);
                                                appendRow(member, mealPlanName, workoutPlanName, "");
                                            }
                                        });
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        console.error(jqXHR.responseText);
                                        appendRow(member, mealPlanName, "", "");
                                    }
                                });
                            } else {
                                appendRow(member, mealPlanName, "", "");
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error(jqXHR.responseText);
                            appendRow(member, "", "", "");
                        }
                    });
                } else {
                    // If no meal plan, check for workout plan
                    if (workout_id !== 0) {
                        $.ajax({
                            url: 'http://localhost:8080/api/v1/workoutplan/getWorkOutPlan/' + workout_id,
                            method: 'GET',
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function (workoutResponse) {
                                let workoutPlanName = workoutResponse.data.planName;
                                appendRow(member, "", workoutPlanName, "");
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.error(jqXHR.responseText);
                                appendRow(member, "", "", "");
                            }
                        });
                    } else {
                        appendRow(member, "", "", "");
                    }
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve members. Please try again.");
            console.error(jqXHR.responseText);
        }
    });
}*/
/*function getAllMembers() {
    $('#tblMember').empty();
    // members get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAllUsers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            if (response.data.length === undefined) {
                getAllMembers();
                return;
            }
            loadTrainerId();
            memberList = response.data;

            if (memberList.length === 0) {
                alert("No members found.");
                return;
            }

            $.each(response.data, function (index, member) {
                console.log(member);
                let mealPlanName = "";
                let workoutPlanName = "";
                let trainerName = "";

                if (member.tid !== 0) {
                    // AJAX request to get trainer name
                    $.ajax({
                        url: 'http://localhost:8080/api/v1/trainer/getTrainerById/' + member.tid,
                        method: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (trainerResponse) {
                            trainerName = trainerResponse.data.name;
                            appendRow(member, mealPlanName, workoutPlanName, trainerName);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error(jqXHR.responseText);
                        }
                    });
                } else {
                    appendRow(member, mealPlanName, workoutPlanName, trainerName);
                }

                // AJAX request to get meal plan
                if (member.meal_plan_id !== 0) {
                    $.ajax({
                        url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + member.meal_plan_id,
                        method: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (mealResponse) {
                            mealPlanName = mealResponse.data.planName;
                            appendRow(member, mealPlanName, workoutPlanName, trainerName);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error(jqXHR.responseText);
                        }
                    });
                } else {
                    appendRow(member, mealPlanName, workoutPlanName, trainerName);
                }

                // AJAX request to get workout plan
                if (member.workout_id !== 0) {
                    $.ajax({
                        url: 'http://localhost:8080/api/v1/workoutPlan/getWorkoutPlan/' + member.workout_id,
                        method: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (workoutResponse) {
                            workoutPlanName = workoutResponse.data.planName;
                            appendRow(member, mealPlanName, workoutPlanName, trainerName);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error(jqXHR.responseText);
                        }
                    });
                } else {
                    appendRow(member, mealPlanName, workoutPlanName, trainerName);
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve members. Please try again.");
            console.error(jqXHR.responseText);
        }
    });
}*/

function appendRow(member, mealPlanName, workoutPlanName, trainerName) {
    let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${trainerName}</td><td style="display: none">${member.password}</td><td>${mealPlanName}</td><td>${workoutPlanName}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
    $('#tblMember').append(row);
}




/*function getAllMembers() {
    $('#tblMember').empty();
    // members get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAllUsers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            if (response.data.length === undefined) {
                getAllMembers();
                return;
            }
            loadTrainerId();
            memberList = response.data;

            if (memberList.length === 0) {
                alert("No members found.");
                return;
            }

            $.each(response.data, function (index, member) {
                console.log(member);
                let mealPlanName = "";
                let workoutPlanName = "";
                let trainerName = "";

                // AJAX request to get meal plan
                if (member.meal_plan_id !== 0) {
                    $.ajax({
                        url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + member.meal_plan_id,
                        method: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (mealResponse) {
                            mealPlanName = mealResponse.data.planName;
                            appendRow(member, mealPlanName, workoutPlanName, trainerName);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error(jqXHR.responseText);
                        }
                    });
                } else {
                    appendRow(member, mealPlanName, workoutPlanName, trainerName);
                }

                // AJAX request to get workout plan
                if (member.workout_id !== 0) {
                    $.ajax({
                        url: 'http://localhost:8080/api/v1/workoutPlan/getWorkoutPlan/' + member.workout_id,
                        method: 'GET',
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (workoutResponse) {
                            workoutPlanName = workoutResponse.data.planName;
                            appendRow(member, mealPlanName, workoutPlanName, trainerName);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.error(jqXHR.responseText);
                        }
                    });
                } else {
                    appendRow(member, mealPlanName, workoutPlanName, trainerName);
                }

                // AJAX request to get trainer name
                $.ajax({
                    url: 'http://localhost:8080/api/v1/trainer/getTrainer/' + member.trainer_id,
                    method: 'GET',
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (trainerResponse) {
                        trainerName = trainerResponse.data.name;
                        appendRow(member, mealPlanName, workoutPlanName, trainerName);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(jqXHR.responseText);
                    }
                });
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve members. Please try again.");
            console.error(jqXHR.responseText);
        }
    });
}*/





$('#tblMember').on('click', 'tr', function () {


    let memberId = $(this).find('td:first').text();
    let memberName = $(this).find('td:nth-child(2)').text();
    let memberEmail = $(this).find('td:nth-child(3)').text();
    let trainerId = $(this).find('td:nth-child(4)').text();
    let encodedPassword = $(this).find('td:nth-child(5)').text();
    let age = $(this).find('td:nth-child(8)').text();
    let gender = $(this).find('td:nth-child(9)').text();
    // let password = decodePassword(encodedPassword);
    let password = atob(encodedPassword);
    console.log("decode " + password)
    // Perform actions with the retrieved data
    $('#memberModal').modal('show');
    $('#saveMemeber').css("display", 'none');
    $('#updateMember').css("display", 'block');
    $('#deleteMember').css("display", 'block');
    $('#member_id').val(memberId);
    $('#member_name').val(memberName);
    $('#member_email').val(memberEmail);
    $('#tra_id').val(trainerId);
    $('#memeber_password').val(password);
    $('#age').val(age);
    // $('#gender').val(gender);
    if (gender === 'male') {
        selectedValue = 'male'
        $('#inlineRadio1').prop('checked', true);
    } else if (gender === 'female') {
        selectedValue = 'female'
        $('#inlineRadio2').prop('checked', true);
    } else if (gender === 'custom') {
        selectedValue = 'custom'
        $('#inlineRadio3').prop('checked', true);
    }

});
$('#closeBtn').click(function () {
    $('#updateMember').css("display", 'none');
    $('#deleteMember').css("display", 'none');
    $('#emailErrorLabel').text("");
    $('#nameErrorLabel').text("");
    $('#pwdErrorLabel').text("");
    $('#ageErrorLabel').text("");
});
$('#addMemberBTn').click(function () {
    $('#updateMember').css("display", 'none');
    $('#deleteMember').css("display", 'none');
    $('#saveMemeber').css("display", 'block');
    $('#member_id').val("");
    $('#member_name').val("");
    $('#member_email').val("");
    $('#tra_id').val("");
    $('#memeber_password').val("");
    $('#emailErrorLabel').text("");
    $('#nameErrorLabel').text("");
    $('#pwdErrorLabel').text("");
    $('#ageErrorLabel').text("");
    $('#age').val("");
    $('#inlineRadio1').prop('checked', false);
    $('#inlineRadio2').prop('checked', false);
    $('#inlineRadio3').prop('checked', false);
});

function loadTrainerId() {
    $('#tra_id').empty();
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getAllTrainers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            response.data.sort((a, b) => a.users.length - b.users.length);
            $.each(response.data, function (index, trainer) {
                $('#tra_id').append(`<option value="${trainer.tid}">${trainer.name}</option>`);
                console.log(trainer.users.length)

            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
}

let card;
$("#searchMembers").keyup(function () {
    $('#tblMember').empty();
    let text = $('#searchMembers').val();
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/searchUserByName',
        method: 'GET',
        dataType: 'json',
        data: {partialName: text},
        success: function (response) {

            if ($("#searchMembers").val() === "") {
                $('.npResImg').addClass("d-none");
                $('#memberTable').css("display", "inline-table");
                getAllMembers();
            } else {
                $.each(response.data, function (index, member) {
                    let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td><td>${member.meal_plan_id}</td><td>${member.workout_id}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
                    $('#tblMember').append(row);
                });
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.data == null) {
                $('#memberTable').css("display", "none");
                $('.npResImg').removeClass("d-none");
            }
        }
    });
});

