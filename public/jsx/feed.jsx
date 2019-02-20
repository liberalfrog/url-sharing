import React from 'react';
import Folders from '../../component/folder';
import URLs from '../../component/url';
import AccountRegister from '../../component/account_register';
import {segueInitToGlobal, SegueAnyToURL, segueInitFolderFeed, segueURLFeed, segueURLPost} from '../../component/segue';
import {auth, storage, db} from "../../component/firebase";

// @plaong Use session storage ( like a iOS user defaults )
// 2019-2-18 Had better use indexedDB!!


window.addEventListener('popstate', function(e) {
  backBefore()
});

function backBefore(){
  let path = sessionStorage.udBeforeLocation.split("/")[1]
  if(path === "feed"){
    path = "home"
  }
  let selector = "#list-nav__" + path
  $(selector).click()
}


init()


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
      }else if(!navigator.onLine && localStorage.accountId !== undefined){
        return localStorage.accountId 
      }else{
        $("body").prepend('<div id="popover"></div>')
        ReactDOM.render( <AccountRegister/>, document.getElementById("popover"))
        return Promise.reject("Account doesn't exist.")
      }
    }).then(aId => {
      switch(location.pathname){
        case "/feed":
          segueInitToGlobal()
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
            db.collection("account").doc(aId).collection("myfreefolders").doc(folderId).get().then(snap => {
              if(snap.exists){
                segueURLFeed("myfreefolders", folderId, localStorage.accountId)
                throw 'Oh no!';
              }
              return db.collection("account").doc(aId).collection("folders").doc(folderId).get()
            }).then(snap => {
              if(snap.exists){
                segueURLFeed("folders", folderId, localStorage.accountId)
                throw 'Oh no!';
              }
              return db.collection("freefolder").doc(folderId).get()
            }).then(snap => {
              if(snap.exists){
                let data = snap.data()
                segueURLFeed("freefolder", folderId, data.ownerAId)
              }else{
                console.log("URL folder is not found.")
              }
            })
          }else{
            segueInitFolderFeed()
          }
          break
      }
    });
  });
}
