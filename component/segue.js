import React from "react";
import Folders from "./folder";
import {AddButton, AddPanel, URLPost} from './add_button';
import SideMenu from "./side_menu";
import {db, auth} from "./firebase";
import {ViewTop, ViewFolderFeed, ViewPostFolder, ViewURLFeed, ViewURLPost} from "./view";
import LaterButton from "./later_button";
import {vSegueURL2URLPost, vSegueHome2AddPanel, vSegueFolder2FolderPost} from "./vector_segue";
import {currentWhere} from "../lib/magic_url";


function segueURLFeed(queryOfURL, unwind, folderData){
  let kind = folderData.kind
  let id = folderData.id
  let ownerAId = folderData.ownerAId
  if(!unwind && queryOfURL !== ""){
    history.pushState('', '', "folder?s=" + queryOfURL)
  }
  sessionStorage.udBeforeLocation = currentWhere()
  let list = []
  let d
  let aId = localStorage.accountId
  let query
  switch(kind){
    case "folders":
      query = db.collection("account").doc(aId).collection("folders").doc(id).collection("urls")
      break
    case "myfreefolders":
      query = db.collection("account").doc(aId).collection("myfreefolders")
                .doc(id).collection("urls")
      break
    case "freefolder":
      query = db.collection("freefolder").doc(id).collection("urls")
      break
    default: 
      console.error("Error: such a folder is not found.")
      break
  }
  query.get().then(snap => {
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      list.push(d)
    };
    sessionStorage.url_list = list.map(x => {return JSON.stringify(x)}).join("-@-");

    if(document.getElementById("main__container")){
      let user = auth.currentUser
	  if(user){
        ReactDOM.render(<ViewURLFeed key="segueUrlFeed" id={id} 
          ownerAId={ownerAId} list={list}/>, document.getElementById("main__container"))
        ReactDOM.render(<AddButton func={() => vSegueURL2URLPost(false)} icon={"url"} />,
          document.getElementById("utility__area"))
	  }else{
        ReactDOM.render(<ViewURLFeed key="segueUrlFeed" id={id} 
          ownerAId={ownerAId} list={list}/>, document.getElementById("main__container"))
	  }
    }else{
      ReactDOM.render([
        <div id="main__container" key="segueUrlFeedMain">
          <ViewURLFeed id={id} ownerAId={ownerAId} list={list}/>
        </div>,
        <div id="utility__area" key="segueUrlFeedUtility">
          <AddButton func={() => vSegueURL2URLPost(false)} icon={"url"} />
        </div>,
        <SideMenu key="SideMenu" foldersStyle="tb-active"/>
      ], document.getElementById("container"))
    }
  });
}


function segueAddPanel(queryOfURL, unwind){
  segueGlobal(queryOfURL, unwind)
  ReactDOM.render(<AddPanel /> , document.getElementById("utility__area"))
}


function segueFolderPost(queryOfURL, unwind){
  if(!unwind){
    history.pushState('', '', "folder?s=" + queryOfURL)
  }
  $("#list-nav__rigid").click()
  sessionStorage.udBeforeLocation = currentWhere()
  let aId = localStorage.getItem("accountId")
  let for_saved_list = []
  let list = []
  db.collection("account").doc(aId).collection("folders").get().then(snap => {
    for(let i of snap.docs){
      let d = i.data()
      d.id = i.id
	  d.kind = "folders"
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    };
    return db.collection("account").doc(aId).collection("myfreefolders").get()
  }).then(snap => {
    for(let i of snap.docs){
      let d = i.data()
      d.id = i.id
	  d.kind = "myfreefolders"
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    };
    sessionStorage.folder_folderList = for_saved_list.join("-@-");
	let addFunction = function(){
	  vSegueFolder2FolderPost(false)
	}
	/* sideMenuButtonShift("folders") */
    ReactDOM.render(<ViewPostFolder key="AddPanelView" list={list}/>, document.getElementById("main__container"));
    ReactDOM.render(<AddButton func={addFunction} icon={"folder"} key="AddPanelAddButton"/>,
      document.getElementById("utility__area"))
    for(let d of list){
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
  })
}


function segueFolderChoice(queryOfURL, unwind){
  if(!unwind){
    history.pushState('', '', "folder?s=" + queryOfURL)
  }
  sessionStorage.udBeforeLocation = currentWhere()
  $("#list-nav__rigid").click()
  let list = []
  let aId = localStorage.getItem("accountId")
  let for_saved_list = []
  db.collection("account").doc(aId).collection("folders").get().then(snap => {
    let d
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      d.kind = "folders"
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    }   
    return db.collection("account").doc(aId).collection("myfreefolders").get()
  }).then(snap => {
    let d
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      d.kind = "myfreefolders"
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    }   
    sessionStorage.urlset_list = for_saved_list.join("-@-");
    ReactDOM.render([
      <h1 className="title__folder-choice" key="SAtitele">URLを登録するフォルダを選択</h1>,
      <div className="container__wrapper" key= "SAcontainer">
        <Folders post={true} list={list} />
      </div>
    ], document.getElementById("main__container"));
    ReactDOM.unmountComponentAtNode(document.getElementById("utility__area"))
    for(let d of list){
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
  })
}


function segueURLPost(queryOfURL, unwind, folderData){
  if(!unwind){
    history.pushState('', '', "folder?s=" + queryOfURL)
  }
  sessionStorage.udBeforeLocation = currentWhere()
  let id = folderData.id
  let ownerAId = folderData.ownerAId
  let kind = folderData.kind
  let list = []
  let d
  let aId = localStorage.accountId
  let query
  switch(kind){
    case "folders":
      query = db.collection("account").doc(aId).collection("folders").doc(id).collection("urls")
      break
    case "myfreefolders":
      query = db.collection("account").doc(aId).collection("myfreefolders")
                .doc(id).collection("urls")
      break
    case "freefolder":
      query = db.collection("freefolder").doc(id).collection("urls")
      break
    default:
      console.log("Some thing bug is occured at segueURLPost.")
      break
  }
  query.get().then(snap => {
    let for_saved_list = []
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    };
    sessionStorage.url_list = for_saved_list.join("-@-");

  /*let listStr = sessionStorage.url_list
  let list
  if(listStr !== "")
    list = listStr.split("-@-").map(x => JSON.parse(x))
  else
    list = []*/
    ReactDOM.render(<ViewURLPost key="segueUrlPost" list={list} id={id} ownerAId={ownerAId}/>, document.getElementById("main__container"))
  })
}

function segueInitFolderFeed(){
  sessionStorage.udBeforeLocation = currentWhere()
  ReactDOM.render(<ViewFolderFeed />, document.getElementById("container"))
}


function segueFolderFeed(queryOfURL, unwind){
  if(!unwind)
    history.pushState('', '', "folder?s=" + queryOfURL)
  else
	$("#list-nav__rigid").click()
  sessionStorage.udBeforeLocation = currentWhere()
  let list = []
  let aId = localStorage.getItem("accountId")
  let addFunction = function(){
    vSegueFolder2FolderPost(false)
  }
  ReactDOM.render([
    <LaterButton key="segueFolderFeedLaterButton"/>,
    <AddButton key="segueFolderFeedAddButton" func={addFunction} icon={"folder"} />
  ], document.getElementById("utility__area"))
  db.collection("account").doc(aId).collection("folders").get().then(snap => {
    let d = {}
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      d.kind = "folders"
      list.push(d)
    }   
    return db.collection("account").doc(aId).collection("myfreefolders").get()
  }).then(snap => {
    let d = {}
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      d.kind = "myfreefolders"
      list.push(d)
    }   
    sessionStorage.folder_folderList = list.map(x=> {return JSON.stringify(x)}).join("-@-"); 
    ReactDOM.render(
      <div className="container__wrapper">
        <Folders list={list} />
      </div>, document.getElementById("main__container")
    )
    for(let d of list){
      let aId = localStorage.accountId
      if(d.aId === aId){
        let selector = "#" + d.id + " .edit__folder"
        $(selector).css("display", "block")
      }
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
  })
}


function segueGlobal(queryOfURL, unwind){
  if(!unwind){
    history.pushState('', '', "home?s=" + queryOfURL)
  }else{
	$("#list-nav__rigid").click()
  }
  sessionStorage.udBeforeLocation = currentWhere()
  let aId = localStorage.accountId
  let latest_list = []
  let recommend_list = []
  ReactDOM.render(<AddButton func={vSegueHome2AddPanel} icon={"+"} />, 
    document.getElementById("utility__area"))
  db.collection("freefolder").orderBy("dateTime", "desc").limit(8).get().then(snap => {
    let d = {}
    for(let j of snap.docs){
      d = j.data()
      d.id = j.id
      d.kind = "freefolder"
      latest_list.push(d)
    }  
	sessionStorage.home_latestFolderList = latest_list.map(x => {return JSON.stringify(x)}).join("-@-")
    return db.collection("freefolder").orderBy("dateTime").limit(8).get()
  }).then(snap => {
    let d = {}
    for(let j of snap.docs){
      d = j.data()
      d.id = j.id
      d.kind = "freefolder"
      recommend_list.push(d)
    }  
    sessionStorage.home_recommendFolderList = recommend_list.map(x => {return JSON.stringify(x)}).join("-@-"); 
    ReactDOM.render([
      <div id="container__latest" key="segueGlobalLatest">
        <h1 className="latest-container__title">新着情報</h1>
        <div className="container__wrapper">
          <Folders list={latest_list}/>
        </div>
      </div>,
      <div key="segueGlobalRecommend">
        <h1 className="recommend-container__title">評価されている情報</h1>
        <div className="container__wrapper">
          <Folders list={recommend_list}/>
        </div>
      </div>
    ], document.getElementById("main__container"))
    let list = latest_list.concat(recommend_list);
    for(let d of list){
      let aId = localStorage.accountId
      if(d.aId === aId){
        let selector = "#" + d.id + " .edit__folder"
        $(selector).css("display", "block")
      }
    }
    return true
  })
}


function segueInitToGlobal(){
  ReactDOM.render(<ViewTop key="segueInitToGlobal"/>, document.getElementById("container"))
}


export {segueFolderChoice, segueURLFeed, segueInitFolderFeed,
    segueFolderFeed, segueInitToGlobal, segueGlobal, segueAddPanel, segueFolderPost, segueURLPost }
