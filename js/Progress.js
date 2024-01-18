$('#nameLbl').text(localStorage.getItem("name"));
var today = new Date();
var formattedDate = today.toLocaleDateString();
let userEmail=localStorage.getItem("userEmail");
let uId;
let height;
let weight;
let date
let cname;
searchUserWithEmail();


function searchUserWithEmail(){

    $.ajax({
        url: 'http://localhost:8080/api/v1/user/getOneUser',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        data:{email:userEmail},

        success: function (response) {
            console.log(response);
          uId= response.data.uid;
          cname = response.data.name;
          console.log(uId);
            getAllProgress(uId);

        },
        error: function (jqXHR) {
            console.log(jqXHR.responseText);
        }
    })

}

function getAllProgress(uId) {
    $('#tblProgress').empty();
    // members get All
    $.ajax({
        url: 'http://localhost:8080/api/v1/progress/getAllProgress/'+uId,
        method: 'GET',

        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            const progressData = response.data;
               height = response.data.height;
               weight = response.data.weight;
               date =  response.data.date;

               $.each(response.data, function (index, progress) {
                let row = `<tr><td style="display: none">${progress.pid}</td><td>${progress.height}</td><td>${progress.weight}</td><td>${progress.date}</td></tr>`;
                $('#tblProgress').append(row);
            });


               //get report
            $('#pdf').click(function () {
                generatePdf(progressData);
            });


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}



$('#deleteProgress').click(function () {

    let id = $('#pId').val();

            // Make the AJAX request
            $.ajax({
                url: 'http://localhost:8080/api/v1/progress/delete/' + id,
                method: 'DELETE',
                contentType: 'application/json',  // Set content type to JSON
                success: function (response) {
                    alert("Progress Details Delete successful!");
                    searchUserWithEmail();
                    $('#pId').val("");
                    $('#height').val("");
                    $('#weight').val("");
                    $('#date').val("");

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Progress Details Delete failed! Please check your input and try again.");
                    console.error(jqXHR.responseText);  // Log the response text for debugging
                }
            });




});



$('#updateProgress').click(function () {

    let pid = $('#pId').val();
    let height = $('#height').val();
    let weight = $('#weight').val();
    let date = $('#date').val();
    console.log(uId);
    if ( !height || !weight || !date) {
        alert("Please fill in all required fields.");
        return;
    }

    if(isNaN(height)){
        $('#heightErrorLabel').text("Invalid input type!! Please input number");
    }else {
        $('#heightErrorLabel').text("");
    }

    if(isNaN(weight)){
        $('#weightErrorLabel').text("Invalid input type!! Please input number");
    }else {
        $('#weightErrorLabel').text("");
    }

    if (!isNaN(height) && !isNaN(weight)) {
        $.ajax({
            url: 'http://localhost:8080/api/v1/progress/update',
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',  // Set content type to JSON

            data: JSON.stringify({"pid": pid, "height": height, "weight": weight, "userId": uId, "date": date}),  // Convert data to JSON string
            success: function (response) {
                alert("Progress Details Update successful!");
                searchUserWithEmail();
               $('#pId').val("");
               $('#height').val("");
               $('#weight').val("");
                $('#date').val("");

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Progress Details Update failed! Please check your input and try again.");
                console.error(jqXHR.responseText);  // Log the response text for debugging
            }

        });
    }

});


$('#addProgress').click(function () {

    let height = $('#height').val();
    let weight = $('#weight').val();
    let date = $('#date').val();
          console.log(uId);
    if ( !height || !weight || !date) {
        alert("Please fill in all required fields.");
        return;
    }

    if(isNaN(height)){
        $('#heightErrorLabel').text("Invalid input type!! Please input number");
    }else {
        $('#heightErrorLabel').text("");
    }

    if(isNaN(weight)){
        $('#weightErrorLabel').text("Invalid input type!! Please input number");
    }else {
        $('#weightErrorLabel').text("");
    }
   if (!isNaN(height) && !isNaN(weight)) {
       $.ajax({
           url: 'http://localhost:8080/api/v1/progress/save',
           method: 'POST',
           dataType: 'json',
           contentType: 'application/json',  // Set content type to JSON

           data: JSON.stringify({"height": height, "weight": weight, "userId": uId, "date": date}),  // Convert data to JSON string
           success: function (response) {
               console.log(response);
               alert("Progress Details Added successful!");
              searchUserWithEmail();
               $('#pId').val("");
               $('#height').val("");
               $('#weight').val("");
               $('#date').val("");


           },
           error: function (jqXHR, textStatus, errorThrown) {
               alert("Progress Details Added failed! Please check your input and try again.");
               console.error(jqXHR.responseText);  // Log the response text for debugging
           }

       });
   }

});


$('#tblProgress').on('click', 'tr', function () {

    // Access the data in the clicked row
    let pid = $(this).find('td:first').text(); // Assuming the first cell contains the trainer ID
    let height = $(this).find('td:nth-child(2)').text(); // Assuming the second cell contains the trainer email
    let weight = $(this).find('td:nth-child(3)').text();
    let date = $(this).find('td:nth-child(4)').text();

    // Perform actions with the retrieved data

    $('#pId').val(pid);
    $('#height').val(height);
    $('#weight').val(weight);
    $('#date').val(date);


});


function generatePdf(progressData) {




    var pdfObject = jsPDFInvoiceTemplate.default(getPdfProps(progressData));
    console.log(pdfObject);


}
//returns number of pages created

function getPdfProps(progressData) {
    return {
        outputType: jsPDFInvoiceTemplate.OutputType.save,
        returnJsPDFDocObject: true,
        fileName: "Fitness Progress Report",
        orientationLandscape: false,
        compress: true,
        logo: {
            src: "https://img.icons8.com/external-nawicon-glyph-nawicon/64/00000/external-gym-hotel-nawicon-glyph-nawicon.png",
            type: 'PNG', //optional, when src= data:uri (nodejs case)
            width: 25, //aspect ratio = width/height
            height: 25,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        business: {
            name: "FITNESS",
            address: "Albania, Tirane ish-Dogana, Durres 2001",
            phone: "(+355) 069 11 11 111",
            email: "email@fitness.com",
            email_1: "info@fitness.al",
            website: "www.fitness.al",
        },
        contact: {
            label: "Report issued for:",
            name: cname,
            phone: "(+355) 069 22 22 222",
            email: userEmail,


        },

        invoice: {
            label: "Report #: ",

            invGenDate: "Report Date: "+formattedDate,

            headerBorder: true,
            tableBodyBorder: true,
            header: [
                {
                    title: "#",
                    style: {
                        width: 10
                    },

                },
                {
                    title: "Height",
                    style: {
                        width: 30
                    },

                },
                {
                    title: "Weight",
                    style: {
                        width: 80
                    }
                },
                {title: "Date",


                },



            ],
            styles: {
               margin:500
            },
            table: progressData.map((progress, index) => [
                index + 1,
                progress.height,
                progress.weight,
                progress.date
            ]),
            margin: {
                top: 600, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }

        },
        footer: {
            text: "FITNESS GYM Center",
        },
        pageEnable: true,
        pageLabel: "Page ",
    }
}
