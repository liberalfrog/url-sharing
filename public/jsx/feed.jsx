import React from 'react';
import Folders from '../js/folder';
import Urls from '../js/url';
import AccountRegister from '../js/account_register';
import {SegueAnyToUrl, SegueAnyToFolder} from '../js/segue';

// @plaong Use session storage ( like a iOS user defaults )
// If anyone knows more smart ways, please tell me about that.
let db = firebase.firestore();
const settings = { timestampsInSnapshots: true};
db.settings(settings)
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
        let aId = localStorage.accountId
        if(aId === undefined){
          getAccountId(user).then(a => {
            if(a === undefined){
              $("body").prepend('<div id="popover"></div>');
              ReactDOM.render( <AccountRegister/>, document.getElementById("popover"));
              return
            }
            localStorage.setItem("accountId", a);
          });
        }
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
          sessionStorage.urlset_list = for_saved_list.join("-@-"); // @platong save list at urlset_list
          ReactDOM.render(<SegueAnyToFolder list={list}/>, document.getElementById("container"));
          for(let d of list){
            $("#" + d.id ).css("background-image", "url(" + d.img + ")")
          }
        });
      }
    } else {
      var redirect_url = "/" + location.search;
      localStorage.removeItem("accountId")
      if (document.referrer) {
        var referrer = "referrer=" + encodeURIComponent(document.referrer);
        redirect_url = redirect_url + (location.search ? '&' : '?') + referrer;
      }
      location.href = redirect_url;
    }
  });


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
