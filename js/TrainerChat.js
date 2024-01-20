let trainerEmail;

window.onload = function () {
    trainerEmail = localStorage.getItem('trainer-email');
    $("#trainerEmail").text(trainerEmail);

    loadTrainerIdUsingEmail(trainerEmail);
};

let trainerId;
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
            trainerId = response.data.tid;
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
            if(response.data.length == 0){
                let element = `
                             <p class="mt-3" style="color: #858796; padding-left: 24px">No Clients Yet</p>`
                let trainerChat = $(".trainerMemberNameSection");
                trainerChat.append(element);
                return;
            }

            $.each(response.data, function (index, members) {
                loadMembersNameToChat(members);
            });
            onMemberNameClicked();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}

function loadMembersNameToChat(members) {
    let trainerChat = $(".trainerMemberNameSection");

    let memberName = `
            <a href="#" class="list-group-item list-group-item-action border-0 pb-1 memberNamesAnc">
                <div class="d-flex align-items-start">
                    <img src="../../img/user.png" class="rounded-circle mr-1" alt="member" width="40" height="40">
                    <div class="flex-grow-1 ml-3">
                        <p class="mb-0 chatMemberName">${members.name}</p>
                        <p class="small mb-0">client id: <span class="chatMemberId">${members.uid}</span></p>
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
                $(".trainerMemberNameSection").empty();
                getAllMembersAssociatedToTrainer(trainerId);
            }else{
                let trainerChat = $(".trainerMemberNameSection");
                trainerChat.empty();
                $.each(response.data, function (index, members) {
                    console.log(members);
                    let memberName = `
                     <a href="#" class="list-group-item list-group-item-action border-0 pb-0 memberNamesAnc">
                        <div class="d-flex align-items-start">
                            <img src="../../img/user.png" class="rounded-circle mr-1" alt="" width="40" height="40">
                            <div class="flex-grow-1 ml-3">
                               <p class="mb-0 chatMemberName">${members.name}</p>
                               <p class="small mb-0">client id: <span class="chatMemberId">${members.uid}</span></p>
                            </div>
                        </div>
                    </a>`;
                    trainerChat.append(memberName);
                });
                onMemberNameClicked();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

function onMemberNameClicked(){
    $(".memberNamesAnc").click(function(){
        selectedMemberName = $(this).children().children().children("p.chatMemberName").text();
        selectedMemberId = $(this).children().children().children().children("span.chatMemberId").text();
        $("#selectedMemberName").text(selectedMemberName);
        $("#selectedMemberId").text(selectedMemberId);

        $(".memberSelectVisible").removeClass("d-none");
        getAllMessages(selectedMemberId, selectedMemberName);
    })
}

$("#btnSend").click(function() {
    msg = $("#msgInputField").val();
    selectedClientId = $("#selectedMemberId").text();

    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    var formattedTime = currentDate.toTimeString().slice(0, 8);

    if(msg != "" && selectedClientId != ""){
        $.ajax({
            url: 'http://localhost:8080/api/v1/chat/save',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({"message": msg, "userSent": false, "user_id": selectedClientId,
                "trainer_id": trainerId, "date": formattedDate, "time": formattedTime}),  // Convert data to JSON string
            success: function (response) {
                console.log(response);
                selectedClientName = $("#selectedMemberName").text();
                getAllMessages(selectedClientId, selectedClientName);

                msg = $("#msgInputField").val("");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR.responseText);  // Log the response text for debugging
            }
        });
    }
});

function getAllMessages(selectedMemberId, selectedMemberName){
    $(".chat-messages").empty();

    $.ajax({
        url: 'http://localhost:8080/api/v1/chat/getAllChats/'+trainerId+"/"+selectedMemberId,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            console.log(response.data);

            if(response.data.length==0){
                let element = `
                             <p>No Messages Yet</p>`
                $(".chat-messages").append(element);
                return;
            }

            $.each(response.data, function (index, msg) {
                sentByUser = msg.userSent;

                if (sentByUser){
                    let element = `
                             <div class="chat-message-left pb-4">
                                    <div class="d-flex">
                                        <div class="text-muted small text-nowrap mt-2">${msg.date}</div>&nbsp;&nbsp;
                                        <div class="text-muted small text-nowrap mt-2">${msg.time}</div>
                                    </div>
                                    <div class="flex-shrink-1 mr-5">
                                        <div class="bg-light rounded py-2 px-3" style="width: max-content">
                                            ${msg.message}
                                        </div>                                     
                                    </div>
                             </div>`
                    $(".chat-messages").append(element);
                }else{
                    let element = `
                              <div class="chat-message-right pb-4">
                                    <div class="d-flex justify-content-end">
                                        <div class="text-muted small text-nowrap mt-2">${msg.date}</div>&nbsp;&nbsp;
                                        <div class="text-muted small text-nowrap mt-2">${msg.time}</div>
                                    </div>
                                    <div class="flex-shrink-1 ml-5 d-flex justify-content-end">
<!--                                        <div class="font-weight-bold mb-1">You</div>-->
                                         <div class="bg-light rounded py-2 px-3" style="width: max-content">
                                            ${msg.message}
                                        </div>   
                                    </div>
                              </div>`
                    $(".chat-messages").append(element);
                }
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Failed to retrieve members. Please try again.");
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}


