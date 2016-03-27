window.onload = function() {
    document.getElementById("convertButton").onclick = function() {
        var name = document.getElementById("poster").value;
        var time = document.getElementById("timeofPost").value;
        console.log("Name: " + name + "\nTime: " + time);
        // 2001-01-01T08:19 2001-01-01T20:19

        chrome.runtime.sendMessage(
            {post_name: name, timestamp: time}, function(response) {
            console.log("Sent info to background!");
            console.log("Response: " + response);
        });
    }
}
