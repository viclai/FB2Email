window.onload = function() {
    $("#authorIn .error").hide();
    $("#timeIn .error").hide();

    document.getElementById("convertButton").onclick = function() {
        var name = document.getElementById("poster").value;
        var time = document.getElementById("timeofPost").value;
        // Format:
        // 2001-01-01T08:19
        // 2001-01-01T20:19

        chrome.runtime.sendMessage(
            {type: "convert", post_name: name, timestamp: time}, function(response) {
            if (response.isValid) {
                console.log("Got message back to display in extension.\n" +
                    "Response: " + response.time + " " + response.content);
                $("#resInstr").html(
                    "<span id=\"instrs\">Copy and paste the following into " +
                    "your e-mail!</span>");
                $("#res").html("On " + response.time + ", <b>" + name + 
                    "</b> wrote:<br /><br />" + response.content);
                $("#res").css("border-style", "solid");

                $("#res").css("color", "initial");
                $("#poster").css("border-color", "initial");
                $("#timeofPost").css("border-color", "initial");
            }
            else {
                $("#res").css("color", "initial");
                $("#poster").css("border-color", "initial");
                $("#timeofPost").css("border-color", "initial");

                if (response.content == "") {
                    $("#resInstr").html("<b>Post Not Found</b>");
                } else { // User did not enter at least one of the fields
                    $("#resInstr").html("<b>" + response.content + "</b>");

                    if ($("#poster").val() == "") {
                        $("#poster").css("border-color", "red");
                        $("#authorIn .error").show();
                    } else {
                        $("#poster").css("border-color", "initial");
                        $("#authorIn .error").hide();
                    }

                    if ($("#timeofPost").val() == "") {
                        $("#timeofPost").css("border-color", "red");
                        $("#timeIn .error").show();
                    } else {
                        $("#timeofPost").css("border-color", "initial");
                        $("#timeIn .error").hide();
                    }
                    $("#resInstr").css("color", "red");
                }
            }
        });
    }
}
