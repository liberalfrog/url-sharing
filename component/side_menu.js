import React from "react";
import {segueGlobal, segueFolderFeed} from "./segue";
import {db, auth} from "./firebase";
import {vSegueHome2Folder, vSegueFolder2Home} from "./vector_segue";
import {currentWhere} from "../lib/magic_url";


export default class SideMenu extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      profImg: auth.currentUser.photoURL,
      profStyle: props.profStyle,
      homeStyle: props.homeStyle + " fas fa-home",
      folderStyle: props.folderStyle + " far fa-folder",
      notifiStyle: props.alertStyle + " far fa-bell",
      instructStyle: props.instructStyle + " far fa-question-circle"
    }
    this.sideMenuActiveShift = this.sidemenuActiveShift.bind(this)
  }
  sidemenuActiveShift(){
	let nowLocation = location.pathname.slice(1)
    this.setState(switchButtonActive(nowLocation))
  }
  profClicked(){
	history.pushState('','',"account?" + localStorage.getItem("accountId"))
    this.setState(switchButtonActive("prof"))
  }
  homeClicked(){
	let beforeState = this.state
    this.setState(switchButtonActive("home"))
    sideMenuVSegueEventTrigger(beforeState, switchButtonActive("home"))
  }
  folderClicked(){
	let beforeState = this.state
    this.setState(switchButtonActive("folder"))
    sideMenuVSegueEventTrigger(beforeState, switchButtonActive("folder"))
  }
  notifiClicked(){
	let beforeState = this.state
    this.setState(switchButtonActive("notification"))
    sideMenuVSegueEventTrigger(beforeState, switchButtonActive("notification"))
    if(sessionStorage.canNotification)
      alert("通知表示画面はこれから実装されます。");
    else
      alert("通知が許可されていません、ブラウザの設定を修正してください")
    let path = location.pathname.split("/")[1]
    this.setState(switchButtonActive(path))
  }
  instructClicked(){
	let beforeState = this.state
    this.setState(switchButtonActive("instruction"))
    sideMenuVSegueEventTrigger(beforeState, switchButtonActive("instuction"))
    alert("すみません、説明書はこれから実装されます。")
    let path = location.pathname.split("/")[1]
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
          <button id="list-nav__folders" className={this.state.folderStyle} onClick={this.folderClicked.bind(this)}>
            <span className="list-nav__button-text">フォルダ</span>
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
          <a href={"/account?s=" + location.pathname.slice(1) + "2account&aId=" + localStorage.getItem("accountId")}>
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
    folderStyle: " far fa-folder",
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
    case "folder":
      after.folderStyle += " tb-active"
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


function sideMenuVSegueEventTrigger(beforeMenuState, afterMenuState){
  let beforeActiveListItem
  for(let i in beforeMenuState){
	if(beforeMenuState[i] === undefined)
	  continue
    if(beforeMenuState[i].indexOf("tb-active") !== -1){
      beforeActiveListItem = i
	}
  }

  let afterActiveListItem
  for(let i in afterMenuState){
	if(beforeMenuState[i] === undefined)
	  continue
    if(afterMenuState[i].indexOf("tb-active") !== -1){
      afterActiveListItem = i
    }   
  }

  if(beforeActiveListItem === afterActiveListItem)
	return

  if(beforeActiveListItem === "homeStyle"){
	if(afterActiveListItem === "profStyle")
      console.log("遷移が実際のリンクにより行われます")	
    else if(afterActiveListItem === "folderStyle")
	  vSegueHome2Folder(false)
	else if(afterActiveListItem === "notifiStyle")
      console.log("通知画面が未実装なので表示されません")	
	else if(afterActiveListItem === "instructStyle")
      console.log("説明書が未実装なので表示されません")	
	else
	  alert("すみません、開発者のミスです。このバグはすぐに修正します。")
  }else if(beforeActiveListItem === "folderStyle"){
	if(afterActiveListItem === "profStyle")
      console.log("遷移が実際のリンクにより行われます")	
    else if(afterActiveListItem === "homeStyle")
	  vSegueFolder2Home(false)
	else if(afterActiveListItem === "notifiStyle")
      console.log("通知画面が未実装なので表示されません")	
	else if(afterActiveListItem === "instructStyle")
      console.log("説明書が未実装なので表示されません")	
	else
	  alert("すみません、開発者のミスです。このバグはすぐに修正します。")
  }
}


// 不要かも
function sideMenuButtonShift(targetElement){
  sessionStorage.udSideMenuState = JSON.stringify(switchButtonActive(targetElement))
  $("#list-nav__rigid").click()
}


export {sideMenuButtonShift};
