window.onload = function() {
    chrome.storage.local.get(['alm-threshold', 'alm-current-tab'], function(res) {
        if( typeof res !== 'undefined') {
            const display = document.getElementById("activeTabName")
            display.innerHTML = "Active meet: "+ res['alm-current-tab'] + ", threshold: " + res['alm-threshold']
            display.style.color = "green"
            display.textAlign = "centre"
        }
    })
}

function setAutoLeave() {
    let threshold = document.getElementById('threshold').value
    if (parseInt(threshold) > 0) {
        chrome.runtime.sendMessage({msg: 'set-auto-leave', threshold: threshold}, function (response) {
            if(!response) {
                console.log(chrome.runtime.lastError.message)
            } 

            if(response == "error") {
                const display = document.getElementById("activeTabName")
                display.innerHTML = "Please make sure you are in a Google Meet tab"
                display.style.color = "red"
                display.textAlign = "centre"
            }

            if(response != "error" && typeof response !== 'undefined') {
                const display = document.getElementById("activeTabName")
                display.innerHTML = "Active meet: "+ response.target + ", threshold: " + response.threshold
                display.style.color = "green"
                display.textAlign = "centre"

                chrome.storage.local.set({'alm-threshold': response.threshold}, function() {
                    console.log('setted')
                })
                chrome.storage.local.set({'alm-current-tab': response.target }, function() {
                    console.log('setted')
                })
            }
        })
    }
}


function minus() {
    let thresholdInput = document.getElementById('threshold')
    let currentThreshold = thresholdInput.value
    if (currentThreshold > 0) {
        thresholdInput.value = parseInt(currentThreshold) - 1
    }
    
    console.log(currentThreshold)
}

function plus() {
    let thresholdInput = document.getElementById('threshold')
    let currentThreshold = thresholdInput.value
    if (currentThreshold >= 0) {
        thresholdInput.value = parseInt(currentThreshold) + 1
    }
    
    console.log(currentThreshold)
}
function test() {
    alert("hi")
}

minusThreshold.addEventListener('click', minus)
plusThreshold.addEventListener('click', plus)
setBtn.addEventListener('click', setAutoLeave)
