window.onload = function() {
    $("#authorIn .ast").hide();
    $("#timeIn .ast").hide();

    document.getElementById("convertButton").onclick = function() {
        var name = document.getElementById("poster").value;
        var time = document.getElementById("timeofPost").value;
        // Format:
        // 2001-01-01T08:19 
        // 2001-01-01T20:19

        chrome.runtime.sendMessage(
            {post_name: name, timestamp: time}, function(response) {
            if (response.isValid) {
                document.getElementById("result").innerHTML =
                    "<span id=\"instrs\">Copy and paste the following into " +
                    "your e-mail!</span><br /> <br />" +
                    "On " + response.time + ", <b>" + name + 
                    "</b> wrote:<br /><br />" + response.content;

                $("#result").css("color", "initial");
                $("#poster").css("border-color", "initial");
                $("#timeofPost").css("border-color", "initial");
                $("#authorIn .ast").hide();
                $("#timeIn .ast").hide();
            }
            else {
                $("#result").css("color", "initial");
                $("#poster").css("border-color", "initial");
                $("#timeofPost").css("border-color", "initial");

                if (response.content == "") {
                    document.getElementById("result").innerHTML =
                        "<b>Post Not Found</b>";
                } else { // User did not enter at least one of the fields
                    document.getElementById("result").innerHTML =
                        "<b>" + response.content + "</b>";
                    if ($("#poster").val() == "") {
                        $("#poster").css("border-color", "red");
                        $("#authorIn .ast").show();
                    } else {
                        $("#poster").css("border-color", "initial");
                        $("#authorIn .ast").hide();
                    }

                    if ($("#timeofPost").val() == "") {
                        $("#timeofPost").css("border-color", "red");
                        $("#timeIn .ast").show();
                    } else {
                        $("#timeofPost").css("border-color", "initial");
                        $("#timeIn .ast").hide();
                    }
                    $("#result").css("color", "red");
                }
            }
        });
    }
}
