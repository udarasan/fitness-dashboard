// meal plan Get All
window.onload = function () {
    getAll();
    loadAllMembersIds();
    console.log('Window has fully loaded!');
};


function getAll() {
    $("#cardContainer").empty();
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/getAllMealPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            console.log(response.data);
            console.log(response.data.email);

            $.each(response.data, function (index, mealPlan) {
                appendMealSection(mealPlan);
                console.log(mealPlan);

            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });

}

// add new card to meal section using get all data
function appendMealSection(mealPlan) {

    let card = `
  <section class="mx-3 mb-5 mt-3" style="max-width: 25rem;">
 
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
                                        <li><a  class="dropdown-item assign " href="#" data-toggle="modal" data-target="#assignModal">Assign</a></li>
                                     </ul>
                                </div>
    
<!--      <div class="bg-image hover-overlay ripple mt-5" data-mdb-ripple-color="light">-->
<!--        <img src="https://mdbootstrap.com/img/Photos/Horizontal/Food/8-col/img (5).jpg" class="img-fluid" />-->
<!--        <a href="#!">-->
<!--          <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>-->
<!--        </a>-->
<!--      </div>-->
      
      <div class="card-body">    
        <p id="mealPlanDetail" class="card-text">${mealPlan.planDetails}</p>
        
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

        setUpdateModalContent(mealPlanName, mealPlanDetails, calorie, mealId);


    })

    // click event assign data to delete modal

    $(".delete").click(function () {

        // let value1 = $(this).find('#mealPlanName').val();
        let card = $(this).closest('.card');

        // Find the #mealPlanName element within the card and get its text content
        let mealId = card.find("#mealId").text();
        console.log(mealId);
        setDeleteModalContent(mealId);

    })

    // click event to assign data to assign modal
    $(".assign").click(function () {
        let card = $(this).closest('.card');

        let mealID = card.find("#mealId").text();
        let mealPlanName = card.find('#mealPlanName').text();
        let mealPlanDetails = card.find('#mealPlanDetail').text();
        let calorie = card.find('#mealPlanCalorie').text();

        setAssignModalContent(mealID, mealPlanName, mealPlanDetails, calorie);
    })

}


// meal plan save method
$("#saveMeal").click(function () {

    let meal_id = $("#meal_id").val();
    let meal_name = $("#meal_name").val();
    let meal_details = $("#meal_plan_details").val();
    let calorie = $("#calorie").val();

    if (meal_name === "" || meal_details === "" || calorie === "") {
        alert("please fill all empty fields !!");
    } else {

        if (isValidPlan(meal_name)) {
            $("#mealPlanNameErrorLabel").css("display", "none");
            if (isValidPlan(meal_details)) {
                $("#mealPlanDetailsErrorLabel").css("display", "none");
                if (!isNaN(calorie)) {
                    $("#mealPlanCalorieErrorLabel").css("display", "none");
                    $.ajax({
                        url: 'http://localhost:8080/api/v1/mealPlan/save',
                        method: 'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            "mid": meal_id,
                            "planName": meal_name,
                            "planDetails": meal_details,
                            "calorieCount": calorie
                        }),
                        success: function (response) {
                            console.log(response);
                            getAll();
                            alert("Meal Plan Saved Successfully !!")
                            $('#newMealModal').data('bs.modal').hide();
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
                    let errorLabel = $("#mealPlanCalorieErrorLabel");
                    errorLabel.css("display", "inline");
                    errorLabel.text("EInvalid input type !");
                }
            } else {
                let errorLabel = $("#mealPlanDetailsErrorLabel");
                errorLabel.css("display", "inline");
                errorLabel.text("Enter minimum 2 characters !");
            }
        } else {
            let errorLabel = $("#mealPlanNameErrorLabel");
            errorLabel.css("display", "inline");
            errorLabel.text("Enter minimum 2 characters !");
        }

    }


})


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

            if (isValidPlan(meal_details)) {
                $("#UpdateMealPlanDetailsErrorLabel").css("display", "none");

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
                            $('#updateMealModal').data('bs.modal').hide();
                            getAll();
                            alert("Meal Plan Updated Successfully !!")

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
                let errorLabel = $("#UpdateMealPlanDetailsErrorLabel");
                errorLabel.css("display", "inline");
                errorLabel.text("Enter minimum 2 characters !");
            }
        } else {
            let errorLabel = $("#UpdateMealPlanNameErrorLabel");
            errorLabel.css("display", "inline");
            errorLabel.text("Enter minimum 2 characters !");
        }
    }

})


// $(".delete").click(function (){
// alert("po");
//     let id = $("#mealId").val();
//     console.log(id)
//     $.ajax({
//         url: 'http://localhost:8080/api/v1/mealPlan/delete/' + id,
//         method: "DELETE",
//         success: function (response) {
//             console.log(response)
//             getAll();
//             alert("Meal Plan Deleted Successfully !!")
//             $('#deleteMealModal').data('bs.modal').hide();
//
//         },
//
//         error: function (jqXHR) {
//             console.log(jqXHR);
//         }
//     })
//
//
// })


// method to set data to update modal text fields
function setUpdateModalContent(mealPlanName, mealPlanDetails, calorie, mealId) {
    $("#Update_meal_id").val(mealId);
    $("#Update_meal_name").val(mealPlanName);
    $("#Update_meal_plan_details").val(mealPlanDetails);
    $("#Update_calorie").val(calorie);

}

// method to set data to delete modal text fields
function setDeleteModalContent(mealId) {

    var result = window.confirm("Do you want to proceed?");
    if (result) {
        $.ajax({
            url: 'http://localhost:8080/api/v1/mealPlan/delete/' + mealId,
            method: "DELETE",
            success: function (response) {
                console.log(response)
                getAll();
                alert("Meal Plan Deleted Successfully !!")
                $('#deleteMealModal').data('bs.modal').hide();
            },

            error: function (jqXHR) {
                console.log(jqXHR);
            }
        })
    } else {
        alert("Your Meal Plan Is Safe !!")
    }


}

// method to set data to assign modal text fields
function setAssignModalContent(mealID, mealPlanName, mealPlanDetails, calorie) {

    $("#assign_meal_id").val(mealID);

}

// send ajax request to load all members id to combo box
let getAllMembersResponse;

function loadAllMembersIds() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAllUsers',
        method: 'GET',
        success: function (response) {
            getAllMembersResponse = response;
            console.log(response);

            $.each(response.data, function (index, members) {
                console.log(members);
                setMemberDataToComboBox(members);
            })

        },
        error: function (xhr) {
            console.log(xhr);
        }
    })
}


// set member data to combobox based on ajax request

function setMemberDataToComboBox(members) {

    let memberData = `<option >${members.uid}</option>`
    $("#memberComboBox").append(memberData);

}

let memId;
let memberEmail;
let memberName;
let memberPassword;
let trainerId
let mealId;
let workoutId

$("#memberComboBox").click(function () {

    let memberId = $("#memberComboBox").val();
    console.log(memberId);

    $.each(getAllMembersResponse.data, function (index, members) {
        console.log(members);
        console.log(members.uid);

        if (memberId == members.uid) {
            memberName = members.name;
            $("#Member_name").val(memberName);

            memId = members.uid;
            memberEmail = members.email;
            memberName = members.name;
            memberPassword = members.password;
            trainerId = members.trainer_id;
            mealId = members.meal_plan_id;
            workoutId = members.workout_id;

            console.log(memberId);
            console.log(memberEmail);
            console.log(memberName);
            console.log(memberPassword);
            console.log(trainerId);
            console.log(mealId);
            console.log(workoutId);


        }

    })

})


// update user with mealPlan
$("#assignMealPlanBtn").click(function () {
    console.log(memId);

    console.log(memberEmail);

    let mealId = $("#assign_meal_id").val();
    console.log(mealId);

    $.ajax({
        url: 'http://localhost:8080/api/v1/user/update',
        method: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(
            {
                "uid": memId,
                "email": memberEmail,
                "meal_plan_id": mealId,
                "name": memberName,
                "password": memberPassword,
                "workout_id": workoutId,
                "trainer_id": trainerId

            }),

        success: function (response) {
            console.log(response);
        },

        error: function (jqXHR) {
            console.log(jqXHR);

        }
    })

})


// meal plan search by name

$("#SearchMeal").keyup(function () {

    let text = $('#SearchMeal').val();
    $.ajax({
        url: 'http://localhost:8080/api/v1/mealPlan/searchMealByName',
        method: 'GET',
        dataType: 'json',
        data: {partialName: text},   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            if ($("#SearchMeal").val() === "") {
                $("#cardContainer").css("justifyContent","start")
                getAll();

            } else {
                let cardContainer = $("#cardContainer");
                cardContainer.empty();
                $.each(response.data, function (index, mealPlan) {
                    console.log(mealPlan);

                    let card = `
  <section class="mx-3 my-5" style="max-width: 20rem;">

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

      

        <p id="mealPlanDetail" class="card-text">${mealPlan.planDetails}</p>

        <hr class="my-4" />
        <p  class="lead"><strong>Total calorie count : <span id="mealPlanCalorie">${mealPlan.calorieCount}</span> </strong></p>

      </div>

    </div>
  </section>
  
  
`
                    $("#cardContainer").append(card);


                });

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
           if (jqXHR.data == null) {
               $("#cardContainer").empty();

               let card = `
 <img src="https://cdn.dribbble.com/users/1242216/screenshots/9326781/media/6384fef8088782664310666d3b7d4bf2.png" alt="no" width="620px">

  
`
               let cardContainer=$("#cardContainer");
               cardContainer.css("justify-content","center")
               cardContainer.append(card);
           }
        }
    });
})




