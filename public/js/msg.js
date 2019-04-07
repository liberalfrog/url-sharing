const messaging = firebase.messaging();
messaging.usePublicVapidKey("BG12nPQlbJZZ_zCMqijft_bANlvemcDRRs7sXRqYtPo2AwM3QnzJj5MKMcs__muMHYbDPz5q94nYgDev_MeUubY");

sessionStorage.removeItem("canNotification");
messaging.requestPermission().then(function() {
  messaging.getToken().then(function(currentToken) {
    if (currentToken) {
      sendTokenToServer(currentToken);
      // 通知を求める
      //updateUIForPushEnabled(currentToken);
      sessionStorage.canNotification = true;
    }else{
      // Show permission request.
      console.log('No Instance ID token available. Request permission to generate one.');
      // 通知の許可を求める
      //updateUIForPushPermissionRequired();
      //setTokenSentToServer(false);
    }
  }).catch(function(err) {
    console.log('トークンの取得ができません ', err);
    //setTokenSentToServer(false);
  });
}).catch(function(err) {
  console.log('通知許可がありません', err);
});


messaging.onTokenRefresh(function() {
  messaging.getToken().then(function(refreshedToken) {
    // Indicate that the new Instance ID token has not yet been sent to the app server.
    // setTokenSentToServer(false);
    sendTokenToServer(refreshedToken);
  }).catch(function(err) {
    showToken('Unable to retrieve refreshed token ', err);
  });
});

messaging.onMessage(function(payload) {
  const options = {
    body: 'this is message body',
    icon: 'logo.png'
  };
  const notification = new Notification(payload, options);
});

function sendTokenToServer(currentToken){
  const db = firebase.firestore();

  var aId = localStorage.accountId;
  if(aId){
    return db.collection("account").doc(aId).get().then(snap => {
      if(snap.exists){
        var data = snap.data();
        for(var i of data.iid){
          if(currentToken === i)
	    return;
	  }
        data.iid.push(currentToken);
        return db.collection("account").doc(aId).set(data, { merge: true });
      }
    })
  }else{
    localStorage.tokenSaved = currentToken;
    return true;
  }
};
