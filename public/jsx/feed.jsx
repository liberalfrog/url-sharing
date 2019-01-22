import React from 'react';
import Folders from '../../component/folder';
import Urls from '../../component/url';
import AccountRegister from '../../component/account_register';
import {segueInitToGlobal, SegueAnyToUrl, segueInitFolderFeed} from '../../component/segue';
import {auth, storage, db} from "../../component/firebase";

// @plaong Use session storage ( like a iOS user defaults )
// If anyone knows more smart ways, please tell me about that.


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
      }else if(!navigator.onLine && localStorage.accountId !== undefined){
        return localStorage.accountId 
      }else{
        $("body").prepend('<div id="popover"></div>');
        ReactDOM.render( <AccountRegister/>, document.getElementById("popover"));
        return Promise.reject("Account doesn't exist.");
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
            segueInitFolderFeed()
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
