(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var messaging = firebase.messaging();
messaging.usePublicVapidKey("BG12nPQlbJZZ_zCMqijft_bANlvemcDRRs7sXRqYtPo2AwM3QnzJj5MKMcs__muMHYbDPz5q94nYgDev_MeUubY");

sessionStorage.removeItem("canNotification");
messaging.requestPermission().then(function () {
  messaging.getToken().then(function (currentToken) {
    if (currentToken) {
      sendTokenToServer(currentToken);
      // 通知を求める
      //updateUIForPushEnabled(currentToken);
      sessionStorage.canNotification = true;
    } else {
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // 通知の許可を求める
      //updateUIForPushPermissionRequired();
      //setTokenSentToServer(false);
    }
  })["catch"](function (err) {
    console.log('トークンの取得ができません ', err);
    //setTokenSentToServer(false);
  });
})["catch"](function (err) {
  console.log('通知許可がありません', err);
});

messaging.onTokenRefresh(function () {
  messaging.getToken().then(function (refreshedToken) {
    // Indicate that the new Instance ID token has not yet been sent to the app server.
    // setTokenSentToServer(false);
    sendTokenToServer(refreshedToken);
  })["catch"](function (err) {
    showToken('Unable to retrieve refreshed token ', err);
  });
});

messaging.onMessage(function (payload) {
  var options = {
    body: 'this is message body',
    icon: 'logo.png'
  };
  var notification = new Notification(payload, options);
});

function sendTokenToServer(currentToken) {
  var db = firebase.firestore();
  var aId = localStorage.accountId;

  if (aId) {
    return db.collection("account").doc(aId).get().then(function (snap) {
      if (snap.exists) {
        var iids = snap.data().iid ? snap.data().iid : [];
        if (iids.indexOf(currentToken) !== -1) {
          return;
        }
        iids.push(currentToken);
        return db.collection("account").doc(aId).set(data, { merge: true });
      }
    });
  } else {
    localStorage.tokenSaved = currentToken;
    return true;
  }
};

},{}]},{},[1]);
