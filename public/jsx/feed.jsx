import React from 'react';
import Folders from '../js/folder';
import Urls from '../js/url';
import AccountRegister from '../js/account_register';
import {segueToGlobal, SegueAnyToUrl, SegueAnyToFolder, segueToFolders} from '../js/segue';
import {auth, storage, db} from "../js/firebase";

// @plaong Use session storage ( like a iOS user defaults )
// If anyone knows more smart ways, please tell me about that.

var blob;
window.addEventListener('popstate', function(e) {
  init()
});


init()

function blobToFile(theBlob, fileName){
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}




function accountRegisterSubmitValidation(){
  let name = document.getElementById("ra_name").value;
  let file = document.getElementById("ra_profile_img").files[0];
  if(name!=="" && file!==undefined)
    return true;
  return false;
}


function init(){
  auth.onAuthStateChanged(user => {
    if(user === null) {
      var redirect_url = "/" + location.search;
      localStorage.removeItem("accountId")
      if (document.referrer) {
        var referrer = "referrer=" + encodeURIComponent(document.referrer);
        redirect_url = redirect_url + (location.search ? '&' : '?') + referrer;
      }
      location.href = redirect_url;
    }

    db.collection("account").where("uId", "==", user.uid).get().then(snap => {
      if(!snap.empty){
        for(let i of snap.docs){
          localStorage.setItem("accountId", i.id);
          return i.id
        }
      }
      $("body").prepend('<div id="popover"></div>');
      ReactDOM.render( <AccountRegister/>, document.getElementById("popover"));
      return Promise.reject("Account doesn't exist.");
    }).then(aId => {
      switch(location.pathname){
        case "/feed":
          segueToGlobal()
          break
        case "/folders":
          let query = location.search;
          if(query !== ""){
            let hash = query.slice(1).split("&")
            var parameters = []
            hash.map(x => {
              let array = x.split("=")
              parameters.push(array[0])
              parameters[array[0]] = array[1]
            })
            let folderId = parameters["id"]
            let list = [];
            let queryToURLs = db.collection("account").doc(aId).collection("myfreefolders").doc(folderId).collection("urls")
            queryToURLs.get().then(snap => {
              for(let i of snap.docs){
                let d = i.data()
                d.id = i.id
                if(d.aId === undefined){
                  d.aId = ""
                  d.aProfileImg = ""
                  d.aName = ""
                }
                list.push(d)
              };
              ReactDOM.render(<SegueAnyToUrl list={list} id={folderId}/>, document.getElementById("container"))
            });
          }else{
            segueToFolders()
          }
          break
      }
    });
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
