// Set url root for JSON

//$SCRIPT_ROOT = { { request.script_root | tojson | safe } };

// Defined functions:

// Toggle between mono and stereo button
function toggleStereo(event) {
    let elem = $(this);
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
}

// Print the channel list without the rest of the page. Adapted from codexworld.com and Stack Overflow
function printArea(event) {
    // Get the content
    let printContent = $("#to_print").html();
    // Open a new window
    let WinPrint = window.open('', '', 'width=900,height=650');
    // Add the CSS sources
    WinPrint.document.write('<html> <head>');
    WinPrint.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">');
    WinPrint.document.write('<link href="/static/content/styles.css" rel="stylesheet" type ="text/css" media="all"> </head>');
    // Add the content, in its own div because .html() only takes the content of the div
    WinPrint.document.write('<body> <div id=table_holder>' + printContent + '</div> </body> </html>');
    // Finish writing the document
    WinPrint.document.close();
    WinPrint.focus();
    // Open print window, after a second delay to give the CSS time to be loaded
    setTimeout(function () { WinPrint.print(); WinPrint.close(); }, 1000);
}

// Export table data to a .csv file, stolen from codexworld.com
// Stuff to create and save the file after the csv is made
function downloadCSV(csv, filename) {

    // CSV file
    let csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    let downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

// Turn table data into .csv format, then send it to save function
function exportTableToCSV(event) {
    var csv = [];
    var table = $(event.data.areaID);
    var rows = table.find("tr");

    for (let i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (let j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }

    // Make a sensible filename from user input of act name
    var filename = $(event.data.filename).html();
    if (filename == "") {
        filename = "Channel_list.csv"
    }
    else {
        // Replace spaces with underscores
        filename = filename.replace(/ /g, "_") + ".csv";
    }
    
    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

// Bound functions:

// Submit the form through AJAX instead of submit so it doesn't reset the values after submit
$("#generate").click(function () {

    // Send the data using post, then add the rendered template to the page inside the table_holder div
    $.post("/channelsub", $("#the_form").serialize(), function (resp) {
        $("#table_holder").html(resp.data);
    });

    // Enable add, export and print buttons
    $("#add").prop("disabled", false);
    $("#csv").prop("disabled", false);
    $("#print").prop("disabled", false);
});

// Allow options to be rearranged through dragging and dropping
$(function () {
    $(".sortable").sortable();
    $("sortable").disableSelection();
});

// Automatically renumber channels when they've been rearranged in the table. Adapted from the jquery forum https://forum.jquery.com/topic/how-to-update-ranking-on-jquery-ui-sortable-table-rows
$(document).ajaxComplete(function () {
    // Make the table sortable once it's loaded
    $("sortable").disableSelection();
    $("tbody").sortable({
        // Reset the channel numbers to be in order once rearranging is over
        stop: function (event, ui) {
            $(this).find("tr").each(function (i) {
                $(this).find("input[name*='ch']").attr({ "name": "ch" + (i + 1), "value": (i + 1) });
                // Need to update all the td names as well for the form submission
                $(this).find("input[name*='inst']").attr("name", "inst" + (i + 1));
                $(this).find("input[name*='mic']").attr("name", "mic" + (i + 1));
                $(this).find("input[name*='stand']").attr("name", "stand" + (i + 1));
                $(this).find("input[name*='pos']").attr("name", "pos" + (i + 1));
                $(this).find("input[name*='phnt']").attr("name", "phnt" + (i + 1));
            });
        }
    });
});


// Press buttons to toggle each section as selected and disable section's options if it isn't selected
$("#the_form").on("click", ".section", function () {
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
$("#the_form").on("click", ".options", function () {
    $(this).toggleClass("selected");
    $(this).next("fieldset").toggle();
});

// Implement stereo toggle for keys and playback
$("#the_form").on("click", ".st", {stereo: "stereo", mono: "mono" }, toggleStereo);

// Toggle stereo for guitars
$("#the_form").on("click", ".stgtr", {stereo: "double mic", mono: "single mic" }, toggleStereo);

// Make sure right channel of stereo pairs are disabled if the left/first channel isn't selected
$("#the_form").on("click", ".stl", function () {
    let elem = $(this);
    if (elem.prev("input").prop("checked")) {
        elem.next("input").prop("disabled", true);
    }
    else {
        elem.next("input").prop("disabled", false);
    }
    elem.nextAll("label").toggleClass("disabled");
});

// Print button for channel list
$("#print").on("click", { areaID: "#to_print" }, function () {
    // Send the data using post, then add the rendered template to the page inside the to_print hidden div
    $.post("/channelprint", $("#channel_list").serialize(), function (resp) {
        $("#to_print").html(resp.data);
    });
    // Wait for ajax to complete, then print
    $(document).ajaxSuccess(function (event, xhr, settings) {
        if ($("#to_print").html() != '') {
            printArea;
        }
    });
});

// Export to .csv button for channel list
$("#csv").on("click", { areaID: "#channel_table", filename: "#actname" }, function () {
    exportTableToCSV;
});