$(".threebarsDiv").click(function (e) {
    $("#accordionSidebar").addClass("toggled");
});

$("#sidebarToggleTop").click(function () {

    $("#accordionSidebar").removeClass("d-none");
    $("#accordionSidebar").removeClass("toggled");
    $("#accordionSidebar").css({
        display: "block !important"
    });
});
