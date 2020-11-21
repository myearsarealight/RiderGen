// Press buttons to toggle each section as selected and disable section's options if it isn't selected

$(".section").click(function () {
    $(this).toggleClass("selected");
    if ($(this).hasClass("selected")) {
        $(this).siblings("fieldset").prop("disabled", false);
    }
    else {
        $(this).siblings("fieldset").prop("disabled", true);
    }
});


// Toggle show/hide options when button is pressed
$(".options").click(function () {
    $(this).toggleClass("selected");
    $(this).next("fieldset").toggle();
});