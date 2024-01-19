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


$("#searchUser").keyup(function (){
    let text = $('#searchUser').val();
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/plansByPartName',
        method: 'GET',
        dataType: 'json',
        data: {partialName: text},   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $(".gridContainer").empty();
            $.each(response.data, function (index, workOut) {
                let card = `<div class="card workoutCard text-left p-0 ">
                            <div class="card-header px-4">                          
                                <h6 class="mb-1 mt-1">${workOut.planName}</h6>  
                                <p class="mb-0 small text-light">workout id: &nbsp; ${workOut.wid}</p>  
                                <div class="dropdown position-absolute threeDots">
                                     <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                     </a>
                                     <ul class="dropdown-menu">
                                        <li><a class="dropdown-item btnEdit" data-target="#updateWorkoutModal" 
                                        data-toggle="modal" href="#">Edit</a></li>
                                        <li><a class="dropdown-item btnDelete" href="#">Delete</a></li>
                                        <li><a class="dropdown-item btnAssign" data-target="#assignWorkoutModal" 
                                        data-toggle="modal" href="#">Assign</a></li>
                                     </ul>
                                </div>  
                            </div>
                            <div class="card-body px-4">
                                <input class="hiddenWorkoutId" type="hidden" value="${workOut.wid}">
                                <p class="card-text">${workOut.planDetails}</p>
                                <p class="card-text">calorie count: ${workOut.burnsCalorieCount} calories</p>
                            </div>
                        </div>`

                $(".gridContainer").append(card);
            });

            btnEditOnCLick();
            btnDeleteOnClick();
            btnAssignOnClick();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
})
