$('#nameLbl').text(localStorage.getItem('adminEmail'));


$(window).on('load', function () {
    // Your JavaScript code goes here
    getAllEquipments();

});

$("#searchEquipments").keyup(function () {
    $('#tblEquip').empty();
    let text = $('#searchEquipments').val();
    $.ajax({
        url: 'http://localhost:8080/api/v1/equipment/searchEquipmentByName',
        method: 'GET',
        dataType: 'json',
        data: {partialName: text},   // Convert data to JSON string
        success: function (response) {

            if ($("#searchEquipments").val() === "") {
                $('.npResImg').addClass("d-none");
                $('#equipTable').css("display", "block");
                getAllEquipments();

            } else {

                $.each(response.data, function (index, equipment) {
                    let row = `<tr><td>${equipment.eid}</td><td>${equipment.equipmentName}</td><td>${equipment.equipmentDetail}</td><td>${equipment.purchaseDate}</td></tr>`;
                    $('#tblEquip').append(row);
                });
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.data);
            if (jqXHR.data == null) {
                $('#equipTable').css("display", "none");
                $('.npResImg').removeClass("d-none");


            }
        }
    });
});
$('#deleteEquip').click(function () {

    let id = $('#eId').val();
    var result = window.confirm("Do you want to proceed?");
    if (result) {
        // Make the AJAX request
        $.ajax({
            url: 'http://localhost:8080/api/v1/equipment/delete/' + id,
            method: 'DELETE',
            contentType: 'application/json',  // Set content type to JSON
            success: function (response) {
                alert("Equipment Delete successful!");
                $('#equipmentModal').modal('hide');
                getAllEquipments()
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Equipment Delete failed! Please check your input and try again.");
                console.error(jqXHR.responseText);  // Log the response text for debugging
            }
        });
    } else {
        alert("Equipment Details Is Safe !!")
    }


});

$('#updateEquip').click(function () {
    let eid = $('#eId').val();
    let name = $('#equipName').val();
    let desc = $('#equipDesc').val();
    let date = $('#date').val();

    if (!name || !desc || !date) {
        alert("Please fill in all required fields.");
        return;
    }
    if (!isValidPlan(name)) {
        $('#nameErrorLabel').text("Please enter a name with more than 2 characters");
        return;

    } else {
        $('#nameErrorLabel').text(""); // Clear the error label
    }

    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/equipment/update',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({"eid": eid, "equipmentName": name, "equipmentDetail": desc, "purchaseDate": date,}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("Equipment Update successful!");
            $('#equipmentModal').modal('hide');
            getAllEquipments()
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Equipment Update failed! Please check your input and try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});


$('#addEquip').click(function () {

    let name = $('#equipName').val();
    let desc = $('#equipDesc').val();
    let date = $('#date').val();

    if (!name || !desc || !date) {
        alert("Please fill in all required fields.");
        return;
    }
    if (!isValidPlan(name)) {
        $('#nameErrorLabel').text("Please enter a name with more than 2 characters");
        return;

    } else {
        $('#nameErrorLabel').text(""); // Clear the error label
    }

    $.ajax({
        url: 'http://localhost:8080/api/v1/equipment/save',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({"equipmentName": name, "equipmentDetail": desc, "purchaseDate": date,}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            alert("Equipment Added successful!");
            $('#equipmentModal').modal('hide');
            getAllEquipments()

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Equipment Added failed! Please check your input and try again.");
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
            if (memberList.length === 0) {
                alert("No equipments found.");
                return;
            }
            $.each(response.data, function (index, equipment) {
                let row = `<tr><td>${equipment.eid}</td><td>${equipment.equipmentName}</td><td>${equipment.equipmentDetail}</td><td>${equipment.purchaseDate}</td></tr>`;
                $('#tblEquip').append(row);
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve equipments. Please try again.");
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
    $('#nameErrorLabel').text("");
});
$('#addEquipment').click(function () {
    $('#updateEquip').css("display", 'none');
    $('#deleteEquip').css("display", 'none');
    $('#addEquip').css("display", 'block');
    $('#eId').val("");
    $('#equipName').val("");
    $('#equipDesc').val("");
    $('#date').val("");
    $('#nameErrorLabel').text("");

});

