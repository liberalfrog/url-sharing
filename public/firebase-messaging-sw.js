importScripts("/common/js/5.7.0/firebase-app.js");
importScripts("/common/js/5.7.0/firebase-messaging.js");

var config = {
  apiKey: "AIzaSyDifH0dRKR2w8XRZIeXgKOZANnP3iv2qsc",
  authDomain: "urlsharing-541c7.firebaseapp.com",
  databaseURL: "https://urlsharing-541c7.firebaseio.com",
  projectId: "urlsharing-541c7",
  storageBucket: "urlsharing-541c7.appspot.com",
  messagingSenderId: "756728507687"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');
});

messaging.setBackgroundMessageHandler(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
