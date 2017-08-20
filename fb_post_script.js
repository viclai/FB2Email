/********************************************************************
 * Startup code
 ********************************************************************/
createModal();
$("#fb2email_blackout").hide();
$("#fb2email_result_box").hide();

setInterval(function() {
    addConvertButtons();
}, 2000);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var res;
    var response;
    var postData;

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

    res = {
        isValid: false,
        content: "",
        time: timestamp
    };

    response = {
        poster: name,
        date: timestamp
    };
    postData = fetchPost(response);
    res.isValid = postData.isValid;
    res.content = postData.content;
    sendResponse(res);
});

/********************************************************************
 * Modal Functions
 ********************************************************************/
function createModal() {
    var blackout = document.createElement("div");
    var result_box = document.createElement("div");
    var instr = document.createElement("div");
    var br = document.createElement("br");
    var res = document.createElement("div");
    var copy = document.createElement("div");
    var copyButtonWrapper = document.createElement("div");
    var copyButton = document.createElement("button");
    var copiedMsg = document.createElement("div");

    blackout.id = "fb2email_blackout";
    blackout.style.position = "fixed";
    blackout.style.zIndex = 9990;
    document.body.appendChild(blackout);
    $("#fb2email_blackout").css("background", "#000");
    $("#fb2email_blackout").css("width", "104%");
    $("#fb2email_blackout").css("height", "107%");
    $("#fb2email_blackout").css("opacity", ".3");
    $("#fb2email_blackout").css("top", "-14px");
    $("#fb2email_blackout").css("left", "-29px");
    
    result_box.id = "fb2email_result_box";
    result_box.style.position = "fixed";
    result_box.style.zIndex = 9999;

    instr.id = "fb2email_instr";
    instr.innerHTML = "<b>Copy and paste the following into your e-mail!</b>";
    instr.style.margin = "0 0 5px 0";
    result_box.appendChild(instr);

    copy.style.overflow = "hidden";
    copy.style.width = "100%";
    copy.style.margin = "0 0 5px 0";

    copyButtonWrapper.style.cssFloat = "left";
    copyButtonWrapper.style.width = "25%";

    copyButton.innerHTML = "Copy to Clipboard";
    copyButton.onclick = function () {
        selectText("#fb2email_res");
        document.execCommand('copy');
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        document.getElementById("fb2email_copied").style.visibility = "visible";
        document.getElementById("fb2email_copied").style.display = "initial";
    };
    copyButtonWrapper.appendChild(copyButton);
    copy.appendChild(copyButtonWrapper);

    copiedMsg.style.visibility = "hidden";
    copiedMsg.id = "fb2email_copied";
    copiedMsg.innerHTML = "<b>Copied successfully!</b>";
    copy.appendChild(copiedMsg);

    result_box.appendChild(copy);

    result_box.appendChild(br);

    res.id = "fb2email_res"; // This is where the content will be located
    result_box.appendChild(res);

    document.body.appendChild(result_box);

    $("#fb2email_result_box").css("width", "600px");
    $("#fb2email_result_box").css("height", "180px");
    $("#fb2email_result_box").css("background", "#E0F3FF");
    $("#fb2email_res").css("background", "white");
    $("#fb2email_result_box").css("left", "50%");
    $("#fb2email_result_box").css("top", "50%");
    $("#fb2email_result_box").css("border-radius", "5px");
    $("#fb2email_result_box").css("padding", "20px 20px");
    $("#fb2email_result_box").css("margin-left", "-320px"); /* width/2 + padding-left */
    $("#fb2email_result_box").css("margin-top", "-150px"); /* height/2 + padding-top */
    $("#fb2email_result_box").css("box-shadow", "0 0 10px 0 #000");
    $("#fb2email_result_box").css("overflow-y", "auto");
}

function showModal() {
    $("#fb2email_blackout").show();
    $("#fb2email_result_box").show();
    $("#fb2email_copied").hide();

    $("#fb2email_blackout").click(function() {
        hideModal();
    });

    $(document).keyup(function(e) {
         if (e.keyCode == 27) { // ESC
            hideModal();
        }
    });
}

function hideModal() {
    $("#fb2email_blackout").fadeOut();
    $("#fb2email_result_box").fadeOut();
    $("#fb2email_res").html("");
}

/********************************************************************
 * Main Parsing Functions
 ********************************************************************/
function addConvertButtons() {
    var divs = $("div.fbUserPost");
    var i;
    var next;
    var content;
    var contentWrapper;
    var author;
    var timestamp;
    var but;
    var button;
    var email_msg;

    divs.each(function(i, div) {
        next = div.querySelector("span.timestampContent");
        if (next != null) {
            but = next.closest("div");
            if (but != null && but.lastChild != null &&
                but.lastChild.nodeName == "BUTTON") {
                return;
            }

            contentWrapper = next.closest("div.fbUserPost");
            if (contentWrapper != null) {
                content = contentWrapper.querySelector("div.userContent");
                if (content != null) {
                    content = content.innerHTML;
                } else {
                    content = "";
                }
            } else {
                content = "";
            }

            if (contentWrapper != null) {
                author = contentWrapper.querySelector("span a");
                if (author != null) {
                    author = author.innerHTML;
                } else {
                    author = "";
                }
            } else {
                author = "";
            }

            timestamp = next.closest("abbr");
            if (timestamp != null) {
                timestamp = timestamp.getAttribute("title");
            } else {
                timestamp = "";
            }

            button = document.createElement("button");
            button.innerHTML = "E-mail";
            button.className = "post2EmailButton";
            button.setAttribute("fb2_email_timestamp", timestamp);
            button.setAttribute("fb2_email_author", author);
            button.setAttribute("fb2_email_content", content);
            button.onclick = function () {
                showModal();
                email_msg = "On " + this.getAttribute("fb2_email_timestamp") +
                     ", " + this.getAttribute("fb2_email_author") + 
                     " wrote:<br />" + this.getAttribute("fb2_email_content");
                $("#fb2email_res").html(email_msg);
                email_msg = encodeURIComponent(html2PlainText(email_msg));
                //window.open('mailto:?body=' + email_msg);
            };
            but.appendChild(button);
        }
    });
}

function fetchPost(oPost) {
    var i;
    var content, container;
    var divSelector =
        "div.fbUserPost:has(\"span a:contains('" + oPost.poster +
        "')\")";
    var div = $(divSelector);
    var divContent = div.find("div.userContent");
    var dateSelector = "abbr[title='" + oPost.date + "']";
    var res = {
        isValid: false,
        content: ""
    };
    var curDiv;

    if (div.length == 0) {
        res.content = "Post not found: no such post author exists";
        console.log("Post not found: no such post author exists");
        return res;
    }
    
    if (div.length > 1) { // More than 1 post under the same name
        console.log(div.length + " posts from same author: " +
            "finding by date...");
        for (i = 0; i < div.length; i++) {
            curDiv = div.get(i);
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

/********************************************************************
 * Utility Functions
 ********************************************************************/
 function selectText(sElement) {
    var range;
    var selection;
    var element = $(sElement).get(0);

    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function html2PlainText(sHtmlMsg) {
    var plaintext = sHtmlMsg;

    plaintext = plaintext.replace(/<\/.*>/g, '');      // Remove all end tags
    plaintext = plaintext.replace(/<br \/>|<br>|<p>/g, '\r\n');

    return plaintext;
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
