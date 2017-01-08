chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var res;

    if (message.type == "convert") {
        res = {
            isValid: false,
            content: "*REQUIRED",
            time: ""
        };

        if (message.post_name != "" && message.timestamp != "") {
            chrome.tabs.query(
                {active: true, currentWindow: true},
                function(tabs) {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {name: message.post_name, timestamp: message.timestamp},
                        function(response) {
                            if (chrome.runtime.lastError) {
                                console.log("ERROR: " + 
                                    chrome.runtime.lastError.message);
                            } else {
                                res.isValid = response.isValid;
                                res.content = response.content;
                                res.time = response.time;
                                sendResponse(res);
                            }
                        }
                    );
                }
            );
        } else {
            sendResponse(res);
        }
    }
	
    return true;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url.indexOf('https://www.facebook.com') == 0) {
    	chrome.pageAction.show(tabId);
    }
});
