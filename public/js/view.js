import React from "react";
import Urls from "./url";
import Folders from "./folder";
import {AddButton, AddPanel, UrlFolderPost, UrlPost} from './add_button';
import SideMenu from "./side_menu";
import {db} from "./firebase";
import {SegueAnyToFolderList} from "./segue";


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
    ReactDOM.render(<SegueAnyToFolderList list={this.state.list} /> , document.getElementById("container"))
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
    ReactDOM.render(<SegueAnyToFolderList list={list} />, document.getElementById("container"))
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
        <SideMenu />
      </div>
    );
  }
}

export {TemplateViewNavTab, ViewFolderEdit} 
