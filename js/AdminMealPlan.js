// meal plan Get All
$.ajax({
    url: 'http://localhost:8080/api/v1/mealPlan/getAllMealPlans',
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',  // Set content type to JSON
    success: function(response) {
        console.log(response.data);
        console.log(response.data.email);

        $.each(response.data, function(index, mealPlan) {
            appendMealSection(mealPlan);
            console.log(mealPlan);

        });

    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.error(jqXHR.responseText);  // Log the response text for debugging
    }
});


// add new card to meal section using get all data
function appendMealSection(mealPlan) {
    const cardContainer = document.getElementById("cardContainer");

    // Create the section
    const section = document.createElement("section");
    section.className = "mx-3 my-4";
    section.style.maxWidth = "20rem";

    // Create the card
    const card = document.createElement("div");
    card.className = "card";

    // Create the background image
    const bgImage = document.createElement("div");
    bgImage.className = "bg-image hover-overlay ripple";
    bgImage.setAttribute("data-mdb-ripple-color", "light");

    // Create the image
    const img = document.createElement("img");
    img.className = "img-fluid";
    img.src = "https://mdbootstrap.com/img/Photos/Horizontal/Food/8-col/img (5).jpg"
    // Assuming imageUrl is a property in your meal plan object

    // Create the mask
    const mask = document.createElement("div");
    mask.className = "mask";
    mask.style.backgroundColor = "rgba(251, 251, 251, 0.15)";

    // Append the image and mask to the background image
    bgImage.appendChild(img);
    bgImage.appendChild(mask);

    // Create the card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Create the title
    const title = document.createElement("h5");
    title.className = "card-title font-weight-bold";
    title.innerHTML = `<a>${mealPlan.planName}</a>`;

    // Create the description
    const description = document.createElement("p");
    description.className = "card-text planDetailText";
    description.textContent = mealPlan.planDetails;

    // Create the HR
    const hr = document.createElement("hr");
    hr.className = "my-4";

    // Create the calorie count
    const calorieCount = document.createElement("p");
    calorieCount.className = "lead";
    calorieCount.innerHTML = `<strong>Total calorie count : <span style="color: black; font-size: 13px">${mealPlan.calorieCount}</span></strong>`;

    // Append all elements to the card body
    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(hr);
    cardBody.appendChild(calorieCount);

    // Append the background image and card body to the card
    card.appendChild(bgImage);
    card.appendChild(cardBody);

    // Append the card to the section
    section.appendChild(card);

    // Append the section to the card container
    cardContainer.appendChild(section);
}