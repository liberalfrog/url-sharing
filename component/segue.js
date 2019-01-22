import React from "react";
import Urls from "./url";
import Folders from "./folder";
import {AddButton, AddPanel, UrlPost} from './add_button';
import SideMenu from "./side_menu";
import {db} from "./firebase";
import {ViewTop, ViewFolderFeed, ViewPostFolder} from "./view";
import LaterButton from "./later_button";


class SegueAnyToUrl extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      id: props.id,
      ownerAId: props.ownerAId
    }
    history.pushState('','',"folders?id=" + this.props.id);
  }
  openAddPanel(){ 
    let listStr = sessionStorage.url_list
    let list
    if(listStr !== "")
      list = listStr.split("-@-").map(x => JSON.parse(x))
    else
      list = []
    ReactDOM.render(<SegueAnyToUrlPost list={list} id={this.state.id} ownerAId={this.state.ownerAId}/>, document.getElementById("main__container"))
  }
  render(){
    return(
      <div className="container__wrapper">
        <Urls list={this.props.list} />
        <AddButton func={this.openAddPanel.bind(this)} icon={"url"} />
        <SideMenu />
      </div>
    );
  }
}


function segueFolderFeedToPostFolder(){
  let list = sessionStorage.urlset_list.split("-@-")
  list.map(x => {JSON.parse(x)})
  ReactDOM.render(<ViewPostFolder list={list} />, document.getElementById("main__container"))
  for(let d of list){
    let aId = localStorage.accountId
    if(d.aId === aId){
      let selector = "#" + d.id + " .edit__folder"
      $(selector).css("display", "block")
    }
    $("#" + d.id ).css("background-image", "url(" + d.img + ")")
  }
}


function segueFolderToAddPanel(){
  ReactDOM.render(<AddPanel /> , document.getElementById("utility__area"))
}


function segueAnyToUrlPostFolderChoice(){
  history.pushState('','',"folders")
  let list = []
  let aId = localStorage.getItem("accountId")
  let for_saved_list = []
  db.collection("account").doc(aId).collection("folders").get().then(snap => {
    let d
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    }   
    return db.collection("account").doc(aId).collection("myfreefolders").get()
  }).then(snap => {
    let d
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    }   
    sessionStorage.urlset_list = for_saved_list.join("-@-");
    ReactDOM.render([
      <h1 className="title__folder-choice">URLを登録するフォルダを選択</h1>,
      <div className="container__wrapper">
        <Folders post={true} list={list} />
      </div>
    ], document.getElementById("main__container"));
    ReactDOM.unmountComponentAtNode(document.getElementById("utility__area"))
    for(let d of list){
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
  })
}


class SegueAnyToUrlPost extends React.Component {
  render(){
    return(
      <div className="container__wrapper">
        <Urls list={this.props.list} />
        <UrlPost id={this.props.id} ownerAId={this.props.ownerAId}/>
        <SideMenu />
      </div>
    );
  }
}


function segueInitFolderFeed(){
  let list = []
  let aId = localStorage.getItem("accountId")
  db.collection("account").doc(aId).collection("folders").get().then(snap1 => {
    let d;
    let for_saved_list = []
    for(let i of snap1.docs){
      d = i.data()
      d.id = i.id
      d.kind = "folders"
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    };  
    db.collection("account").doc(aId).collection("myfreefolders").get().then(snap2 => {
      let d;
      for(let i of snap2.docs){
        d = i.data()
        d.id = i.id
        d.kind = "myfreefolders"
        list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };  
      sessionStorage.urlset_list = for_saved_list.join("-@-"); 
      ReactDOM.render(<ViewFolderFeed list={list} />, document.getElementById("container"))
      for(let d of list){
        let aId = localStorage.accountId
        if(d.aId === aId){
          let selector = "#" + d.id + " .edit__folder"
          $(selector).css("display", "block")
        }
        $("#" + d.id ).css("background-image", "url(" + d.img + ")")
      }   
    })  
  })
}


function segueFolderFeed(){
  sessionStorage.udBeforeLocation = location.pathname
  history.pushState('','',"folders")
  let list = []
  let for_saved_list = []
  let aId = localStorage.getItem("accountId")
  ReactDOM.render([
    <LaterButton />,
    <AddButton func={segueFolderFeedToPostFolder} icon={"folder"} />
  ], document.getElementById("utility__area"))
  db.collection("account").doc(aId).collection("folders").get().then(snap => {
    let d = {}
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      d.kind = "folders"
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    }   
    return db.collection("account").doc(aId).collection("myfreefolders").get()
  }).then(snap => {
    let d = {}
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      d.kind = "myfreefolders"
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    }   
    sessionStorage.urlset_list = for_saved_list.join("-@-"); 
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


function segueGlobal(){
  sessionStorage.udBeforeLocation = location.pathname
  history.pushState('','',"feed")
  let aId = localStorage.accountId
  let for_saved_list = []
  let latest_list = []
  let recommend_list = []
  ReactDOM.render(<AddButton func={segueFolderToAddPanel} icon={"+"} />, 
    document.getElementById("utility__area"))
  db.collection("freefolder").orderBy("dateTime", "desc").limit(8).get().then(snap => {
    let d = {}
    for(let j of snap.docs){
      d = j.data()
      d.id = j.id
      d.kind = "freefolder"
      latest_list.push(d)
      for_saved_list.push(JSON.stringify(d))
    }  
    return db.collection("freefolder").orderBy("dateTime").limit(8).get()
  }).then(snap => {
    let d = {}
    for(let j of snap.docs){
      d = j.data()
      d.id = j.id
      d.kind = "freefolder"
      recommend_list.push(d)
      for_saved_list.push(JSON.stringify(d))
    };  
    sessionStorage.urlset_list = for_saved_list.join("-@-"); // @platong save list at urlset_list
    ReactDOM.render([
      <div id="container__latest">
        <h1 className="latest-container__title">新着情報</h1>
        <div className="container__wrapper">
          <Folders list={latest_list}/>
        </div>
      </div>,
      <div>
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
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
    return true
  })
}


function segueInitToGlobal(){
  let aId = localStorage.accountId
  let for_saved_list = []
  let latest_list = []
  let recommend_list = []
  db.collection("freefolder").orderBy("dateTime", "desc").limit(8).get().then(snap => {
    let d = {}
    for(let j of snap.docs){
      d = j.data()
      d.id = j.id
      d.kind = "freefolder"
      latest_list.push(d)
      for_saved_list.push(JSON.stringify(d))
    }  
    return db.collection("freefolder").orderBy("dateTime").limit(8).get()
  }).then(snap => {
    let d = {}
    for(let j of snap.docs){
      d = j.data()
      d.id = j.id
      d.kind = "freefolder"
      recommend_list.push(d)
      for_saved_list.push(JSON.stringify(d))
    };  
    sessionStorage.urlset_list = for_saved_list.join("-@-"); // @platong save list at urlset_list
    ReactDOM.render(<ViewTop latest_list={latest_list} recommend_list={recommend_list}/>
        , document.getElementById("container"))
    for(let d of recommend_list){
      let aId = localStorage.accountId
      if(d.aId === aId){
        let selector = "#" + d.id + " .edit__folder"
        $(selector).css("display", "block")
      }
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
    for(let d of latest_list){
      let aId = localStorage.accountId
      if(d.aId === aId){
        let selector = "#" + d.id + " .edit__folder"
        $(selector).css("display", "block")
      }
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
    return true
  })
}


export {segueAnyToUrlPostFolderChoice, SegueAnyToUrl, SegueAnyToUrlPost, segueInitFolderFeed,
    segueFolderFeed, segueInitToGlobal, segueGlobal, segueFolderToAddPanel, segueFolderFeedToPostFolder}
