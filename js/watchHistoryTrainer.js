let email = localStorage.getItem('trainer-email');

$(window).on('load', function () {
    $('#trainerEmail').text(email);
    getClients();

});
function getClients() {

    $('#mem_id').empty();
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: email},
        success: function (response) {
                  console.log(response.data)
            // response.data.sort((a, b) => a.users.length - b.users.length);
            $('#mem_id').append(`<option selected disabled>Select Member</option>`);
            $.each(response.data.users, function (index, member) {
                $('#mem_id').append(`<option value="${member.uid}">${member.name}</option>`);

            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
}
function setMemberDetail() {
    $('#tblHMeal').empty();
    $('#tblHWork').empty();
    let memberId = $("#mem_id").val();
    // const memberResponse = await $.ajax({
    //     url: 'http://localhost:8080/api/v1/user/getOneUser',
    //     method: 'GET',
    //     dataType: 'json',
    //     data: {email: memberId},
    //     contentType: 'application/json'
    // });
    // let MembersMealId = memberResponse.data.meal_plan_id;
    // let WorkOutId = memberResponse.data.workout_id;

    $.ajax({
        url: 'http://localhost:8080/api/v1/mealRecords/getAllMealRecords/'+memberId,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            console.log(response.data);
            let today = new Date();
            let threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            // Filter meal records for the past three months
            let filteredRecords = response.data.filter(function (mealRecord) {
                let recordDate = new Date(mealRecord.date);
                return recordDate >= threeMonthsAgo && recordDate <= today;
            });

            if (filteredRecords.length === 0) {
                $('#historyMealPlan').css("display", "none");
                $('.npResImg').removeClass("d-none");
            } else {
                $('.npResImg').addClass("d-none");
                $('#historyMealPlan').css("display", "block");
            }

            $.each(filteredRecords, function (index, mealRecords) {
                let row = `<tr><td>${mealRecords.date}</td><td>${mealRecords.meal}</td><td>${mealRecords.details}</td><td>${mealRecords.calories}</td></tr>`;
                $('#tblHMeal').append(row);
            });


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutRecords/getAllWorkOutRecords/'+memberId,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            console.log(response.data);
            let today = new Date();
            let threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

            // Filter workout records for the past three months
            let filteredRecords = response.data.filter(function (workOutRecord) {
                let recordDate = new Date(workOutRecord.date);
                return recordDate >= threeMonthsAgo && recordDate <= today;
            });

            if (filteredRecords.length === 0) {
                $('#historyWorkOutPlan').css("display", "none");
                $('.npWorkImg').removeClass("d-none");
            } else {
                $('.npWorkImg').addClass("d-none");
                $('#historyWorkOutPlan').css("display", "block");
            }

            $.each(filteredRecords, function (index, workOutRecords) {
                let row = `<tr><td>${workOutRecords.date}</td><td>${workOutRecords.workout}</td><td>${workOutRecords.details}</td><td>${workOutRecords.calories}</td></tr>`;
                $('#tblHWork').append(row);
            });


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });
}

$('#mem_id').on('change', function () {
    let memberId = $("#mem_id").val();

    setMemberDetail();
    // $.each(trainerList, function (index, trainer) {
    //     if (trainerId == trainer.tid) {
    //         currntTrainerName = trainer.name;
    //         currntTrainerEmail = trainer.email;
    //         console.log(currntTrainerName);
    //     }
    // })

});