var inputToken = document.getElementById("token");
var saveToken = document.getElementById("save-token");


inputToken.addEventListener("keyup", function(e) {
    saveToken.disabled = false;
    saveToken.addEventListener("click", function(e) {
        chrome.storage.sync.set({token: inputToken.value});
        saveToken.disabled = true;    
    }, false);

}, false);

chrome.storage.sync.get(['token'], function(item) {
    if (item.token) {
        inputToken.value = item.token;
    }
});
