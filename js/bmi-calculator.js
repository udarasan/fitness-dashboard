$('#nameLbl').text(localStorage.getItem("name"));
let height;
let weight;
let userProfileMain=$(".userProfileMain");

userProfileMain.on("keyup", ".height", function(event) {
    console.log("hi")
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