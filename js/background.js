'use strict'

const meetTabs = new Map()
const meetRegex = /https?:\/\/meet.google.com\/\w{3}-\w{4}-\w{3}/
const codeRegex = /\w{3}-\w{4}-\w{3}/
var res = ""
var currentTabId;

function processPopUpMessage(request, sender, sendResponse) {
    /*
        process sendMessage from popup.js and content.js
    */
    if (request.msg == 'set-auto-leave') {
        console.log("background.js received a click event message from popup.js for"+ request.msg)
        chrome.tabs.query({active: true, currentWindow: true}, function (tab) {
            if(meetRegex.test(tab[0].url)) {
                currentTabId = tab[0].id
                chrome.scripting.executeScript({
                    target: {tabId: tab[0].id},
                    files: ["./js/content.js"]
                });
                res = {target: tab[0].url, threshold: request.threshold}
            } else {
                res = "error"
            }
            sendResponse(res);
        })
        return true;
    }

    if ( request.msg == 'get-threshold') {
        chrome.storage.local.get(['alm-threshold'], function (res) {
            sendResponse(res['alm-threshold'])
        })

        return true;
    }

    return true;
}

function checkTabClosed(tabId, removed) {
    /*
    This method check if a tab is closed and whether it matches the tabId of the google meet tab
    */
    console.log(tabId)
    console.log(currentTabId)
    if (tabId == currentTabId) {
        console.log('tab id matches, storage will now be cleared')
        chrome.storage.local.clear(function() {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            }
        });
    } else {
        console.log("does not match")
    }
}
chrome.tabs.onRemoved.addListener(checkTabClosed)
chrome.runtime.onMessage.addListener(processPopUpMessage)




