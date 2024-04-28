$('#nameLbl').text(localStorage.getItem('adminEmail'));
let meal_id;
let workout_id;
var selectedValue;
let breakFast;
let lunch;
let dinner;

let getAllMembersResponse;


loadTrainerId();
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
    let memberType = $('#memberType').val();
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
                        "meal_plan_id": selectedMealPlanId,
                        "workout_id": selectedWorkoutId,
                        "age": age,
                        "gender": gender,
                        "breakFastMeal":selectedBreakFastMeal,
                        "lunchMeal":selectedLunchMeal,
                        "dinnerMeal":selectedDinnerMeal,
                        "workoutType": memberType
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
    let memberType = $('#memberType').val();
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
                        "gender": gender,
                        // "breakFastMeal":breakFast,
                        // "lunchMeal":lunch,
                        // "dinnerMeal":dinner,
                        "workoutType": memberType
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
                            if (member.meal_plan_id !== 0) {
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
                                        } else {
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
                            /!*  appendRow(member, mealPlan, "", "");*!/
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
                    /!*     }
                     let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td><td></td><td>${member.workout_id}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
                     $('#tblMember').append(row);*!/
                }
            });


        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve members. Please try again.");
            console.error(jqXHR.responseText);
        }
    });
}*/


async function getAllMembers() {
    $('#tblMember').empty();
    try {
        const response = await $.ajax({
            url: 'http://localhost:8080/api/v1/user/getAllUsers',
            method: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        });

        if (!Array.isArray(response.data) || response.data.length === 0) {
            alert("No members found.");
            return;
        }

        console.log(response.data);

        for (const member of response.data) {
            let trainerName;
            let workoutPlanName;

            breakFast = member.breakFastMeal;
            lunch  = member.lunchMeal;
            dinner = member.dinnerMeal;

            if (member.trainer_id !== 0) {
                const trainerResponse = await $.ajax({
                    url: 'http://localhost:8080/api/v1/trainer/getTrainer/' + member.trainer_id,
                    method: 'GET',
                    dataType: 'json',
                    contentType: 'application/json'
                });
                trainerName = trainerResponse.data.name;
            }else{
                trainerName = "Not Assigned";
            }

            // if (member.meal_plan_id !== 0) {
            //     const mealResponse = await $.ajax({
            //         url: 'http://localhost:8080/api/v1/mealPlan/getMealPlan/' + member.meal_plan_id,
            //         method: 'GET',
            //         dataType: 'json',
            //         contentType: 'application/json'
            //     });
            //     mealPlan = mealResponse.data.planName;
            // }

            if (member.workout_id !== 0) {
                const workoutResponse = await $.ajax({
                    url: 'http://localhost:8080/api/v1/workoutplan/getWorkOutPlan/' + member.workout_id,
                    method: 'GET',
                    dataType: 'json',
                    contentType: 'application/json'
                });
                workoutPlanName = workoutResponse.data.planName;
            }else{
                workoutPlanName = "Not Assigned";
            }

            appendRow(member, workoutPlanName, trainerName, member.trainer_id);
        }
    } catch (error) {
        alert("Failed to retrieve members. Please try again.");
        console.error(error);
    }
}

// Function to append row to table


// Call getAllMembers function to start fetching members


function appendRow(member, workoutPlanName, trainerName, trainerId) {
    let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${trainerName}</td>
        <td style="display: none">${member.password}</td><td>${member.age}</td><td>${member.gender}</td>
        <td>${workoutPlanName}</td><td>${member.workoutType}</td><td>${member.breakFastMeal}</td>
        <td>${member.lunchMeal}</td><td>${member.dinnerMeal}</td><td>${trainerId}</td>
        </tr>`;
    $('#tblMember').append(row);
}

let memberEmail;
$('#tblMember').on('click', 'tr', function () {
 getOneMemberDetails();

    let memberId = $(this).find('td:first').text();
    let memberName = $(this).find('td:nth-child(2)').text();
    memberEmail = $(this).find('td:nth-child(3)').text();
    let trainerName = $(this).find('td:nth-child(4)').text();
    let trainerId = $(this).find('td:nth-child(13)').text();
    let encodedPassword = $(this).find('td:nth-child(5)').text();
    let age = $(this).find('td:nth-child(6)').text();
    let gender = $(this).find('td:nth-child(7)').text();
    let password = atob(encodedPassword);
    console.log("decode " + password)
    console.log(trainerName)
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
                    let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td><td>${member.meal_plan_id}</td><td>${member.workout_id}</td><td>${member.age}</td><td>${member.gender}</td><td>${member.workoutType}</td></tr>`;
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


//new

let selectedMemId;
let selectedMemberEmail;
let selectedMemberName;
let selectedMemberPassword;
let selectedTrainerIdd;
let selectedWorkoutId;
let selectedAge;
let selectedGender;

let selectedBreakFastMeal;
let selectedLunchMeal;
let selectedDinnerMeal;
let selectedMealPlanId;

let workoutType;
 function getOneMemberDetails() {

     $.ajax({
         url: 'http://localhost:8080/api/v1/user/getAllUsers',
         method: 'GET',
         dataType: 'json',
         contentType: 'application/json',
         // data:{email:trainerId},

         success: function (response) {
             getAllMembersResponse = response;
             console.log(response);

             $.each(response.data, function (index, members) {
                 console.log(members.name);

                 if (memberEmail===members.email){
                     selectedMemId=members.uid;
                     selectedMemberEmail=members.email;
                     selectedMemberName=members.name;
                     selectedMemberPassword=members.password;
                     selectedTrainerIdd=members.trainer_id;
                     selectedWorkoutId=members.workout_id;
                     selectedAge=members.age;
                     selectedGender=members.gender;
                     selectedBreakFastMeal=members.breakFastMeal;
                     selectedLunchMeal=members.lunchMeal
                     selectedDinnerMeal=members.dinnerMeal;
                     selectedMealPlanId=members.meal_plan_id

                 }
             })

             console.log(selectedMemId);
             console.log(selectedMemberName);
             console.log(selectedGender);
             console.log(selectedAge);
             console.log(selectedBreakFastMeal);


         },
         error: function (jqXHR) {
             console.log(jqXHR.responseText);
         }
     })

}




