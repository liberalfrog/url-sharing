// @plaong Use session storage ( like a iOS user defaults )
// If anyone knows more smart ways, please tell me about that.
firebase.initializeApp({
  apiKey: "AIzaSyDifH0dRKR2w8XRZIeXgKOZANnP3iv2qsc",
  authDomain: "urlsharing-541c7.firebaseapp.com",
  databaseURL: "https://urlsharing-541c7.firebaseio.com",
  projectId: "urlsharing-541c7",
  storageBucket: "urlsharing-541c7.appspot.com",
  messagingSenderId: "756728507687"
});

const db = firebase.firestore();
const storage = firebase.storage();

// @platong initialize this page
init()

function init(){
  var aId = location.search.substring(1).split('=')[1];
  db.collection("account").doc(aId).get().then((querysnapShot) => {
    var d = querysnapShot.data();
    console.log(d);
    document.getElementById("account_profile_img").src =  d.img;
    document.getElementById("account_name").innerHTML= d.name;
    document.getElementById("account_intro").innerHTML= d.intro;
  });
}
