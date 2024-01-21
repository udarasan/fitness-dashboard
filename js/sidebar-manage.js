$(".threebarsDiv").click(function(e) {
    $("#accordionSidebar").addClass("toggled");
});

$("#sidebarToggleTop").click(function(){
    // Remove the d-none class using JavaScript
    $("#accordionSidebar").removeClass("d-none");
    $("#accordionSidebar").removeClass("toggled");
    $("#accordionSidebar").css({
        display : "block !important"
    });
});