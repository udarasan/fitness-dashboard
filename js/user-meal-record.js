window.onload = function() {
    setDateInModal();
};

function setDateInModal(){
    dateField = $("#date");

    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10);
    dateField.val(formattedDate);
}