import {getFolderType} from '../component/folder'
import {segueInitToGlobal, segueInitFolderFeed, segueURLFeed} from '../component/segue'
import {auth, db} from "../component/firebase"
import {backBefore} from "../lib/spa_router"
import queryParser from "../lib/query_parser"

// @plaong Use session storage ( like a iOS user defaults )
// 2019-2-18 Had better use indexedDB!!

window.addEventListener('popstate', (e) => {
  backBefore(true)
})

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
	location.href = "/walkthrough"
        return Promise.reject("Account doesn't exist.")
      }
    }).then(aId => {
      switch(location.pathname){
        case "/home":
          segueInitToGlobal()
          break
        case "/folder":
          let folderId = queryParser().id
          if(folderId !== undefined){
	    getFolderType(folderId).then(folderData => {
              segueURLFeed("", false, folderData)
	    })
          }else{
            segueInitFolderFeed()
          }
          break
      }
    })
  })
