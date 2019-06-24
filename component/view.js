import React from "react";
import URLs from "./url";
import Folders from "./folder";
import {AddButton,  URLFolderPost, URLPost} from './add_button';
import SideMenu from "./side_menu";
import {db} from "./firebase";
import {segueInitFolderFeed, segueFolderToAddPanel, segueURLfeedToURLPost} from "./segue";
import LaterButton from "./later_button";
import {vSegueHome2AddPanel, vSegueFolder2FolderPost} from "./vector_segue";
import {backBefore, folderEdit} from "../lib/spa_router";


/* Props list: cancel(function) title(string) content(html) */
class TemplateViewNavTab extends React.Component {
  render(){
    return(
      <div>
        <div className="window-overlay" onClick={this.props.cancel}></div>
        <div className="delete__container">
          <h1 className="view-title">{this.props.title}</h1>
            <p>このフォルダを削除しますか？</p>
          {this.props.content}
        </div>
      </div>
    )
  }
}


class ViewFolderEdit extends React.Component {
  constructor(props){
    super(props)
	this.state = {
	  id: sessionStorage.folderedit_id,
	  aId: sessionStorage.folderedit_aId,
	  content: (
        <div className="delete_view">
          <input type="button" value="削除" className="post__delete submit_is_disactive" onClick={this.deleteFolder.bind(this)}/>
        </div>
      )
	}
    sessionStorage.removeItem("folderedit_id")
    sessionStorage.removeItem("folderedit_aId")
	this.cancel.bind(this)
  }
  deleteFolder(){ 
    db.collection("account").doc(this.state.aId).collection("myfreefolders").doc(this.state.id).delete().then(() => {
	  sessionStorage.folderedit_isManipulateType = "delete"
	  backBefore(false)
	})
  }
  cancel(){
	sessionStorage.folderedit_isManipulateType = ""
    backBefore(false)
  }
  render(){
	let folderEditComponent
	switch(this.props.pageInfo.locate){
	  case "home":
	    folderEditComponent = ([
          <div id="container__latest" key="segueGlobalLatest">
            <h1 className="latest-container__title">新着情報</h1>
            <div className="container__wrapper">
              <Folders list={this.props.pageInfo.latestFolderList}/>
            </div>
          </div>,
          <div key="segueGlobalRecommend">
            <h1 className="recommend-container__title">評価されている情報</h1>
            <div className="container__wrapper">
              <Folders list={this.props.pageInfo.recommendFolderList}/>
            </div>
          </div>,
          <TemplateViewNavTab key="folderEdit" content={this.state.content} title={this.state.id} cancel={this.cancel}/>
        ])
	    break
	  case "folder":
	    folderEditComponent = (
          <div className="container__wrapper">
            <Folders list={this.props.pageInfo.folderList} />
            <TemplateViewNavTab content={this.state.content} title={this.state.id} cancel={this.cancel}/>
          </div>
		)
		break
	  default:
		console.error("Error at folder edit component")
	}
    return folderEditComponent;
  }
}


class ViewTop extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      latest_list: [],
      recommend_list: []
    }
  }
  openAddPanel(){ 
	vSegueHome2AddPanel(false)
  }
  shouldComponentUpdate (nextProps, nextState){
    let flag = !(this.state === nextState)
    return flag
  }
  componentDidMount(){
    let aId = localStorage.accountId
    let for_saved_list = []
    let latest_list = []
    let recommend_list = []
    db.collection("freefolder").orderBy("dateTime", "desc").limit(8).get().then(snaps => {
      let d = {}
      for(let j of snaps.docs){
        d = j.data()
        d.id = j.id
        d.kind = "freefolder"
        latest_list.push(d)
        for_saved_list.push(JSON.stringify(d))
      }   
      return db.collection("freefolder").orderBy("dateTime").limit(8).get()
    }).then(snaps => {
      let d = {}
      for(let j of snaps.docs){
        d = j.data()
        d.id = j.id
        d.kind = "freefolder"
        recommend_list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };  
      sessionStorage.urlset_list = for_saved_list.join("-@-"); // @platong save list at urlset_list
      this.setState(() => {
        return {
          latest_list: latest_list,
          recommend_list: recommend_list
        }
      })
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
  render(){
    return([
      <div id="main__container" key="MainContainer">
        <div id="container__latest">
          <h1 className="latest-container__title">新着情報</h1>
          <div className="container__wrapper">
            <Folders list={this.state.latest_list}/>
          </div>
        </div>
        <div>
          <h1 className="recommend-container__title">評価されている情報</h1>
          <div className="container__wrapper"> 
            <Folders list={this.state.recommend_list} />
          </div>
        </div>
      </div>,
      <div id="utility__area" key="UtilityArea">
        <AddButton func={this.openAddPanel.bind(this)} icon={"both"} />
      </div>,
      <SideMenu key="SideMenu" homeStyle="tb-active"/>
    ])
  }
}


class ViewFolderFeed extends React.Component {
  constructor(props){
    super(props)
    this.state = { list: [] }
  }
  shouldComponentUpdate (nextProps, nextState){
    let flag = !(this.state === nextState)
    return flag
  }
  componentDidMount(){
    let list = []
    let aId = localStorage.getItem("accountId")
    $.ajax({
      type: "GET",
      url: "/api_v1/sets",
      data: {
        myAId: localStorage.accountId
      },
      success: res => {
        let sets = res.body.split("-@-").map(x => { return JSON.parse(x) })
        this.setState({list: sets})
        let aId = localStorage.accountId
        for(let d of sets){
          if(d.aId === aId){
            let selector = "#" + d.id + " .edit__folder"
            $(selector).css("display", "block")
          }
          $("#" + d.id ).css("background-image", "url(" + d.img + ")")
        }
      }
    })
  }
  openFolderPost(){
	vSegueFolder2FolderPost(false)
  }
  render(){
    return([
      <div id="main__container" key="ViewFolderFeed_main"> 
        <div className="container__wrapper">
          <Folders list={this.state.list} />
        </div>
      </div>,
      <div id="utility__area" key="ViewFolderFeed_utility">
        <LaterButton />
        <AddButton func={this.openFolderPost} icon={"folder"} />
      </div>,
      <SideMenu key="SideMenu" folderStyle="tb-active"/>
    ]);
  }
}


class ViewPostFolder extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div className="container__wrapper">
        <URLFolderPost />
        <Folders list={this.props.list} />
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
  }
  openAddPanel(){ 
    segueURLfeedToURLPost(this.state.id, this.state.ownerAid)
  }
  componentDidMount(){
    let count = 0
    // awaitにすべき
    db.collection("freefolder").doc(this.state.id).collection("urls").get().then(snaps => {
      // TODO: URLを見られた回数を計算して返すならRDBにすべき
      // NoSQLなら冗長化ロジックを書く（合計値を計算する）
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
      <div key="urls" className="container__wrapper">
        <URLs list={this.props.list} />
      </div>,
      <div key="urlsInfos" className="folder-info__wrapper">
        <h3>このフォルダの閲覧情報</h3>
        <p>クリックされたURLの総回数: <span id="folder__click__number"></span></p>
      </div>
    ]);  
  }
}


class ViewURLPost extends React.Component {
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div className="container__wrapper">
        <URLs list={this.props.list} />
        <URLPost id={this.props.id} ownerAId={this.props.ownerAId}/>
        <SideMenu key="SideMenu"/>
      </div>
    );
  }
}



export {TemplateViewNavTab, ViewFolderEdit, ViewTop, ViewFolderFeed, ViewPostFolder, ViewURLFeed, ViewURLPost}
