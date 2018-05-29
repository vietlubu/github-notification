// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

chrome.notifications.onClicked.addListener(function() {
    window.open('https://github.com/notifications', '_blank').focus();
});

var notiIds = [];
var newNotiIds = [];
var token;

function getNotifications (callback) {
    var date = new Date();
    var time = date.getTime();

    var xhttp = new XMLHttpRequest();

    chrome.storage.sync.get(['token'], function(item) {
        xhttp.open("GET", "https://api.github.com/notifications?rnd=" + time, true);
        xhttp.setRequestHeader("Authorization", "token " + item.token);
        xhttp.send();
    });

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this);
        }
    };
}

function displayNotifications (notifications) {
    chrome.browserAction.setBadgeText({text: ''});
    console.log(notifications);

    if (notifications.length > 0) {
        // Set badge as number notifications
        chrome.browserAction.setBadgeText({text: notifications.length.toString()});

        // Store noti ID
        if (!notiIds) {
            notiIds = notifications.map(function (noti) {
                return noti.id;
            });
        }

        newNotiIds = notifications.map(function (noti) {
            return noti.id;
        });

        // Compare 2 arrays
        console.log(notiIds);
        console.log(newNotiIds);

        if (newNotiIds.length > 0) {
            if (notiIds.length != newNotiIds.length || notiIds.every((v,i)=> v !== newNotiIds[i])) {
                chrome.notifications.create({
                    type:     'basic',
                    iconUrl:  'assets/github128.png',
                    title:    'Github Notification',
                    message:  'Có thông báo mới từ Github',
                    priority: 0
                });

                notiIds = newNotiIds;
            }
        }
    }
}

getNotifications(function (notiResponse) {
    displayNotifications(JSON.parse(notiResponse.responseText));
});

setInterval(function(){
    getNotifications(function (notiResponse) {
        displayNotifications(JSON.parse(notiResponse.responseText));
    });
}, 60000);