var selectedId = null;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    selectedId = tabs[0].id;
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var text;

    if (message.fb_page) {
        chrome.pageAction.show(selectedId);
    }
    else if (message.post_name != "" || message.timestamp != "") {
        chrome.tabs.query(
            {active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {name: message.post_name, timestamp: message.timestamp},
                function(response) {
                // TODO: Parse 'response' and place in 'text'
            });
        });
        // TODO: Place text in 'sendResponse'
        sendResponse("Received name and timestamp of FB post!");
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    selectedId = activeInfo.tabId;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
});
