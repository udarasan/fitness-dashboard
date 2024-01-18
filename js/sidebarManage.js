$(".threebarsDiv").click(function(e) {
    $("#accordionSidebar").addClass("toggled");
    $("#content-wrapper").css({
        filter : "brightness(1)"
    })
});

$("#sidebarToggleTop").click(function(){
    // Remove the d-none class using JavaScript
    $("#accordionSidebar").removeClass("d-none");
    $("#accordionSidebar").removeClass("toggled");
    $("#accordionSidebar").css({
        display : "block !important"
    });

    $("#content-wrapper").css({
        filter: "grayscale(70%) brightness(0.8)"
    });
});