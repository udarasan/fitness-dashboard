//search user with user email
let userEmail=localStorage.getItem("userEmail");
console.log(userEmail);
searchUserWithEmail();
var today = new Date();


var formattedDate = today.toLocaleDateString();


function searchUserWithEmail(){

    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data:{email:userEmail},

        success: function (response) {
            console.log(response);
            loadUserDetailsInFields(
                response.data.uid,
                response.data.name,
                response.data.email,
                response.data.trainer_id,
                response.data.meal_plan_id,
                response.data.workout_id,
                );

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })

}

let userProfileMain=$(".userProfileMain");

function loadUserDetailsInFields(uid, name, email,trainer_id,meal_plan_id,workout_id) {

   let userData= `<div class="row">
                        <div class="col-lg-4">
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
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-8">
                            <div class="card ">
                            <div class="card-header" style="background-color: #2d324a;color: white; ">Add New Progress Details</div>
                                <div class="card-body">
                                   
                                     <form id="assignMealForm">

                                    <div class="mb-3">

                                        <label class="form-label" for="height"> Height</label>
                                        <input  class="form-control height" id="height" 
                                               placeholder="Enter Height " type="text"
                                        >


                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label" for="weight"> Weight</label>
                                        <input  class="form-control weight" id="weight" 
                                               placeholder="Enter Weight" type="text"
                                        >
                                    </div>


                                    <div class="mb-3">
                                        <label class="form-label" for="bmi">BMI</label>
                                        <input disabled class="form-control" id="bmi" 
                                               placeholder="" type="text"
                                        >
                                    </div>

                                </form>
                                 <button id="save" class="btn btn-primary save">Save Progress</button>
                                   
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <h5 class="d-flex align-items-center mb-3">Project Status</h5>
                                            <p>Web Design</p>
                                            <div class="progress mb-3" style="height: 5px">
                                                <div aria-valuemax="100" aria-valuemin="0"
                                                     aria-valuenow="80" class="progress-bar bg-primary" role="progressbar"
                                                     style="width: 80%"></div>
                                            </div>
                                            <p>Website Markup</p>
                                            <div class="progress mb-3" style="height: 5px">
                                                <div aria-valuemax="100" aria-valuemin="0"
                                                     aria-valuenow="72" class="progress-bar bg-danger" role="progressbar"
                                                     style="width: 72%"></div>
                                            </div>
                                            <p>One Page</p>
                                            <div class="progress mb-3" style="height: 5px">
                                                <div aria-valuemax="100" aria-valuemin="0"
                                                     aria-valuenow="89" class="progress-bar bg-success" role="progressbar"
                                                     style="width: 89%"></div>
                                            </div>
                                            <p>Mobile Template</p>
                                            <div class="progress mb-3" style="height: 5px">
                                                <div aria-valuemax="100" aria-valuemin="0"
                                                     aria-valuenow="55" class="progress-bar bg-warning" role="progressbar"
                                                     style="width: 55%"></div>
                                            </div>
                                            <p>Backend API</p>
                                            <div class="progress" style="height: 5px">
                                                <div aria-valuemax="100" aria-valuemin="0" aria-valuenow="66"
                                                     class="progress-bar bg-info" role="progressbar" style="width: 66%"></div>
                                            </div>
                                        </div>
                                    </div>
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


