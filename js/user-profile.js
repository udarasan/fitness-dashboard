//search user with user email
let cheight;
let cweight;
let userEmail=localStorage.getItem("userEmail");
console.log(userEmail);
searchUserWithEmail();

var today = new Date();


var formattedDate = today.toLocaleDateString();

function getDataToAreaChart(uId,userData){
    $('#nameLbl').text(userData.name);

    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/getAllProgress/'+uId,
        method: 'GET',

        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            progressList=response.data;
            console.log(progressList)
            let currentProgressValues = progressList[progressList.length - 1];
            if (progressList.length!==0){
                cheight = currentProgressValues.height;
                cweight = currentProgressValues.weight;
            }else {
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
                cweight
            );
            // console.log(currentProgressValues.height);

        },
        error: function (jqXHR, textStatus, errorThrown) {
           // Log the response text for debugging
        }
    });
};

function searchUserWithEmail(){

    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data:{email:userEmail},

        success: function (response) {
            console.log(response);
            console.log(response.data.uid)
            getDataToAreaChart(response.data.uid, response.data);
            // console.log(cheight);
            // loadUserDetailsInFields(
            //     response.data.uid,
            //     response.data.name,
            //     response.data.email,
            //     response.data.trainer_id,
            //     response.data.meal_plan_id,
            //     response.data.workout_id,
            //
            //     );


        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })

}
// function processUserData(cheight) {
//     // Code that depends on cheight
//     console.log(cheight);
//
//     // The rest of your code that uses cheight
//     // ...
// }

let userProfileMain=$(".userProfileMain");

function loadUserDetailsInFields(uid, name, email,trainer_id,meal_plan_id,workout_id,height,weight) {
console.log(height);
   let userData= `<div class="row">
                        <div class="col-lg-12">
                            <div class="card">
                                <div class="card-body">
                                    <div class="d-flex flex-column align-items-center text-center">
                                        <img id="img" alt="Admin" class="rounded-circle p-1 bg-primary"
                                             src="https://bootdey.com/img/Content/avatar/avatar6.png" width="110">
                                        <div class="mt-3">
                                            <h4>${name}</h4>
                                            <p class="text-muted font-size-sm">${email}</p>

                                        </div>
                                    </div>
                                    <hr class="my-4">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6  class="mb-0 ">
<!--                                                <svg class="feather feather-github me-2 icon-inline" fill="none" height="24"-->
<!--                                                     stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"-->
<!--                                                     stroke-width="2" viewBox="0 0 24 24" width="24"-->
<!--                                                     xmlns="http://www.w3.org/2000/svg">-->
<!--                                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>-->
<!--                                                </svg>-->
                                                Trainer Id
                                            </h6>
                                            <span class="text-secondary">${trainer_id}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 class="mb-0">
<!--                                                <svg class="feather feather-twitter me-2 icon-inline text-info" fill="none" height="24"-->
<!--                                                     stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"-->
<!--                                                     stroke-width="2" viewBox="0 0 24 24" width="24"-->
<!--                                                     xmlns="http://www.w3.org/2000/svg">-->
<!--                                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>-->
<!--                                                </svg>-->
                                                MealPlan Id
                                            </h6>
                                            <span class="text-secondary">${meal_plan_id}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 class="mb-0">
<!--                                                <svg class="feather feather-instagram me-2 icon-inline text-danger" fill="none" height="24"-->
<!--                                                     stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"-->
<!--                                                     stroke-width="2" viewBox="0 0 24 24" width="24"-->
<!--                                                     xmlns="http://www.w3.org/2000/svg">-->
<!--                                                    <rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect>-->
<!--                                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>-->
<!--                                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>-->
<!--                                                </svg>-->
                                                WorkOut Id
                                            </h6>
                                            <span class="text-secondary">${workout_id}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 class="mb-0">
<!--                                                <svg class="feather feather-facebook me-2 icon-inline text-primary" fill="none" height="24"-->
<!--                                                     stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"-->
<!--                                                     stroke-width="2" viewBox="0 0 24 24" width="24"-->
<!--                                                     xmlns="http://www.w3.org/2000/svg">-->
<!--                                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>-->
<!--                                                </svg>-->
                                                Date
                                            </h6>
                                            <span class="text-secondary ">${formattedDate}</span>
                                        </li>
                                            <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 class="mb-0">
<!--                                                <svg class="feather feather-facebook me-2 icon-inline text-primary" fill="none" height="24"-->
<!--                                                     stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"-->
<!--                                                     stroke-width="2" viewBox="0 0 24 24" width="24"-->
<!--                                                     xmlns="http://www.w3.org/2000/svg">-->
<!--                                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>-->
<!--                                                </svg>-->
                                                Height
                                            </h6>
                                            <span id="span" class="text-secondary ">${height} CM</span>
                                        </li>
                                        
                                            <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                            <h6 class="mb-0">
<!--                                                <svg class="feather feather-facebook me-2 icon-inline text-primary" fill="none" height="24"-->
<!--                                                     stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"-->
<!--                                                     stroke-width="2" viewBox="0 0 24 24" width="24"-->
<!--                                                     xmlns="http://www.w3.org/2000/svg">-->
<!--                                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>-->
<!--                                                </svg>-->
                                                Weight
                                            </h6>
                                            <span class="text-secondary ">${weight} KG</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>`


    userProfileMain.append(userData);


}

let height;
let weight;

    userProfileMain.on("keyup", ".height", function(event) {
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

    userProfileMain.on("keyup", ".weight", function(event) {
        let heightText=$(".height");
        let weightTxt=$(".weight");
        let bmiTxt=$(".bmi");

        weight= weightTxt.val();

        if(heightText.val().length===0){
            bmiTxt.val(weight);

        }else{
            let height=heightText.val()/100;
            let bmi=weightTxt.val()/(height*height);
            bmiTxt.val(bmi);
        }


    });

userProfileMain.on("click", ".save", function(event) {


});


