// Allow options to be rearranged through dragging and dropping

$(function () {
    $(".sortable").sortable();
    $("sortable").disableSelection();
});

// Press buttons to toggle each section as selected and disable section's options if it isn't selected

$(".section").click(function () {
    $(this).toggleClass("selected");
    if ($(this).hasClass("selected")) {
        $(this).siblings("fieldset").prop("disabled", false);
        $(this).siblings("fieldset").children(".overlay").hide();
    }
    else {
        $(this).siblings("fieldset").prop("disabled", true);
        $(this).siblings("fieldset").children(".overlay").show();
    }
});


// Toggle show/hide options when button is pressed
$(".options").click(function () {
    $(this).toggleClass("selected");
    $(this).next("fieldset").toggle();
});

// Toggle between mono and stereo button

$(".st").click(function () {
    if ($(this).hasClass("mono")) {
        $(this).removeClass("mono")
        $(this).addClass("stereo")
        $(this).text("stereo")
    }
    else {
        $(this).removeClass("stereo")
        $(this).addClass("mono")
        $(this).text("mono")
    }
});
