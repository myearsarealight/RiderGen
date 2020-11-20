// Press buttons to toggle selection and pass a value to the application when form is submitted

$("button").click(function () {
    $(this).toggleClass("selected");
});

// Toggle show/hide options when button is pressed
$(".options").click(function () {
        $(this).next("div").toggle();
});