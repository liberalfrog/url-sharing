import React from "react";
import Urls from "./url";
import Folders from "./folder";
import {AddButton, AddPanel, UrlFolderPost, UrlPost} from './add_button';
import SideMenu from "./side_menu";
import {db} from "./firebase";
import {segueFolderFeedToPostFolder, segueInitFolderFeed, SegueFolderToAddPanel, segueFolderToAddPanel} from "./segue";
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
    ReactDOM.render(<SegueInitToFolderFeed list={this.state.list} /> , document.getElementById("container"))
    for(let d of this.state.list){
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
      let aId = localStorage.accountId
      if(d.aId === aId){
        let selector = "#" + d.id + " .edit__folder"
        $(selector).css("display", "block")
      }
    }
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
        <UrlFolderPost />
        <Folders list={this.state.list} />
      </div>
    )
  }
}


export {TemplateViewNavTab, ViewFolderEdit, ViewTop, ViewFolderFeed, ViewPostFolder} 
