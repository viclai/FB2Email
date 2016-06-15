var selectedId = null;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    selectedId = tabs[0].id;
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.log("runtime.onMessage triggered");
	var res;

    if (message.fb_page) {
        chrome.pageAction.show(selectedId);
        return;
    } else if (message.post_name != "" || message.timestamp != "") {
        chrome.tabs.query(
            {active: true, currentWindow: true},
            function(tabs) {
            	console.log("Number of valid tabs: " + tabs.length);
            	chrome.tabs.sendMessage(
                	tabs[0].id,
                	{name: message.post_name, timestamp: message.timestamp},
                	function(response) {
                		if (chrome.runtime.lastError) {
							console.log("ERROR: " + 
								chrome.runtime.lastError.message);
                		} else {
                			sendResponse(response);
                		}
                	}
            	);
            }
        );
    }
    return true;
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    selectedId = activeInfo.tabId;
    console.log("New tab ID: " + selectedId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    
});
