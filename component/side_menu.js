import React from "react";
import {segueGlobal, segueFolderFeed} from "./segue";
import {db} from "./firebase";


export default class SideMenu extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      profStyle: props.profStyle,
      homeStyle: props.homeStyle,
      foldersStyle: props.foldersStyle,
      alertStyle: props.alertStyle,
      instructStyle: props.instructStyle
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
    alert("すみません、通知機能はこれから実装されます。")
    let path = location.pathname.split("/")[1]
    if(path === "feed")
      path = "home"
    this.setState(switchButtonActive(path))
  }
  instructClicked(){
    this.setState(switchButtonActive("instruction"))
    alert("すみません、説明書はこれから実装されます。")
    let path = location.pathname.split("/")[1]
    if(path === "feed")
      path = "home"
    this.setState(switchButtonActive(path))
  }
  render(){
    return([
      <ul className="list-nav">
        <li className={this.state.profStyle}>
          <a href={"/account?aId=" + localStorage.getItem("accountId")}>Profile</a>
        </li>
        <li>
          <button id="list-nav__home" className={this.state.homeStyle} onClick={this.homeClicked.bind(this)}>Home</button>
        </li>
        <li>
          <button id="list-nav__folders" className={this.state.foldersStyle} onClick={this.folderClicked.bind(this)}>folders</button>
        </li>
        <li>
          <button className={this.state.notifiStyle} onClick={this.notifiClicked.bind(this)}>通知</button>
        </li>
        <li>
          <button className={this.state.instructStyle} onClick={this.instructClicked.bind(this)}>説明書</button>
        </li>
      </ul>,
      <div id="list-nav__rigid" onClick={this.sideMenuActiveShift}></div>
    ])
  }
}


function switchButtonActive(targetElement){
  let after = {
    profStyle: "",
    homeStyle: "",
    foldersStyle: "",
    notifiStyle: "",
    instructStyle: ""
  }
  switch(targetElement){
    case "home":
      after.homeStyle = "tb-active"
      break
    case "profile":
      after.profStyle = "tb-active"
      break
    case "folders":
      after.foldersStyle = "tb-active"
      break
    case "notification":
      after.notifiStyle = "tb-active"
      break
    case "instruction":
      after.instructStyle = "tb-active"
      break
  }
  return after;
}


function sideMenuButtonShift(targetElement){
  sessionStorage.udSideMenuState = JSON.stringify(switchButtonActive(targetElement))
  $("#list-nav__rigid").click()
}


export {sideMenuButtonShift};
