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
      id: props.id
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
    ReactDOM.render(<SegueAnyToUrlPost list={list} id={this.state.id}/>, document.getElementById("container"))
  }
  render(){
    return(
      <div className="container__wrapper">
        <SideMenu />
        <Urls list={this.props.list} />
        <AddButton func={this.openAddPanel.bind(this)} icon={"url"} />
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
        <SideMenu />
        <Folders list={this.state.list} />
        <AddButton func={this.openAddPanel.bind(this)} icon={"+"} />
      </div>
    );
  }
}


class SegueFolderToAddPanel extends React.Component {
  render(){
    return(
      <div className="container__wrapper">
        <SideMenu />
        <Folders list={this.props.list} />
        <AddPanel />
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
        <button id="later_button">Watch later</button>
        <AddButton func={this.openFolderPost} icon={"folder"} />
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
        <SideMenu />
        <UrlFolderPost />
        <Folders list={this.state.list} />
      </div>
    );
  }
}


class SegueAnyToUrlPostFolderChoice extends React.Component {
  constructor(props){
    super(props)
    history.pushState('','',"folders/")
    this.state = { list: this.props.list }
  }
  render(){
    return(
      <div className="container__wrapper">
        <SideMenu />
        <Folders post={true} list={this.state.list} />
      </div>
    );
  }
}


class SegueAnyToUrlPost extends React.Component {
  render(){
    return(
      <div className="container__wrapper">
        <SideMenu />
        <Urls list={this.props.list} />
        <UrlPost id={this.props.id} />
      </div>
    );
  }
}

export {SegueAnyToUrlPostFolderChoice, SegueAnyToFolder, SegueAnyToFolderList, SegueAnyToFolderPost,
  SegueAnyToUrl, SegueAnyToUrlPost}
