
var inputToken = document.getElementById("token");

chrome.storage.sync.get(['token'], function(item) {
    inputToken.value = item.token;
});

inputToken.addEventListener("change", function(e) {
    chrome.storage.sync.set({token: this.value});
}, false);