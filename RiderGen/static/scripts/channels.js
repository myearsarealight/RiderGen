// Press buttons to toggle selection and pass a value to the application when form is submitted

$("button").click(function () {
    $(this).toggleClass("selected");
    if ($(this).hasClass("selected")) {
        $(this).val(1);
    }
    else {
        $(this).val(0);
    };
});

// Toggle show/hide options when button is pressed
$("options").click(function () {
        $(this.next()).toggle();
});


// Next time add checkbox hack, it's the only way!