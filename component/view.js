import React from "react";
import URLs from "./url";
import Folders from "./folder";
import {AddButton,  URLFolderPost, URLPost} from './add_button';
import SideMenu from "./side_menu";
import {db} from "./firebase";
import {segueFolderFeedToPostFolder, segueInitFolderFeed, segueFolderToAddPanel, segueURLfeedToURLPost} from "./segue";
import LaterButton from "./later_button";


/* Props list: cancel(function) title(string) content(html) */
class TemplateViewNavTab extends React.Component {
  render(){
    return(
      <div>
        <div className="window-overlay" onClick={this.props.cancel}></div>
        <div className="post__container">
          <h1 className="view-title">{this.props.title}</h1>
          {this.props.content}
        </div>
      </div>
    )
  }
}


class ViewFolderEdit extends React.Component {
  constructor(props){
    super(props)
    let list = sessionStorage.urlset_list.split("-@-").map(x => { 
      return JSON.parse(x) 
    })
    let jsx = (
      <div className="add_view">
        <div className="add_panel" onClick={this.deleteFolder.bind(this)}>
          <h3>フォルダの削除</h3>
          <p>このフォルダを削除します</p>
        </div>
      </div>
    )
    this.state = {
      id: props.id,
      ownerAId: props.ownerAId,
      list: list,
      content: jsx
    }
  }
  deleteFolder(){ 
    db.collection("account").doc(this.state.ownerAId).collection("myfreefolders").doc(this.state.id).delete()
    segueInitFolderFeed()
  }
  cancel(){
    ReactDOM.unmountComponentAtNode(document.getElementById("container"))
    let list = sessionStorage.urlset_list.split("-@-")
    for(let i=0; i<list.length; i++){
      list[i] = JSON.parse(list[i])
    }
    ReactDOM.render(<segueInitFolderFeed list={list} />, document.getElementById("container"))
    for(let d of list){
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
      let aId = localStorage.accountId
      if(d.aId === aId){
        let selector = "#" + d.id + " .edit__folder"
        $(selector).css("display", "block")
      }
    }
  }
  render(){
    return(
      <div className="container__wrapper">
        <Folders list={this.state.list} />
        <TemplateViewNavTab content={this.state.content} title={this.state.id} cancel={this.cancel}/>
      </div>
    );
  }
}


class ViewTop extends React.Component{
  openAddPanel(){ 
    segueFolderToAddPanel()
  }
  render(){
    return([
      <div id="main__container">
        <div id="container__latest">
          <h1 className="latest-container__title">新着情報</h1>
          <div className="container__wrapper">
            <Folders list={this.props.latest_list}/>
          </div>
        </div>
        <div>
          <h1 className="recommend-container__title">評価されている情報</h1>
          <div className="container__wrapper"> 
            <Folders list={this.props.recommend_list} />
          </div>
        </div>
      </div>,
      <div id="utility__area">
        <AddButton func={this.openAddPanel.bind(this)} icon={"+"} />
      </div>,
      <SideMenu homeStyle="tb-active"/>
    ])
  }
}


class ViewFolderFeed extends React.Component {
  openFolderPost(){
    segueFolderFeedToPostFolder()
  }
  render(){
    return([
      <div id="main__container"> 
        <div className="container__wrapper">
          <Folders list={this.props.list} />
        </div>
      </div>,
      <div id="utility__area">
        <LaterButton />
        <AddButton func={this.openFolderPost} icon={"folder"} />
      </div>,
      <SideMenu foldersStyle="tb-active"/>
    ]);
  }
}


class ViewPostFolder extends React.Component {
  constructor(props){
    super(props)
    this.state = { list: this.props.list }
  }
  render(){
    return(
      <div className="container__wrapper">
        <URLFolderPost />
        <Folders list={this.state.list} />
      </div>
    )
  }
}


class ViewURLFeed extends React.Component {
  constructor(props){
    super(props)
    this.state = { 
      id: props.id,
      ownerAId: props.ownerAId
    }   
    history.pushState('','',"folders?id=" + this.props.id)
  }
  openAddPanel(){ 
    segueURLfeedToURLPost(this.state.id, this.state.ownerAid)
  }
  componentDidMount(){
    let count = 0
    db.collection("freefolder").doc(this.state.id).collection("urls").get().then(snaps => {
      return snaps.forEach(snap => {
        return db.collection("page_tracking").where("urlId", "==", snap.id).get().then(urlSnaps => {
          count += urlSnaps.size
        }).then(() => {
          document.getElementById("folder__click__number").innerHTML = count;
        })
      })
    })
  }
  render(){
    return([
      <div className="container__wrapper">
        <URLs list={this.props.list} />
      </div>,
      <div className="folder-info__wrapper">
        <h3>このフォルダの閲覧情報</h3>
        <p>クリックされたURLの総回数: <span id="folder__click__number"></span></p>
      </div>
    ]);  
  }
}


class ViewURLPost extends React.Component {
  render(){
    return(
      <div className="container__wrapper">
        <URLs list={this.props.list} />
        <URLPost id={this.props.id} ownerAId={this.props.ownerAId}/>
        <SideMenu />
      </div>
    );
  }
}



export {TemplateViewNavTab, ViewFolderEdit, ViewTop, ViewFolderFeed, ViewPostFolder, ViewURLFeed, ViewURLPost}
