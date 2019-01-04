import React from "react";
import Urls from "./url";
import Folders from "./folder";
import {AddButton, AddPanel, UrlFolderPost, UrlPost} from './add_button';
import SideMenu from "./side_menu";
import {db} from "./firebase";


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
    ReactDOM.render(<SegueAnyToUrlPost list={list} id={this.state.id} ownerAId={this.state.ownerAId}/>, document.getElementById("container"))
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


class SegueAnyToFolder extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      list: props.list
    }
  }
  openAddPanel(){ 
    ReactDOM.unmountComponentAtNode(document.getElementById("container"));
    ReactDOM.render( <SegueFolderToAddPanel list={this.state.list}/>, document.getElementById("container"));
    for(let d of this.state.list){
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
  }
  render(){
    return(
      <div className="container__wrapper">
        <Folders list={this.state.list} />
        <AddButton func={this.openAddPanel.bind(this)} icon={"+"} />
        <SideMenu />
      </div>
    );
  }
}


class SegueFolderToAddPanel extends React.Component {
  render(){
    return(
      <div className="container__wrapper">
        <Folders list={this.props.list} />
        <AddPanel />
        <SideMenu />
      </div>
    );
  }
}


class SegueAnyToFolderList extends React.Component {
  openFolderPost(){
    let list = sessionStorage.urlset_list.split("-@-")
    for(let i=0; i<list.length; i++){
      list[i] = JSON.parse(list[i])
    }
    ReactDOM.render(<SegueAnyToFolderPost list={list} />, document.getElementById("container"))
    for(let d of list){
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }   
  }
  render(){
    return(
      <div className="container__wrapper">
        <Folders list={this.props.list} />
        <button id="later_button">Watch later</button>
        <AddButton func={this.openFolderPost} icon={"folder"} />
        <SideMenu />
      </div>
    );
  }
}


class SegueAnyToFolderPost extends React.Component {
  constructor(props){
    super(props)
    this.state = { list: this.props.list }
  }
  render(){
    return(
      <div className="container__wrapper">
        <UrlFolderPost />
        <Folders list={this.state.list} />
        <SideMenu />
      </div>
    );
  }
}


class SegueAnyToUrlPostFolderChoice extends React.Component {
  constructor(props){
    super(props)
    this.state = { list: this.props.list }
  }
  render(){
    return(
      <div>
        <h1 className="title__folder-choice">URLを登録するフォルダを選択</h1>
        <div className="container__wrapper">
          <Folders post={true} list={this.state.list} />
          <SideMenu />
        </div>
      </div>
    );
  }
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


function segueToFolders(){
  history.pushState('','',"folders")
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
      ReactDOM.unmountComponentAtNode(document.getElementById("container"))
      ReactDOM.render(<SegueAnyToFolderList list={list} />, document.getElementById("container"))
      for(let d of list){
        $("#" + d.id ).css("background-image", "url(" + d.img + ")")
      }   
    })  
  })
}


function segueToGlobal(){
  let list = []
  let d;
  let for_saved_list = []
  let aId = localStorage.accountId
  db.collection("freefolder").orderBy("dateTime", "desc").limit(8).get().then(snap => {
    for(let j of snap.docs){
      d = j.data()
      d.id = j.id
      d.kind = "freefolder"
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    };  
    sessionStorage.urlset_list = for_saved_list.join("-@-"); // @platong save list at urlset_list
    ReactDOM.render(
      <div>
        <h1 className="latest-container__title">新着情報</h1>
        <div className="container__wrapper">
          <Folders list={list}/>
        </div>
      </div>
    , document.getElementById("container__latest"));
    for(let d of list){
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
    return true
  }).then(() => {
    list = []
    d = []
    for_saved_list = []
    return db.collection("freefolder").orderBy("dateTime").limit(8).get().then(snap => {
      for(let j of snap.docs){
        d = j.data()
        d.id = j.id
        d.kind = "freefolder"
        list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };  
      sessionStorage.urlset_list = for_saved_list.join("-@-"); // @platong save list at urlset_list
      ReactDOM.render(
        <div>
          <h1 className="recommend-container__title">評価されている情報</h1>
          <SegueAnyToFolder list={list}/>
        </div>
      , document.getElementById("container"));
      for(let d of list){
        $("#" + d.id ).css("background-image", "url(" + d.img + ")")
      }
      return true
    })
  })
}


export {SegueAnyToUrlPostFolderChoice, SegueAnyToFolder, SegueAnyToFolderList, SegueAnyToFolderPost,
  SegueAnyToUrl, SegueAnyToUrlPost, segueToFolders, segueToGlobal}
