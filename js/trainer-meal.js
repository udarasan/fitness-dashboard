let trainerEmail;
$(window).on('load', function () {
    trainerEmail = localStorage.getItem('trainer-email');
    $("#trainerEmail").text(trainerEmail);
    loadTrainerId();
    getAll();
    loadAllMembersIds();

    console.log(trainerEmail + "ss")
    console.log('Window has fully loaded!');
});

function getAll() {

    $("#cardContainer").empty();
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getAllMealPlans',
        method: "GET",
        success: function (response) {
            console.log(response);
            console.log(response.data.length);

            if (response.data.length === undefined) {
                getAll();
                return;
            }

            if (response.data.length == 0) {
                alert("No meal plans found");
            } else {
                $.each(response.data, function (index, mealPlan) {
                    appendMealSection(mealPlan);
                });
            }
        },

        error: function (XHR) {
            console.log(XHR);
        }
    })
}


// add new card to meal section using get all data
function appendMealSection(mealPlan) {
    let plandetails = mealPlan.planDetails;
    plandetails = plandetails.replace(/ (?=\n)/g, '&nbsp;');
    plandetails = plandetails.replace(/\n/g, '<br>');

    let card = `
  <section class="mx-3 mb-3 mt-4" style="min-width: 20rem;">

    <div id="card" class="card" >
   
      <div class="card-header px-4" style="background-color: #2d324a; color: white">
      <p id="mealPlanName" class="mb-0" style="font-size: 1rem; font-weight: 400 !important;"><a>${mealPlan.planName}</a></p>
     <p class="small mb-0">meal plan id:&nbsp;&nbsp;<span id="mealId">${mealPlan.mid}</span></p>
     <p class="small mb-0"><span id="mealType">${mealPlan.mealType}</span></p>
</div>

        

     <div class="dropdown position-absolute threeDots">
     
                                     <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                     </a>
                                     <ul class="dropdown-menu">
<!--                                        <li><a id="edit"  class="dropdown-item edit" href="#" data-toggle="modal" data-target="#updateMealModal" >Edit</a></li>-->
<!--                                        <li><a class="dropdown-item delete" href="#" >Delete</a></li>-->
                                        <li><a class="dropdown-item assign" href="#" data-toggle="modal" data-target="#assignModal">Assign</a></li>
                                     </ul>
                                </div>

<!--      <div class="bg-image hover-overlay ripple mt-5" data-mdb-ripple-color="light">-->
<!--        <img src="https://mdbootstrap.com/img/Photos/Horizontal/Food/8-col/img (5).jpg" class="img-fluid" />-->
<!--        <a href="#!">-->
<!--          <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>-->
<!--        </a>-->
<!--      </div>-->

      <div class="card-body">

      

        <p id="mealPlanDetail" class="card-text">${plandetails}</p>

        <hr class="my-4" />
        <p  class="lead"><strong>Total calorie count : <span id="mealPlanCalorie">${mealPlan.calorieCount}</span> </strong></p>

      </div>

    </div>

  </section>
`
    $("#cardContainer").append(card);

    // /click event to assign data to update modal

    $(".edit").click(function () {

        // let value1 = $(this).find('#mealPlanName').val();
        let card = $(this).closest('.card');

        // Find the #mealPlanName element within the card and get its text content
        let mealId = card.find("#mealId").text();
        let mealPlanName = card.find('#mealPlanName').text();
        let mealPlanDetails = card.find('#mealPlanDetail').text();
        let calorie = card.find('#mealPlanCalorie').text();

        setTrainerUpdateModalContent(mealPlanName, mealPlanDetails, calorie, mealId);


    })

    // click event assign data to delete modal

    $(".delete").click(function () {

        // let value1 = $(this).find('#mealPlanName').val();
        let card = $(this).closest('.card');

        // Find the #mealPlanName element within the card and get its text content
        let mealId = card.find("#mealId").text();
        console.log(mealId)

        setTrainerDeleteModalContent(mealId);

    })

    $(".assign").click(function () {
        let card = $(this).closest('.card');

        let mealID = card.find("#mealId").text();
        let mealType=card.find("#mealType").text();
        // let mealPlanName = card.find('#mealPlanName').text();
        // let mealPlanDetails = card.find('#mealPlanDetail').text();
        // let calorie = card.find('#mealPlanCalorie').text();

        setTrainerAssignModalContent(mealID,mealType);
    })


}

function setTrainerAssignModalContent(mealID,mealType) {
    $("#assign_meal_id").val(mealID);
    $("#type_check").val(mealType);
}

function setTrainerUpdateModalContent(mealPlanName, mealPlanDetails, calorie, mealId) {
    $("#Update_meal_id").val(mealId);
    $("#Update_meal_name").val(mealPlanName);
    $("#Update_meal_plan_details").val(mealPlanDetails);
    $("#Update_calorie").val(calorie);

}

function setTrainerDeleteModalContent(mealId) {

    var result = window.confirm("Do you want to proceed?");
    if (result) {
        $.ajax({
            url: 'http://localhost:8080/api/v1/mealPlan/delete/' + mealId,
            method: "DELETE",
            success: function (response) {
                console.log(response)
                getAll();
                alert("Meal Plan Deleted Successfully !!")
            },

            error: function (jqXHR) {
                console.log(jqXHR);
            }
        })
    } else {
        alert("Your Meal Plan Is Safe !!")
    }

}


// meal plan save method
$("#saveMeal").click(function () {

    let meal_name = $("#meal_name").val();
    let meal_details = $("#meal_plan_details").val();
    let calorie = $("#calorie").val();
    let mealType=$("#trainerMealType").val();
    console.log(mealType)

    if (meal_name === "" || meal_details === "" || calorie === "" || $("#memberComboBox").val() === "") {
        alert("please fill all empty fields !!");
    } else {
        if (isValidPlan(meal_name)) {
            $("#TrainerMealPlanNameErrorLabel").css("display", "none");


            if (!isNaN(calorie)) {
                $("#TrainerMealPlanCalorieErrorLabel").css("display", "none");

                $.ajax({
                    url: 'http://localhost:8080/api/v1/mealPlan/assignNewMealPlan',
                    method: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({

                        "mealPlanDTO": {
                            "planName": meal_name,
                            "planDetails": meal_details,
                            "calorieCount": calorie,
                            "mealType":mealType
                        },
                        "userDTO": {
                            "uid": memId,
                            "email": memberEmail,
                            "name": memberName,
                            "password": memberPassword,
                            "workout_id": workoutId,
                            "trainer_id": trainerIdd,
                            "age": age,
                            "gender": gender
                        }

                    }),

                    success: function (response) {
                        console.log(response);
                        // updateMemberWithMealId(meal_id);
                        alert("Meal Plan Saved Successfully !!")

                        getAll();
                        $('#TrainerNewMealModal').data('bs.modal').hide();
                        $("#meal_id").val("");
                        $("#meal_name").val("");
                        $("#meal_plan_details").val("");
                        $("#calorie").val("");
                    },

                    error: function (jqXHR) {
                        console.log(jqXHR);

                    }
                })

            } else {
                let errorLabel = $("#TrainerMealPlanCalorieErrorLabel");
                errorLabel.css("display", "inline");
                errorLabel.text("Invalid input type !");
            }


        } else {
            let errorLabel = $("#TrainerMealPlanNameErrorLabel");
            errorLabel.css("display", "inline");
            errorLabel.text("Enter minimum 2 characters !");

        }
    }


})
// let meal_id = $("#meal_id").val();


$("#updateMeal").click(function () {

    let meal_id = $("#Update_meal_id").val();
    let meal_name = $("#Update_meal_name").val();
    let meal_details = $("#Update_meal_plan_details").val();
    let calorie = $("#Update_calorie").val();

    if (meal_name === "" || meal_details === "" || calorie === "") {
        alert("please fill all empty fields !!");
    } else {

        if (isValidPlan(meal_name)) {
            $("#UpdateMealPlanNameErrorLabel").css("display", "none");


            if (!isNaN(calorie)) {
                $("#UpdateMealPlanCalorieErrorLabel").css("display", "none");
                $.ajax({
                    url: 'http://localhost:8080/api/v1/mealPlan/update',
                    method: "post",
                    dataType: "json",
                    contentType: "application/json;",
                    data: JSON.stringify({
                        "mid": meal_id,
                        "planName": meal_name,
                        "planDetails": meal_details,
                        "calorieCount": calorie
                    }),

                    success: function (response) {
                        console.log(response);
                        alert("Meal Plan Updated Successfully !!")
                        $('#updateMealModal').data('bs.modal').hide();
                        getAll();

                    },

                    error: function (jqXHR) {
                        console.log(jqXHR);
                    }
                })
            } else {
                let errorLabel = $("#UpdateMealPlanCalorieErrorLabel");
                errorLabel.css("display", "inline");
                errorLabel.text("Invalid input type !");
            }


        } else {
            let errorLabel = $("#UpdateMealPlanNameErrorLabel");
            errorLabel.css("display", "inline");
            errorLabel.text("Enter minimum 2 characters !");
        }
    }
})


//load trainer id using email
let trainerId;

function loadTrainerId() {
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
            loadAllMembersIds();

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })
}


// send ajax request to load all members id to combo box
// loadTrainerId();
let getAllMembersResponse;

function loadAllMembersIds() {
    console.log(trainerId);


    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getOneTrainer/' + trainerId,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        // data:{email:trainerId},

        success: function (response) {
            getAllMembersResponse = response;
            console.log(response);

            $.each(response.data, function (index, members) {
                console.log(members.name);
                setMemberDataToComboBox(members);
            })

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })

}

// set member data to combobox based on ajax request

function setMemberDataToComboBox(members) {

    console.log("popop "+members.name)

    let firstOpt = ` <option class="d-none" value="" selected></option>`;
    $("#assign_member_id").append(firstOpt);
    $("#memberComboBox").append(firstOpt);

    let memberData = `<option value="${members.uid}" >${members.name}</option>`
    $("#memberComboBox").append(memberData);
    $("#assign_member_id").append(memberData);

}

let memId;
let memberEmail;
let memberName;
let memberPassword;
let trainerIdd;
let workoutId;
let age;
let gender;

let breakFastMeal;
let lunchMeal;
let dinnerMeal;

$("#memberComboBox").click(function () {

    let memberId = $("#memberComboBox").val();
    console.log(memberId);

    $.each(getAllMembersResponse.data, function (index, members) {

        // memId = members.uid;
        // memberEmail = members.email;
        // memberName = members.name;
        // memberPassword = members.password;
        // trainerIdd = members.trainer_id;
        // workoutId = members.workout_id;
        // age = members.age;
        // gender = members.gender;

        console.log(members);
        console.log(members.uid);
        console.log(memberEmail);
        console.log(memberPassword);
        console.log(memberName);
        console.log(trainerIdd);
        console.log(workoutId);
        console.log(age);
        console.log(gender);


        if (memberId == members.uid) {
            let memberNames = members.name;
            $("#Member_name").val(memberNames);

            memId = members.uid;
            memberEmail = members.email;
            memberName = members.name;
            memberPassword = members.password;
            trainerIdd = members.trainer_id;
            workoutId = members.workout_id;
            age = members.age;
            gender = members.gender;
        }

    })
})


// set selected name to assign meal plan modal
$("#assign_member_id").click(function () {

    let memberId = $("#assign_member_id").val();
    console.log("lolll "+memberId);



    $.each(getAllMembersResponse.data, function (index, members) {

        // memId = members.uid;
        // memberEmail = members.email;
        // memberName = members.name;
        // memberPassword = members.password;
        // trainerIdd = members.trainer_id;
        // workoutId = members.workout_id;
        // age = members.age;
        // gender = members.gender;

        // console.log(members);
        // console.log(members.uid);
        console.log(memberEmail);
        console.log(memberPassword);
        console.log(memberName);
        console.log(trainerIdd);
        console.log(workoutId);
        console.log(age);
        console.log(gender);


        if (memberId === members.uid) {
            let memberNames= members.name;
            console.log("lol name "+memberNames)
            $("#assign_member_name").val(memberId);

            memId = members.uid;
            memberEmail = members.email;
            memberName = members.name;
            memberPassword = members.password;
            trainerIdd = members.trainer_id;
            workoutId = members.workout_id;
            age = members.age;
            gender = members.gender;
        }

    })
})


// update user with mealPlan
$("#assignTrainerMealPlanBtn").click(function () {

    console.log("last check"+$("#assign_member_name").val())

    console.log(memId);
    console.log(memberEmail);

    let mealId = $("#assign_meal_id").val();

    let typeCheck=$("#type_check").val();

    if(typeCheck==="Breakfast"){
        breakFastMeal=mealId;
    }
    if(typeCheck==="Lunch"){
        lunchMeal=mealId;
    }
    if(typeCheck==="Dinner"){
        dinnerMeal=mealId;
    }


    if ($("#assign_member_id").val() === "") {
        alert("please select member to assign !!")
    } else {
        $.ajax({
            url: 'http://localhost:8080/api/v1/user/update',
            method: "post",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(
                {
                    "uid": $("#assign_member_name").val(),
                    "email": memberEmail,
                    "meal_plan_id": mealId,
                    "name": memberName,
                    "password": memberPassword,
                    "workout_id": workoutId,
                    "trainer_id": trainerId,
                    "age": age,
                    "gender": gender,
                    "breakFastMeal":breakFastMeal,
                    "lunchMeal":lunchMeal,
                    "dinnerMeal":dinnerMeal

                }),

            success: function (response) {
                console.log(response);
                alert("Meal Plan Assigned successfully !!")
                $('#assignModal').data('bs.modal').hide();
            },

            error: function (jqXHR) {
                console.log(jqXHR);

            }
        })
    }


})


// meal plan search by name

$("#SearchMeal").keyup(function () {
    let text = $('#SearchMeal').val();
    if (text === "") {
        $("#cardContainer").css("justifyContent", "start")
        getAll();
        return;
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/searchMealByName',
        method: 'GET',
        dataType: 'json',
        data: {partialName: text},   // Convert data to JSON string
        success: function (response) {
            console.log(response);

            let cardContainer = $("#cardContainer");
            cardContainer.empty();

            $.each(response.data, function (index, mealPlan) {
                console.log(mealPlan);

                let plandetails = mealPlan.planDetails;
                plandetails = plandetails.replace(/ (?=\n)/g, '&nbsp;');
                plandetails = plandetails.replace(/\n/g, '<br>');

                let card = `
  <section class="mx-3 my-5" style="min-width: 20rem">

    <div id="card" class="card" >
   
      <div class="card-header px-4" style="background-color: #2d324a; color: white">
      <p id="mealPlanName" class="mb-0" style="font-size: 1rem; font-weight: 400 !important;"><a>${mealPlan.planName}</a></p>
     <p class="small mb-0">meal plan id:&nbsp;&nbsp;<span id="mealId">${mealPlan.mid}</span></p>
</div>

     <div class="dropdown position-absolute threeDots">
                                     <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                     </a>
                                     <ul class="dropdown-menu">
                                        <li><a id="edit"  class="dropdown-item edit" href="#" data-toggle="modal" data-target="#updateMealModal" >Edit</a></li>
                                        <li><a class="dropdown-item delete" href="#" >Delete</a></li>
                                        <li><a class="dropdown-item assign" href="#" data-toggle="modal" data-target="#assignModal">Assign</a></li>
                                     </ul>
                                </div>

      <div class="card-body">

      

        <p id="mealPlanDetail" class="card-text">${plandetails}</p>

        <hr class="my-4" />
        <p  class="lead"><strong>Total calorie count : <span id="mealPlanCalorie">${mealPlan.calorieCount}</span> </strong></p>

      </div>

    </div>

  </section>
`
                $("#cardContainer").append(card);


            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging

            if (jqXHR.data == null) {
                $("#cardContainer").empty();

                let card = `
 <img  src="https://cdn.dribbble.com/users/1242216/screenshots/9326781/media/6384fef8088782664310666d3b7d4bf2.png" alt="no" width="620px">

  
`
                let cardContainer = $("#cardContainer");
                cardContainer.css("justify-content", "center")
                cardContainer.append(card);
            }
        }
    });
})




