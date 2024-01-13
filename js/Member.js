getAllMembers();
//save memeber

$('#saveMemeber').click(function () {

    let id = $('#member_id').val();
    let email = $('#member_email').val();
    let name = $('#member_name').val();
    let trainer_id = $('#tra_id').val();
    let password =$('#memeber_password').val();

  console.log(trainer_id);
    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/registration',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON

        data: JSON.stringify({"id":id,  "email": email, "password": password, "name":name , "trainer_id":trainer_id}),  // Convert data to JSON string
        success: function(response) {
            console.log(response);


        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});



function getAllMembers() {
    // members get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAllUsers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function(response) {
            console.log(response.data);
            console.log(response.data);

            $.each(response.data, function(index, member) {
                let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td></tr>`;
                $('#tblMember').append(row);
            });

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });

}
