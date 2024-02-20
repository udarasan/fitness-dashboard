//search user with user email
let cheight;
let cweight;
let userEmail = localStorage.getItem("userEmail");
console.log(userEmail);
searchUserWithEmail();

var today = new Date();


var formattedDate = today.toLocaleDateString();

function getDataToAreaChart(uId, userData) {
    $('#nameLbl').text(userData.name);

    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/getAllProgress/' + uId,
        method: 'GET',

        contentType: 'application/json',
        success: function (response) {
            progressList = response.data;
            console.log(progressList)
            let currentProgressValues = progressList[progressList.length - 1];
            if (progressList.length !== 0) {
                cheight = currentProgressValues.height;
                cweight = currentProgressValues.weight;
            } else {
                cheight = "Not Added";
                cweight = "Not Added";
                $('#span').text("")
            }

            console.log(cheight);
            loadUserDetailsInFields(
                uId,
                userData.name,
                userData.email,
                userData.trainer_id,
                userData.meal_plan_id,
                userData.workout_id,
                cheight,
                cweight,
                userData.age,
                userData.gender,
            );
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Log the response text for debugging
        }
    });
};

function searchUserWithEmail() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data: {email: userEmail},

        success: function (response) {
            console.log(response);
            console.log(response.data.uid)
            getDataToAreaChart(response.data.uid, response.data);
        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })

}

let userProfileMain = $(".userProfileMain");

function loadUserDetailsInFields(uid, name, email, trainer_id, meal_plan_id, workout_id, height, weight, age, gender) {
    console.log(height);
    let userData = `<div class="row">                     
                            <div class="card w-100 mb-5 py-3">
                                <div class="card-body container-fluid insideContainer">
                                    <div class="row">
                                        <div class="col-md-12 col-lg-5 d-flex align-items-center justify-content-center">
                                             <div class="d-flex flex-column align-items-center text-center mb-4">
                                                 <img id="img" alt="Admin" class="rounded-circle p-1 bg-dark"
                                                    src="../../img/undraw_profile_2.svg" width="110">
                                                 <div class="mt-3">
                                                    <h4>${name}</h4>
                                                    <p class="text-muted font-size-sm">${email}</p>
                                                 </div>
                                             </div>
                                        </div>
                                        <div class="col-md-12 col-lg-7">                                                                       
                                            <ul class="list-group list-group-flush border rounded py-2">
                                                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                                    <h6  class="mb-0 ">
                                                        Trainer Id
                                                    </h6>
                                                    <span class="text-secondary">${trainer_id}</span>
                                                </li>
                                                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                                    <h6 class="mb-0">
                                                        MealPlan Id
                                                    </h6>
                                                    <span class="text-secondary">${meal_plan_id}</span>
                                                </li>
                                                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                                    <h6 class="mb-0">
                                                        WorkOut Id
                                                    </h6>
                                                    <span class="text-secondary">${workout_id}</span>
                                                </li>                                             
                                                <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                                    <h6 class="mb-0">
                                                        Height
                                                    </h6>
                                                    <span id="span" class="text-secondary ">${height} CM</span>
                                                </li>                                       
                                                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                                    <h6 class="mb-0">
                                                        Weight
                                                    </h6>
                                                    <span class="text-secondary ">${weight} KG</span>
                                                </li>                                        
                                                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                                    <h6 class="mb-0">
                                                        Age
                                                    </h6>
                                                    <span class="text-secondary ">${age}</span>
                                                </li>                                                                             
                                                    <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                                    <h6 class="mb-0">
                                                        Gender
                                                    </h6>
                                                    <span class="text-secondary ">${gender}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>                                            
                    </div>`


    userProfileMain.append(userData);
}

let height;
let weight;

userProfileMain.on("keyup", ".height", function (event) {
    let heightText = $(".height");
    let weightTxt = $(".weight");
    let bmiTxt = $("#bmi");

    // Function to calculate and update BMI
    function updateBMI() {
        let height = parseFloat(heightText.val());
        let weight = parseFloat(weightTxt.val());

        // Input validation
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            bmiTxt.val("Invalid input");
            return;
        }

        // Clear previous results
        bmiTxt.val("");

        let newHeight = height / 100;
        let bmi = parseFloat((weight / (newHeight * newHeight)).toFixed(1));

        console.log(bmi);

        // Update BMI value
        $('#bmi').val(parseFloat(bmi.toFixed(1)));
    }

    // Attach the updateBMI function to input change events
    heightText.on("input", updateBMI);
    weightTxt.on("input", updateBMI);
});

userProfileMain.on("keyup", ".weight", function (event) {
    let heightText = $(".height");
    let weightTxt = $(".weight");
    let bmiTxt = $(".bmi");

    weight = weightTxt.val();

    if (heightText.val().length === 0) {
        bmiTxt.val(weight);

    } else {
        let height = heightText.val() / 100;
        let bmi = weightTxt.val() / (height * height);
        bmiTxt.val(bmi);
    }


});

userProfileMain.on("click", ".save", function (event) {


});


