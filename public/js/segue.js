import React from "react";
import Urls from "./url";
import Folders from "./folder";
import {AddButton, AddPanel, UrlFolderPost, UrlPost} from './add_button';
import SideMenu from "./side_menu";


const db = firebase.firestore();

class SegueAnyToUrl extends React.Component {
  openAddPanel(){ 
    let list = sessionStorage.url_list.split("-@-")
    for(let i=0; i<list.length; i++){
      list[i] = JSON.parse(list[i])
    }
    ReactDOM.render(<SegueAnyToUrlPost list={list} />, document.getElementById("container"))
  }
  render(){
    return(
      <div className="container__wrapper">
        <SideMenu />
        <Urls list={this.props.list} />
        <AddButton func={this.openAddPanel} icon={"url"} />
      </div>
    );
  }
}


class SegueAnyToFolder extends React.Component {
  openAddPanel(){ 
    ReactDOM.render(<AddPanel />, document.getElementById("add_view"));
  }
  render(){
    return(
      <div className="container__wrapper">
        <SideMenu />
        <Folders list={this.props.list} />
        <AddButton func={this.openAddPanel} icon={"+"} />
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
        <SideMenu />
        <Folders list={this.props.list} />
        <AddButton func={this.openFolderPost} icon={"folder"} />
      </div>
    );
  }
}


class SegueAnyToFolderPost extends React.Component {
  render(){
    return(
      <div className="container__wrapper">
        <SideMenu />
        <UrlFolderPost />
        <Folders list={this.props.list} />
      </div>
    );
  }
}


class SegueAnyToUrlPost extends React.Component {
  render(){
    return(
      <div className="container__wrapper">
        <SideMenu />
        <UrlPost/>
        <Urls list={this.props.list} />
      </div>
    );
  }
}


export {SegueAnyToUrl, SegueAnyToFolder, SegueAnyToFolderList, SegueAnyToFolderPost}
