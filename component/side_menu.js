import React from "react";
import {segueGlobal, segueFolderFeed} from "./segue";
import {db, auth} from "./firebase";


export default class SideMenu extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      profImg: auth.currentUser.photoURL,
      profStyle: props.profStyle,
      homeStyle: props.homeStyle + " fas fa-home",
      foldersStyle: props.foldersStyle + " far fa-folder",
      notifiStyle: props.alertStyle + " far fa-bell",
      instructStyle: props.instructStyle + " far fa-question-circle"

    }
    this.sideMenuActiveShift = this.sidemenuActiveShift.bind(this)
  }
  sidemenuActiveShift(){
    let sideMenuState = JSON.parse(sessionStorage.udSideMenuState)
    this.setState(sideMenuState)
    sessionStorage.removeItem("udSideMenuState")
  }
  profClicked(){
    this.setState(switchButtonActive("prof"))
  }
  homeClicked(){
    this.setState(switchButtonActive("home"))
    segueGlobal()
  }
  folderClicked(){
    this.setState(switchButtonActive("folders"))
    segueFolderFeed()
  }
  notifiClicked(){
    this.setState(switchButtonActive("notification"))
    if(sessionStorage.canNotification)
      alert("no zissou no life");
    else
      alert("通知が許可されていません、ブラウザの設定を修正してください")
    let path = location.pathname.split("/")[1]
    if(path === "feed")
      path = "home"
    this.setState(switchButtonActive(path))
  }
  instructClicked(){
    this.setState(switchButtonActive("instruction"))
    alert("sorry、説明書はこれから実装されます。")
    let path = location.pathname.split("/")[1]
    if(path === "feed")
      path = "home"
    this.setState(switchButtonActive(path))
  }
  render(){
    return([
      <div key="sideButtons">
      <ul className="list-nav">
        <li>
          <button id="list-nav__home" className={this.state.homeStyle} onClick={this.homeClicked.bind(this)}>
            <span className="list-nav__button-text">ホーム</span>
          </button>
        </li>
        <li>
          <button id="list-nav__folders" className={this.state.foldersStyle} onClick={this.folderClicked.bind(this)}>
            <span className="list-nav__button-text"></span>
          </button>
        </li>
        <li>
          <button className={this.state.notifiStyle} onClick={this.notifiClicked.bind(this)}>
            <span className="list-nav__button-text">通知</span>
          </button>
        </li>
        <li>
          <button className={this.state.instructStyle} onClick={this.instructClicked.bind(this)}>
            <span className="list-nav__button-text">ヘルプ</span>
          </button>
        </li>
        <li className={this.state.profStyle}>
          <a href={"/account?aId=" + localStorage.getItem("accountId")}>
            <img src={this.state.profImg} id="list-nav__button__profile"/>
            <span className="list-nav__button-text">プロフィール</span>
          </a>
        </li>
      </ul>,
      <div id="list-nav__rigid" onClick={this.sideMenuActiveShift}></div>
    </div>
    ])
  }
}


function switchButtonActive(targetElement){
  let after = {
    profStyle: "",
    homeStyle: " fas fa-home",
    foldersStyle: " far fa-folder",
    notifiStyle: " far fa-bell",
    instructStyle: " far fa-question-circle"
  }
  switch(targetElement){
    case "home":
      after.homeStyle += " tb-active"
      break
    case "profile":
      after.profStyle += " tb-active"
      break
    case "folders":
      after.foldersStyle += " tb-active"
      break
    case "notification":
      after.notifiStyle += " tb-active"
      break
    case "instruction":
      after.instructStyle += " tb-active"
      break
  }
  return after;
}


function sideMenuButtonShift(targetElement){
  sessionStorage.udSideMenuState = JSON.stringify(switchButtonActive(targetElement))
  $("#list-nav__rigid").click()
}


export {sideMenuButtonShift};
