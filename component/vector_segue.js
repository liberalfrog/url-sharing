/* 遷移元から遷移先を示したセグエ
 * 実際に画面を移動させるときの大本
 *
 *  表記法
 *
 *  vSegue<From>2<To>
 *
 *  引数: unwind
 *  戻るボタンを押した時の遷移か
 *  押したときなら true
 *
 *  argument: unwind
 *  Transition with pushing return button.
 *  If pushed, true.
 *
 * Segue display transition from and to.
 * Really entering function when page transition occured. 
 *
 */

import React from "react";
import {segueFolderFeed, segueURLFeed, 
	segueGlobal, segueFolderChoice, segueURLPost, segueAddPanel,
    segueFolderPost} from "./segue";
import Folders from "./folder";
import {getFolderType} from "./folder";
import {currentWhere} from "../lib/magic_url";
import queryParser from "../lib/query_parser";
import folderEditQueryGenerator from "../lib/query_generator";
import {ViewURLFeed, ViewFolderEdit} from "./view";

function vSegueHome2Folder(unwind){
  segueFolderFeed("home2folder", unwind)
}

function vSegueFolder2Home(unwind){
  segueGlobal("folder2home", unwind)
}

function vSegueHome2FolderEdit(unwind){
  if(!unwind){
    history.pushState('', '',  "home?s=home2folderedit")
  }
  sessionStorage.udBeforeLocation = currentWhere()
  let latestFolderList = sessionStorage.home_latestFolderList.split("-@-").map(x => { return JSON.parse(x) })
  let recommendFolderList = sessionStorage.home_recommendFolderList.split("-@-").map(x => { return JSON.parse(x) })
  let pageInfo = {
    locate: "home",
	latestFolderList: latestFolderList,
	recommendFolderList: recommendFolderList
  }
  ReactDOM.render(<ViewFolderEdit pageInfo={pageInfo} />, document.getElementById("main__container"))
}

function vSegueFolderEdit2Home(unwind){
  segueGlobal("folderedit2home", unwind)
}

function vSegueHome2URL(unwind){
  let folderData = JSON.parse(sessionStorage.folderData)
  let query
  if(true){
	query = "home2url&id=" + folderData.id
  }else{
	query
  }
  segueURLFeed(query, unwind, folderData)
}

function vSegueURL2Home(unwind){
  segueGlobal("url2home", unwind)
}

function vSegueFolder2FolderEdit(unwind){
  if(!unwind){
    history.pushState('', '',  "folder?s=folder2folderedit")
  }
  sessionStorage.udBeforeLocation = currentWhere()
  let folderList = sessionStorage.folder_folderList.split("-@-").map(x => { return JSON.parse(x) })
  let pageInfo = {
    locate: "folder",
	folderList: folderList
  }
  ReactDOM.render(<ViewFolderEdit pageInfo={pageInfo} />, document.getElementById("main__container"))
}

function vSegueFolderEdit2Folder(unwind){
  let queryPart = folderEditQueryGenerator()
  segueFolderFeed("folderedit2folder" + queryPart, unwind)
}

function vSegueFolder2URL(unwind){
  let folderData = JSON.parse(sessionStorage.folderData)
  /* Authentication */
  let query
  if(true){
	query = "folder2url&id=" + folderData.id
  }else{
	query
  }
  segueURLFeed(query, unwind, folderData)
}

function vSegueURL2Folder(unwind){
  segueFolderFeed("url2folder", unwind)
}

function vSegueAccount2Folder(unwind){
  segueFolderFeed("account2folder", unwind)
}

function vSegueFolder2Account(unwind){
  // location.href ="/account?s=folder2account"
}

function vSegueAccount2URL(unwind){
  let folderData = JSON.parse(sessionStorage.folderData)
  let query
  if(true){
	query = "account2url&id=" + folderData.id
  }else{
	query
  }
  segueURLFeed(query, unwind, folderData)
}

function vSegueURL2Account(unwind){
  location.reload()
}

function vSegueAccount2FolderEdit(unwind){
  if(!unwind){
    history.pushState('', '',  "account?s=account2folderedit")
  }
  ReactDOM.render(<ViewFolderEdit ownerAId={this.state.ownerAId} id={this.state.id} />, document.getElementById("container"))
}

function vSegueFolderEdit2Account(unwind){
}

function vSegueAccount2Followee(unwind){
}

function vSegueFollowee2Account(unwind){
}

function vSegueAccount2Follower(unwind){
}

function vSegueFollower2Account(unwind){
}

function vSegueHome2AddPanel(unwind){
  segueAddPanel("home2addpanel", unwind)
}

function vSegueAddPanel2Home(unwind){
  segueGlobal("url2home", unwind)
}

function vSegueAddPanel2FolderPost(unwind){
  segueFolderPost("addpanel2folderpost", unwind)
}

function vSegueFolderPost2AddPanel(unwind){
  segueAddPanel("folderpost2addpanel", unwind)
}

function vSegueAddPanel2FolderChoice(unwind){
  segueFolderChoice("addpanel2folderchoice", unwind)
}

function vSegueFolderChoice2AddPanel(unwind){
  segueAddPanel("folderchoice2addpanel", unwind)
}

function vSegueFolderChoice2URLPost(unwind){
  let folderData = JSON.parse(sessionStorage.folderData)
  sessionStorage.removeItem("folderData")
  segueURLPost("folderchoice2urlpost&id=" + folderData.id , unwind, folderData)
}

function vSegueURLPost2FolderChoice(unwind){
  segueFolderChoice("urlpost2folderchoice", unwind)
}

function vSegueURLPost2URL(unwind){
  //* unwind is always false
  let id = queryParser().id
  let urlList 
  if(!sessionStorage.url_list){
    urlList = []
  }else{
    urlList = sessionStorage.url_list.split("-@-").map(x => { return JSON.parse(x)})
  }
  if(Boolean(sessionStorage.urlpost_isUpload)){
    let uploadURLList = sessionStorage.urlpost_uploadURLList.split("-@-").map(x => { return JSON.parse(x)})
    Array.prototype.push.apply(urlList, uploadURLList);
    history.pushState('', '',  "folder?s=urlpost2url&upload=true&id=" + id)
  }else{
    history.pushState('', '',  "folder?s=urlpost2url&upload=false&id=" + id)
  }
  sessionStorage.removeItem("urlpost_isUpload")
  sessionStorage.removeItem("urlpost_uploadURLList")
  sessionStorage.udBeforeLocation = currentWhere()
  ReactDOM.render(<ViewURLFeed key="segueUrlFeed" id={id} list={urlList}/>, document.getElementById("main__container"))
}

function vSegueURL2URLPost(unwind){
  let folderId = queryParser().id
  //* unwind is always true
  console.log("folderData")
  getFolderType(folderId).then(folderData => {
	console.log(folderData)
    segueURLPost("url2urlpost&id=" + folderId , unwind, folderData)
  })
}

function vSegueFolderPost2Folder(unwind){
  //* unwind is always false
  let folderList = []
  if(Boolean(sessionStorage.folderpost_isUpload)){
    if(sessionStorage.folder_folderList){
      folderList = sessionStorage.folder_folderList.split("-@-").map(x => { return JSON.parse(x)})
    }
    folderList.push(JSON.parse(sessionStorage.folderpost_uploadFolderData))
    history.pushState('', '',  "folder?s=folderpost2folder&upload=true")
  }else{
    if(sessionStorage.folder_folderList){
      folderList = sessionStorage.folder_folderList.split("-@-").map(x => { return JSON.parse(x)})
    }
    history.pushState('', '',  "folder?s=folderpost2folder&upload=false")
  }
  sessionStorage.removeItem("folderpost_uploadFolderData")
  sessionStorage.removeItem("folderpost_isUpload")
  sessionStorage.udBeforeLocation = currentWhere()
  ReactDOM.render(
    <div className="container__wrapper">
      <Folders list={folderList} />
    </div>, document.getElementById("main__container")
  )
}

function vSegueFolder2FolderPost(unwind){
  segueFolderPost("folder2folderpost", unwind)
}

/* 関数を追加した場合、/lib/spa_router.js の関数リストも変更してください */

export { vSegueHome2Folder, vSegueFolder2Home, vSegueFolder2URL,
vSegueURL2Folder, vSegueHome2AddPanel, vSegueAddPanel2Home,
vSegueAccount2Folder, vSegueFolderChoice2URLPost, vSegueFolderChoice2AddPanel,
vSegueFolder2Account, vSegueAddPanel2FolderChoice, vSegueFolderPost2AddPanel,
vSegueAccount2URL, vSegueAddPanel2FolderPost, vSegueURLPost2URL,
vSegueURL2Account, vSegueURL2URLPost, vSegueFolderPost2Folder,
vSegueAccount2Followee, vSegueFolder2FolderPost, vSegueFolderEdit2Folder,
vSegueFollowee2Account, vSegueHome2URL, vSegueURL2Home, vSegueURLPost2FolderChoice,
vSegueAccount2Follower, vSegueHome2FolderEdit, vSegueFolderEdit2Home,
vSegueFollower2Account, vSegueFolder2FolderEdit, vSegueAccount2FolderEdit
}
