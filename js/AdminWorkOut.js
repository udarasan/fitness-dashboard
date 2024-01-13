getAllWorkoutPlans();

$("#modalAddNew").click(function () {
    let name = $('#planName').val();
    let details = $('#planDetails').val();
    let calCount = $('#planCalorieCount').val();

    // Make the AJAX request
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/save',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify({"planName": name, "planDetails": details, "burnsCalorieCount": calCount}),  // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $(".gridContainer").empty();
            getAllWorkoutPlans();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

$("#searchWorkoutPlans").keyup(function () {
    let text = $('#searchWorkoutPlans').val();
    console.log(text);
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/plansByPartName',
        method: 'GET',
        dataType: 'json',
        // contentType: 'application/json',  // Set content type to JSON
        data: {partialName: text},   // Convert data to JSON string
        success: function (response) {
            console.log(response);
            $(".gridContainer").empty();
            $.each(response.data, function (index, workOut) {
                let card = `<div class="card workoutCard text-left p-0 ">
                            <div class="card-header px-4">                          
                                ${workOut.planName}
                                <div class="dropdown position-absolute threeDots">
                                     <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                     </a>
                                     <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" data-target="#updateWorkoutModal" 
                                        data-toggle="modal" href="#">Edit</a></li>
                                        <li><a class="dropdown-item" href="#">Delete</a></li>
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
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
});

let id;
function getAllWorkoutPlans() {
    // work out Get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/workoutplan/getAllWorkOutPlans',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            $.each(response.data, function (index, workOut) {
                let card = `<div class="card workoutCard text-left p-0 ">
                            <div class="card-header px-4">
                                ${workOut.planName}                            
                                <div class="dropdown position-absolute threeDots">
                                     <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                                     </a>
                                     <ul class="dropdown-menu">
                                        <li><a class="dropdown-item btnEdit" data-target="#updateWorkoutModal" 
                                        data-toggle="modal" href="#">Edit</a></li>
                                        <li><a class="dropdown-item" href="#">Delete</a></li>
                                     </ul>
                                </div>                    
                            </div>
                            <div class="card-body px-4">
                                <input class="hiddenWorkoutId" type="hidden" value="${workOut.wid}">
                                <p class="card-text pPlanDetails">${workOut.planDetails}</p>
                                <p class="card-text pCalorieCount">calorie count:&nbsp; ${workOut.burnsCalorieCount} calories</p>
                            </div>
                        </div>`

                $(".gridContainer").append(card);
            });

            $(".btnEdit").click(function(){
                let workoutCard = $(this).parents("div.workoutCard");

                id = workoutCard.children("div.card-body").children("input.hiddenWorkoutId").val();
                let details = workoutCard.children("div.card-body").children("p.pPlanDetails").text();
                let calorieCount;
                let name;

                let countText = workoutCard.children("div.card-body").children("p.pCalorieCount").text();
                var matches = countText.match(/\d+/);   //get only integer part
                if (matches && matches.length > 0) {
                    calorieCount = parseInt(matches[0]);
                } else {
                    console.log("Calorie count not found");
                }

                // get only text content
                name = workoutCard.children("div.card-header").contents().filter(function() {
                    return this.nodeType === 3; // Filter out non-text nodes
                }).text().trim();

                // set values to update model
                $("#updPlanName").val(name);
                $("#updPlanDetails").val(details);
                $("#updPlanCalorieCount").val(calorieCount);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}

$("#modalUpdateBtn").click(function () {

});


