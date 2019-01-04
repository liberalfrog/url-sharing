require("firebase/app");
import {auth, db} from "../js/firebase";

auth.onAuthStateChanged(user => {
  if(user !== null) {
    var redirect_url = "/feed" + location.search;
    if (document.referrer) {
      var referrer = "referrer=" + encodeURIComponent(document.referrer);
      redirect_url = redirect_url + (location.search ? '&' : '?') + referrer;
    }   
    location.href = redirect_url;
  }else{
    var ui = new firebaseui.auth.AuthUI(auth);
    
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function(currentUser, credential, redirectUrl) {
          // サインイン成功時のコールバック関数
          // 戻り値で自動的にリダイレクトするかどうかを指定
          return true;
        },
        uiShown: function() {
          // FirebaseUIウィジェット描画完了時のコールバック関数
          // 読込中で表示しているローダー要素を消す
          document.getElementById('loader').style.display = 'none';
        }
      },
      // リダイレクトではなく、ポップアップでサインインフローを表示
      signInFlow: 'popup',
      signInSuccessUrl: 'feed',
      signInOptions: [
        // サポートするプロバイダ(メールアドレス)を指定
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
      ],
      // Terms of service url.
      tosUrl: '<your-tos-url>'
    };
    ui.start('#firebaseui-auth-container', uiConfig);
  }
})
