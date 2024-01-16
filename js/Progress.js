let userEmail=localStorage.getItem("userEmail");
let uId;
searchUserWithEmail();


function searchUserWithEmail(){

    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data:{email:userEmail},

        success: function (response) {
            console.log(response);
          uId= response.data.uid;
          console.log(uId);
            getAllProgress(uId);

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })

}

function getAllProgress(uId) {
    $('#tblProgress').empty();
    // members get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/getAllProgress/'+uId,
        method: 'GET',

        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {


            $.each(response.data, function (index, progress) {
                let row = `<tr><td style="display: none">${progress.pid}</td><td>${progress.height}</td><td>${progress.weight}</td><td>${progress.date}</td></tr>`;
                $('#tblProgress').append(row);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}
$('#deleteProgress').click(function () {

    let id = $('#pId').val();
    Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this record!',
        icon: 'warning', // warning icon
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Close'
    }).then((result) => {
        if (result.isConfirmed) {
            // Make the AJAX request
            $.ajax({
                url: 'http://localhost:8080/api/v1/progress/delete/' + id,
                method: 'DELETE',
                contentType: 'application/json',  // Set content type to JSON
                success: function (response) {
                    Swal.fire('Deleted!', 'Your record has been deleted.', 'success');

                   getAllProgress();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.error(jqXHR.responseText);  // Log the response text for debugging
                }
            });


        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // User clicked "Close" or outside the modal
            Swal.fire('Cancelled', 'Your record is safe :)', 'info');
        }
    });

});

$('#updateProgress').click(function () {

    let pid = $('#pId').val();
    let height = $('#height').val();
    let weight = $('#weight').val();
    let date = $('#date').val();
    console.log(uId);

    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({"pid":pid,"height": height, "weight": weight, "userId": uId, "date":date}),  // Convert data to JSON string
        success: function (response) {
          getAllProgress();

            },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }

    });

});

$('#addProgress').click(function () {

    let height = $('#height').val();
    let weight = $('#weight').val();
    let date = $('#date').val();
console.log(uId);

    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/save',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({"height": height, "weight": weight, "userId": uId, "date":date}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
              getAllProgress();


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }

    });

});
$('#tblProgress').on('click', 'tr', function () {

    // Access the data in the clicked row
    let pid = $(this).find('td:first').text(); // Assuming the first cell contains the trainer ID
    let height = $(this).find('td:nth-child(2)').text(); // Assuming the second cell contains the trainer email
    let weight = $(this).find('td:nth-child(3)').text();
    let date = $(this).find('td:nth-child(4)').text();

    // Perform actions with the retrieved data

    $('#pId').val(pid);
    $('#height').val(height);
    $('#weight').val(weight);
    $('#date').val(date);


});