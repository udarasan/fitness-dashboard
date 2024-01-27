
$('#nameLbl').text(localStorage.getItem('adminEmail'));

$(window).on('load', function() {
    // Your JavaScript code goes here
    loadTrainerId();
});
var today = new Date();
var formattedDate = today.toLocaleDateString();
let clientList;
let trainerList;
function loadTrainerId() {

    $('#tra_id').empty();
    $.ajax({
        url: 'http://localhost:8080/api/v1/trainer/getAllTrainers',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',  // Set content type to JSON
        success: function (response) {
            trainerList = response.data
            $('#tra_id').append(`<option selected disabled>Select Trainer</option>`);
            $.each(response.data, function (index, trainer) {
                $('#tra_id').append(`<option>${trainer.tid}</option>`);

            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(jqXHR.responseText);  // Log the response text for debugging
        }
    });
}

function setClientDetails() {
    $('#tblMember').empty();
    let trainerId = $("#tra_id").val();
   console.log(trainerId)
    $.ajax({
        url:'http://localhost:8080/api/v1/trainer/getOneTrainer/'+trainerId,
        method:'GET',
        success:function (response){
            clientList = response.data;
            $('#printDetails').click(function () {


                var pdfObject = jsPDFInvoiceTemplate.default(getPdfProps(clientList));
                console.log(pdfObject);
            });
            console.log(response);
            if (response.data.length==0) {
                $('#memberTable').css("display","none");
                $('.npResImg').removeClass("d-none");

            }else {
                $('.npResImg').addClass("d-none");
                $('#memberTable').css("display","block");
                $.each(response.data, function (index, member) {

                    let row = `<tr><td>${member.uid}</td><td>${member.name}</td><td>${member.email}</td><td>${member.trainer_id}</td><td style="display: none">${member.password}</td><td>${member.meal_plan_id}</td><td>${member.workout_id}</td><td>${member.age}</td><td>${member.gender}</td></tr>`;
                    $('#tblMember').append(row);
                });
            }
            // memberList = response.data;
            // console.log(memberList);
            // setClientDetails()
        },
        error:function (xhr){
            console.log(xhr);
        }
    })
}

let currntTrainerName;
let currntTrainerEmail;
$('#tra_id').on('click', function () {
    let trainerId = $("#tra_id").val();
    setClientDetails();

    $.each(trainerList,function (index,trainer){
        if(trainerId == trainer.tid){
         currntTrainerName = trainer.name;
         currntTrainerEmail = trainer.email;
         console.log(currntTrainerName);
        }
    })

});

function getPdfProps(clientList) {
    return {
        outputType: jsPDFInvoiceTemplate.OutputType.save,
        returnJsPDFDocObject: true,
        fileName: "Fitness Clients Report",
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
            label: "Trainer :",
            name: currntTrainerName,
            phone: "(+355) 069 22 22 222",
            email: currntTrainerEmail,


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
                    title: "Name",
                    style: {
                        width: 30
                    },

                },
                {
                    title: "Email",
                    style: {
                        width: 50
                    }
                },
                {title: "WorkOut Id"},
                {title: "MealPlan Id"},
                {title: "Trainer Id"},
                {title: "Age"},
                {title: "Gender"},




            ],
            styles: {
                margin:500
            },
            table: clientList.map((clients, index) => [
                index + 1,
                clients.name,
                clients.email,
                clients.workout_id,
                clients.meal_plan_id,
                clients.trainer_id,
                clients.age,
                clients.gender,

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