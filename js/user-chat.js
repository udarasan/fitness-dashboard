let userEmail = localStorage.getItem("userEmail");
$(window).on('load', function () {
    loadUserUsingEmail(userEmail);
    $('#nameLbl').text(localStorage.getItem("name"));
});

let userId;
let trainerId;

function loadUserUsingEmail(userEmail) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: userEmail},

        success: function (response) {
            console.log(response.data);
            userId = response.data.uid;
            trainerId = response.data.trainer_id;
            getAllMessages();
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


$("#btnSend").click(function () {
    msg = $("#msgInputField").val();

    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    var formattedTime = currentDate.toTimeString().slice(0, 8);

    if (msg != "" && trainerId != 0) {
        $.ajax({
            url: 'http://localhost:8080/api/v1/chat/save',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                "message": msg, "userSent": true, "user_id": userId,
                "trainer_id": trainerId, "date": formattedDate, "time": formattedTime
            }),
            success: function (response) {
                getAllMessages();
                msg = $("#msgInputField").val("");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error(jqXHR.responseText);
            }
        });
    }
});

function getAllMessages() {
    $(".chat-messages").empty();

    $.ajax({
        url: 'http://localhost:8080/api/v1/chat/getAllChats/' + trainerId + "/" + userId,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (response) {
            console.log(response.data);

            if (response.data.length == 0) {
                let element = `
                             <p>No Messages Yet</p>`
                $(".chat-messages").append(element);
                return;
            }

            $.each(response.data, function (index, msg) {
                sentByUser = msg.userSent;

                if (sentByUser) {
                    let element = `
                          <div class="chat-message-right pb-4">
                                <div class="d-flex justify-content-end">
                                    <div class="text-muted small text-nowrap mt-2">${msg.date}</div>&nbsp;&nbsp;
                                    <div class="text-muted small text-nowrap mt-2">${msg.time}</div>
                                </div>
                                <div class="flex-shrink-1 ml-5 d-flex justify-content-end">
                                     <div class="bg-light rounded py-2 px-3" style="width: max-content; max-width: 100%">
                                        ${msg.message}
                                    </div>   
                                </div>
                          </div>`
                    $(".chat-messages").append(element);
                } else {
                    let element = `
                             <div class="chat-message-left pb-4">
                                    <div class="d-flex">
                                        <div class="text-muted small text-nowrap mt-2">${msg.date}</div>&nbsp;&nbsp;
                                        <div class="text-muted small text-nowrap mt-2">${msg.time}</div>
                                    </div>
                                    <div class="flex-shrink-1 mr-5">
                                        <div class="bg-light rounded py-2 px-3" style="width: max-content; max-width: 100%">
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
            console.error(jqXHR.responseText);
        }
    });
}


