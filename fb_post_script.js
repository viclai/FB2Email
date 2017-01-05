chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var name = message.name;

    var timestamp = message.timestamp;
    // Convert timestamp to Facebook format
    // e.g. 2016-03-26T08:00 -> Saturday, March 26, 2016 at 8:00am
    var d = new Date(timestamp);
    var day = dayInt2Text(d.getDay());
    var timeRegEx = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/g;
    var time = timeRegEx.exec(timestamp);
    var year = parseInt(time[1]);
    var month = monthInt2Text(parseInt(time[2]));
    var date = parseInt(time[3]);
    var hour = parseInt(time[4]);
    var minute = time[5];
    var meridian = (hour >= 12) ? "pm" : "am";
    hour = (hour > 12) ? (hour - 12) : hour;
    timestamp = day + ", " + month + " " + date + ", " + year + " at " +
        hour + ":" + minute + meridian;

    var res = {
        isValid: false,
        content: "",
        time: timestamp
    };

    var response = {
        poster: name,
        date: timestamp
    };
    var postData = fetchPost(response);
    res.isValid = postData.isValid;
    res.content = postData.content;
    sendResponse(res);
});

function fetchPost(oPost) {
    var i;
    var content, container;
    var divSelector =
        "div.userContentWrapper:has(\"span a:contains('" + oPost.poster +
        "')\")";
    var div = $(divSelector);
    var divContent = div.find("div.userContent");
    var dateSelector = "abbr[title='" + oPost.date + "']";
    var res = {
        isValid: false,
        content: ""
    };

    if (div.length == 0) {
        res.content = "Post not found: no such post author exists";
        console.log("Post not found: no such post author exists");
        return res;
    }
    
    if (div.length > 1) { // More than 1 post under the same name
        console.log(div.length + " posts from same author: " +
            "finding by date...");
        for (i = 0; i < div.length; i++) {
            var curDiv = div.get(i);
            if (curDiv.querySelectorAll(dateSelector).length == 1) {
                divContent = curDiv.querySelectorAll("div.userContent");
                break;
            }
        }
        if (i == div.length) {
            res.content = "Post not found: date does not match";
            console.log("Post not found: date does not match");
            return res;
        }
        for (i = 0; i < divContent.length; i++)
            res.content += divContent[i].textContent;
    } else {
        // Use selector on timestamp to ensure post is right
        if (div.find(dateSelector).length != 1) {
            res.content = "Post not found: date does not match";
            console.log("Post not found: date does not match");
            return res;
        }
        res.content = divContent.text();
    }

    console.log("Post found!");
    res.isValid = true;
    console.log("Content:\n" + res.content);
    return res;
}

function monthInt2Text(index) {
    switch (index) {
        case 1: return "January";
        case 2: return "February";
        case 3: return "March";
        case 4: return "April";
        case 5: return "May";
        case 6: return "June";
        case 7: return "July";
        case 8: return "August";
        case 9: return "September";
        case 10: return "October";
        case 11: return "November";
        case 12: return "December";
        default: return "";
    }
}

function dayInt2Text(index) {
    switch (index) {
        case 0: return "Sunday";
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
        default: return "";
    }
}

// TODO: Modify Facebook pages to have interactive popup or button to allow 
//       users to instantly convert Facebook posts to readable format in 
//       e-mail.
