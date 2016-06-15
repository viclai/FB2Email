window.onload = function() {
    document.getElementById("convertButton").onclick = function() {
        var name = document.getElementById("poster").value;
        var time = document.getElementById("timeofPost").value;
        // Format:
        // 2001-01-01T08:19 
        // 2001-01-01T20:19

        chrome.runtime.sendMessage(
            {post_name: name, timestamp: time}, function(response) {
            if (response.isValid) {
                document.getElementById("result").innerHTML = response.content;
            }
            else {
                document.getElementById("result").innerHTML =
                    "<b>Not found</b>";
            }
        });
    }
}
