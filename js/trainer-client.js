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

function getClientsWithTrainer(trainerId) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer/' + trainerId,
        method: 'GET',

        contentType: 'application/json',

        success: function (response) {


            console.log(response.data);
            $.each(response.data, function (index, client) {

                let row = `<tr><td>${client.uid}</td><td>${client.name}</td><td>${client.email}</td><td>${client.meal_plan_id}</td><td >${client.workout_id}</td><td >${client.age}</td><td >${client.gender}</td></tr>`;
                $('#tblClient').append(row);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);
        }
    });

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
