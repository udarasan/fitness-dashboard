getAll();
loadAllMembersIds();
function getAll(){
    $("#cardContainer").empty();
    $.ajax({
        url:'http://localhost:8080/api/v1/mealPlan/getAllMealPlans',
        method:"GET",
        success:function (response){
            console.log(response)

            $.each(response.data, function (index, mealPlan) {
                appendMealSection(mealPlan);
                console.log(mealPlan);


            });
        },

        error:function (XHR){
            console.log(XHR);
        }
    })
}


// add new card to meal section using get all data
function appendMealSection(mealPlan) {

    let card = `
  <section class="mx-3 my-5" style="max-width: 20rem;">

    <div id="card" class="card" >
    <p  >trainer</p>

    <p id="mealId" class="d-none">${mealPlan.mid}</p>

     <div class="dropdown position-absolute threeDots">
                                     <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                     </a>
                                     <ul class="dropdown-menu">
                                        <li><a id="edit"  class="dropdown-item edit" href="#" data-toggle="modal" data-target="#updateMealModal" >Edit</a></li>
                                        <li><a class="dropdown-item delete" href="#" data-toggle="modal" data-target="#deleteMealModal">Delete</a></li>
                                        <li><a class="dropdown-item assign" href="#" data-toggle="modal" data-target="#assignModal">Assign</a></li>
                                     </ul>
                                </div>

      <div class="bg-image hover-overlay ripple mt-5" data-mdb-ripple-color="light">
        <img src="https://mdbootstrap.com/img/Photos/Horizontal/Food/8-col/img (5).jpg" class="img-fluid" />
        <a href="#!">
          <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
        </a>
      </div>

      <div class="card-body">

        <h5 id="mealPlanName" class="card-title font-weight-bold"><a>${mealPlan.planName}</a></h5>

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
        let mealPlanName = card.find('#mealPlanName').text();
        let mealPlanDetails = card.find('#mealPlanDetail').text();
        let calorie = card.find('#mealPlanCalorie').text();

        setDeleteModalContent(mealPlanName, mealPlanDetails, calorie, mealId);

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
document.getElementById("saveMeal").addEventListener('click', function () {
    let meal_id = $("#meal_id").val();
    let meal_name = $("#meal_name").val();
    let meal_details = $("#meal_plan_details").val();
    let calorie = $("#calorie").val();


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
            updateMemberWithMealId(meal_id);

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

})





// send ajax request to load all members id to combo box
let getAllMembersResponse;
function  loadAllMembersIds(){
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
document.getElementById("memberComboBox").addEventListener("click", function () {
    let memberId = $("#memberComboBox").val();
    console.log(memberId);

    $.each(getAllMembersResponse.data, function (index, members) {
        console.log(members);
        console.log(members.uid)
        memId = members.uid;
        memberEmail = members.email;

        if (memberId == members.uid) {
            let memberName = members.name;
            $("#Member_name").val(memberName);
        }

    })

})


// update member with meal id
function updateMemberWithMealId(mealId) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/update',
        method: "post",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({"uid": memId, "email": memberEmail, "meal_id": mealId}),

        success: function (response) {
            console.log(response);
        },

        error: function (jqXHR) {
            console.log(jqXHR);

        }
    })

}
