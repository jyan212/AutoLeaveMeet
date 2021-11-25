var lastNumParticipants;
var threshold; 

chrome.runtime.sendMessage({msg: "get-threshold"}, function(response) {
    /*
      method to get threshold from background page
    */
    console.log(response)
    threshold = response
});

if (document.getElementsByClassName('uGOf1d').length <= 0) {
    /*
        user have not enter the room.
    */
    alert("Please make sure you have already joined the room!")
} else {
    lastNumParticipants = document.getElementsByClassName('uGOf1d')[0].innerHTML;
    if (typeof init === 'undefined') {
        const init = function() {
            if ( document.getElementsByClassName('injected-auto-leave-bar').length == 0 ) {
                const injectElement = document.createElement('h1');
                injectElement.className = "injected-auto-leave-bar";
                injectElement.style.color = "green";
                injectElement.style.zIndex = 999999;
                injectElement.style.position = 'absolute';
                injectElement.style.top = '0px';
                injectElement.innerHTML = "AutoLeaveMeeting is currently running";
                injectElement.style.display = 'inline';
                document.body.prepend(injectElement)
            }
        }
        init()
    }
    if (typeof update === 'undefined'){
        const update = setInterval(function() {
            let numParticipants = parseInt(document.getElementsByClassName('uGOf1d')[0].innerHTML);
            console.log('threshold:'+ threshold)
            console.log('current: '+numParticipants+ ', last:'+ lastNumParticipants)

            if (numParticipants >= lastNumParticipants) {
                lastNumParticipants = numParticipants
            } else {
                let delta = lastNumParticipants - numParticipants;
                if (delta >= threshold) {
                    console.log("threshold met.. user will now leave the google meet")
                    /*
                        assume user is not a host
                    */
                    document.querySelector('i.google-material-icons.VfPpkd-kBDsod.r8Sq3').click()
                    console.log("user left the call")
                    clearInterval(update)
                } 
            }
        }, 12000)
    } else {
        console.log("another call already exist")
    }
}

