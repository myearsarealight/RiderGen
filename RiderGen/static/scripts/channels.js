// Set url root for JSON

//$SCRIPT_ROOT = { { request.script_root | tojson | safe } };

// Submit the form through AJAX instead of submit so it doesn't reset the values after submit

$("#generate").click(function () {

    // Send the data using post, then add the rendered template to the page inside the table_holder div
    $.post("/channelsub", $("#the_form").serialize(), function (resp) {
        $("#table_holder").html(resp.data);
    });
});

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
        v = $(this).siblings("input:first").val();
        $(this).siblings("input:first").val(v + "_l");
    }
    else {
        $(this).removeClass("stereo")
        $(this).addClass("mono")
        $(this).text("mono")
        v = $(this).siblings("input:first").val();
        if (v.endsWith("_l")) {
            $(this).siblings("input:first").val(v.slice(0, -2));
        }
    }
});
