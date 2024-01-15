

$(document).ready(function () {
    // Your JavaScript code goes here
    getAllEquipments();

});
$('#deleteEquip').click(function () {

    let id = $('#eId').val();


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
                url: 'http://localhost:8080/api/v1/equipment/delete/' + id,
                method: 'DELETE',
                contentType: 'application/json',  // Set content type to JSON
                success: function (response) {
                    Swal.fire('Deleted!', 'Your record has been deleted.', 'success');
                    $('#equipmentModal').modal('hide');
                    getAllEquipments()
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

$('#updateEquip').click(function () {
    let eid = $('#eId').val();
    let name = $('#equipName').val();
    let desc = $('#equipDesc').val();
    let date = $('#date').val();


    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/equipment/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({"eid": eid, "equipmentName": name, "equipmentDetail": desc, "purchaseDate": date,}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $('#equipmentModal').modal('hide');
            getAllEquipments()
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

$('#addEquip').click(function () {

    let name = $('#equipName').val();
    let desc = $('#equipDesc').val();
    let date = $('#date').val();


    $.ajax({
        url: 'http://localhost:8080/api/v1/equipment/save',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({ "equipmentName": name, "equipmentDetail": desc, "purchaseDate": date,}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $('#equipmentModal').modal('hide');
            getAllEquipments()

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }

    });

});


function getAllEquipments() {
    $('#tblEquip').empty();
    // members get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/equipment/getAllEquipment',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            console.log(response.data);
            console.log(response.data);
            memberList = response.data;

            $.each(response.data, function (index, equipment) {
                let row = `<tr><td>${equipment.eid}</td><td>${equipment.equipmentName}</td><td>${equipment.equipmentDetail}</td><td>${equipment.purchaseDate}</td></tr>`;
                $('#tblEquip').append(row);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}

$('#tblEquip').on('click', 'tr', function () {

    // Access the data in the clicked row
    let equipId = $(this).find('td:first').text(); // Assuming the first cell contains the trainer ID
    let equipName = $(this).find('td:nth-child(2)').text(); // Assuming the second cell contains the trainer email
    let equipDetails = $(this).find('td:nth-child(3)').text();
    let equipDate = $(this).find('td:nth-child(4)').text();

    // Perform actions with the retrieved data
    $('#equipmentModal').modal('show');
    $('#addEquip').css("display", 'none');
    $('#updateEquip').css("display", 'block');
    $('#deleteEquip').css("display", 'block');
    $('#eId').val(equipId);
    $('#equipName').val(equipName);
    $('#equipDesc').val(equipDetails);
    $('#date').val(equipDate);


});

$('#closeBtn').click(function () {
    $('#updateEquip').css("display", 'none');
    $('#deleteEquip').css("display", 'none');
});
$('#addEquipment').click(function () {
    $('#updateEquip').css("display", 'none');
    $('#deleteEquip').css("display", 'none');
    $('#addEquip').css("display", 'block');
    $('#eId').val("");
    $('#equipName').val("");
    $('#equipDesc').val("");
    $('#date').val("");

});