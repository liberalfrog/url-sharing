import React from 'react';
import Folders from '../js/folder';
import Urls from '../js/url';
import {SegueAnyToUrl, SegueAnyToFolder} from '../js/segue';

// @plaong Use session storage ( like a iOS user defaults )
// If anyone knows more smart ways, please tell me about that.
const db = firebase.firestore();
const storage = firebase.storage();
var blob;


window.addEventListener('popstate', function(e) {
  const pathname = location.pathname
  if(pathname === "/feed" || pathname === "/feed/"){
    init()
  }
});


init()

function blobToFile(theBlob, fileName){
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}


function getAccountId(user){
  return db.collection("account").where("uId", "==", user.uid).get().then(snap  => {
    for(let i of snap.docs){
      return i.id
    }
  });
}


function accountRegisterSubmitValidation(){
  let name = document.getElementById("ra_name").value;
  let file = document.getElementById("ra_profile_img").files[0];
  if(name!=="" && file!==undefined)
    return true;
  return false;
}


function init(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      let query = location.search;
      if(query!==""){
        let hash = query.slice(1).split("&");
        var parameters = [];
        for(let i=0; i<hash.length; i++){
          let array = hash[i].split("=")
          parameters.push(array[0])
          parameters[array[0]] = array[1]
        }
        let folderId = parameters["id"]
        let list = [];
        let d;
        let folderQuery = db.collection("urlset").doc(folderId).collection("urlputs")
        folderQuery.get().then(snap => {
          for(let i of snap.docs){
            d = i.data()
            d.id = i.id
            if(d.aId === undefined){
              d.aId = ""
              d.aProfileImg = ""
              d.aName = ""
            }
            list.push(d)
          };
          ReactDOM.render(<SegueAnyToUrl list={list}/>, document.getElementById("container"))
        });
        return;
      }
      else {
        getAccountId(user).then(a => {
          if(a === undefined){
            $("body").prepend('<div id="popover"></div>');
            ReactDOM.render( <CenteringPopover/>, document.getElementById("popover"));
            return
          }
          localStorage.setItem("accountId", a);
        });
        let list = []
        db.collection("urlset").get().then(snap => {
          let d;
          let for_saved_list = []
          for(let i of snap.docs){
            d = i.data()
            d.id = i.id
            list.push(d)
            for_saved_list.push(JSON.stringify(d))
          };
          for(let d of list){
            $("#" + d.id ).css("background-image", "url(" + d.img + ")")
          }
          sessionStorage.urlset_list = for_saved_list.join("-@-"); // @platong save list at urlset_list
          ReactDOM.render(<SegueAnyToFolder list={list}/>, document.getElementById("container"));
        });
      }
    } else {
      var redirect_url = "/" + location.search;
      if (document.referrer) {
        var referrer = "referrer=" + encodeURIComponent(document.referrer);
        redirect_url = redirect_url + (location.search ? '&' : '?') + referrer;
      }
      location.href = redirect_url;
    }
  });


}




class CenteringPopover extends React.Component{
  render(){
    return(
      <AccountRegister />
    );
  }
}

function raButtonActiveSwitch(){
  if(accountRegisterSubmitValidation()){
    $("#ra_submit").addClass("submit_is_active");
    $("#ra_submit").removeClass("submit_is_disactive");
  }else{
    $("#ra_submit").removeClass("submit_is_active");
    $("#ra_submit").addClass("submit_is_disactive");
  }
}

class AccountRegister extends React.Component{
  // @platong If file is changed, file will be compressed.
  fileChanged(){
    let file = document.getElementById("ra_profile_img").files[0]
    if (file.type != 'image/jpeg' && file.type != 'image/png') {
      file = null;
      blob = null;
      return;
     alert("画像でないものはアップロードできません。対応形式はjpegかpngです。");
    }
    var image = new Image();
    var reader = new FileReader();
    const IMG_MAX_WIDTH = 96;

    reader.onload = function(e) {
      image.onload = function() {
        var width, height, ratio;
        if(image.width > image.height){
          ratio = image.height / image.width;
          width = IMG_MAX_WIDTH
          height = IMG_MAX_WIDTH * ratio;
        } else {
          ratio = image.width/ image.height;
          width = IMG_MAX_WIDTH * ratio;
          height = IMG_MAX_WIDTH
        }
        var canvas = $('#ra_preview').attr('width', width).attr('height', height);
        var ctx = canvas[0].getContext('2d');
        ctx.clearRect(0,0,width,height);
        ctx.drawImage(image,0,0,image.width,image.height,0,0,width,height);

        var base64 = canvas.get(0).toDataURL('image/jpeg');
        var barr, bin, i, len;
        bin = atob(base64.split('base64,')[1]);
        len = bin.length;
        barr = new Uint8Array(len);
        i = 0;
        while (i < len) {
          barr[i] = bin.charCodeAt(i);
          i++;
        }
        blob = new Blob([barr], {type: 'image/jpeg'});
      }
      image.src = e.target.result;
    }
    reader.readAsDataURL(file);
    raButtonActiveSwitch()
  }
  submit(){
    let file = document.getElementById("ra_profile_img").files[0]
    if(!accountRegisterSubmitValidation() && !blob) return; // validation
    let db = firebase.firestore();
    let storage = firebase.storage();
    let storageRef = storage.ref();
    let imagesRef = storageRef.child('account_profile_imgs');
    const file_name = file.name
    file = blobToFile(blob)
    var ref = storageRef.child('account_profile_imgs/' + file_name);
    var uploadTask = ref.put(file)
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
      }
    }, function(error) { // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized': // User doesn't have permission to access the object
          break;
        case 'storage/canceled': // User canceled the upload
          break;
        case 'storage/unknown': // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, function() { // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        let user = firebase.auth().currentUser;
        let name = document.getElementById("ra_name").value
        db.collection("account").add({
          img: downloadURL,
          name: name,
          uId: user.uid
        }).then(docRef => {
          user.updateProfile({
            displayName: name,
            photoURL: downloadURL
          }).then(() => {
            console.log("All process is done");
            location.reload();
          }).catch(err => {
            console.error("Error: Register account: ", err);
          });
        }).catch(function(error) {
          console.error("Error adding document: ", error);
        });
      });
    });
  };
  render(){
    return(
      <div className="ra">
        <div className="window-overlay"></div>
        <div className="centering_popover">
          <h2>Register an account</h2>
          <form>
            <input type="text" id="ra_name" style={{display: "block"}} placeholder="表示名（アカウント名）" onInput={raButtonActiveSwitch}/>
            <label htmlFor="ra_profile_img">プロフィール画像を選択</label>
            <input type="file" id="ra_profile_img" name="ra_profile_img" onChange={this.fileChanged} />
            <input type="text" id="ra_intro" placeholder="自己紹介" />
            <input type="button" onClick={this.submit} value="登録" className="submit_is_disactive" id="ra_submit"/>
          </form>
          <canvas id="ra_preview" width="96" height="96"></canvas>
        </div>
      </div>
    );
  }
}
