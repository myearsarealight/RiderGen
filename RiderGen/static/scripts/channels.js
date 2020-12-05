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
$("form").on("click", ".section", function () {
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
$("form").on("click", ".options", function () {
    $(this).toggleClass("selected");
    $(this).next("fieldset").toggle();
});

// Toggle between mono and stereo button
function toggleStereo(event) {
    var elem = $(this);
    if (elem.hasClass("mono")) {
        elem.removeClass("mono").addClass("stereo").text(event.data.stereo);
        v = elem.siblings("input:first").val();
        elem.siblings("input:first").val(v + "_l");
    }
    else {
        elem.removeClass("stereo").addClass("mono").text(event.data.mono);
        v = elem.siblings("input:first").val();
        if (v.endsWith("_l")) {
            elem.siblings("input:first").val(v.slice(0, -2));
        }
    }
};

// Implement stereo toggle for keys and playback
$("form").on("click", ".st", {stereo: "stereo", mono: "mono" }, toggleStereo);

// Toggle stereo for guitars
$("form").on("click", ".stgtr", { stereo: "double mic", mono: "single mic" }, toggleStereo);

// Make sure right channel of stereo pairs are disabled if the left/first channel isn't selected
$("form").on("click", ".stl", function () {
    var elem = $(this);
    if (elem.prev("input").prop("checked")) {
        elem.next("input").prop("disabled", true);
    }
    else {
        elem.next("input").prop("disabled", false);
    }
    elem.nextAll("label").toggleClass("disabled");
});