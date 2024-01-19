let trainerEmail;

window.onload = function () {
    trainerEmail = localStorage.getItem('trainer-email');
    $("#trainerEmail").text(trainerEmail);
    console.log(trainerEmail + "ss")
    console.log('Window has fully loaded!');
    loadTrainerIdUsingEmail(trainerEmail);
};

function loadTrainerIdUsingEmail(trainerEmail) {

    console.log(trainerEmail);
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: trainerEmail},

        success: function (response) {
            console.log(response);
            console.log(response.data.tid);
            let trainerId = response.data.tid;
            getAllMembersAssociatedToTrainer(trainerId);

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


function getAllMembersAssociatedToTrainer(trainerId) {

    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer/' + trainerId,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        // data:{email:trainerId},

        success: function (response) {
            console.log(response);
            console.log(response.data.length);
            $.each(response.data, function (index, members) {
                loadMembersNameToChat(members);
                console.log(members);

            });

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}




function loadMembersNameToChat(members) {

    let trainerChat = $(".trainerMemberNameSection");

    let memberName = `

 <a href="#" class="list-group-item list-group-item-action border-0">
                                        <div class="d-flex align-items-start">
                                            <img src="../../img/user.png" class="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40">
                                            <div class="flex-grow-1 ml-3">
                                                ${members.name}
                                            </div>
                                        </div>
                                    </a>`;

    trainerChat.append(memberName);

}


$("#searchUser").keyup(function () {
    let text = $('#searchUser').val();
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/searchUserByName',
        method: 'GET',
        dataType: 'json',
        data: {partialName: text},   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            if($("#searchUser").val()===""){
                loadTrainerIdUsingEmail(trainerEmail);
                $(".trainerMemberNameSection").empty();
            }else{
                $.each(response.data, function (index, members) {
                    console.log(members);


                    let trainerChat = $(".trainerMemberNameSection");
                    trainerChat.empty();
                    let memberName = `

                     <a href="#" class="list-group-item list-group-item-action border-0">
                                                            <div class="d-flex align-items-start">
                                                                <img src="../../img/user.png" class="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40">
                                                                <div class="flex-grow-1 ml-3">
                                                                   ${members.name}
                                                                </div>
                                                            </div>
                                                        </a>`;

                    trainerChat.append(memberName);


                });

            }


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
})
