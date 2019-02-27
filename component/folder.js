import React from 'react';
import Urls from './url';
import {segueURLFeed, segueURLPost} from "./segue";
import {db, storage} from "./firebase";
import {ViewFolderEdit} from "./view";
import {vSegueFolderChoice2URLPost, vSegueHome2FolderEdit} from "./vector_segue";
import {folderSegue, folderEdit} from "../lib/spa_router";

class Folder extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      putShow: props.post ? this.urlPost : this.putShow,
      id: props.id,
      ownerAId: props.aId,
      kind: props.kind
    }
  }
  componentDidMount(){
    $("#" + this.state.id).css("background-image", 'url("' + this.props.img + '")')
  }
  putShow(){
	sessionStorage.folderData = JSON.stringify(this.state)
	folderSegue("url")
  }
  urlPost(){
	sessionStorage.folderData = JSON.stringify(this.state)
	vSegueFolderChoice2URLPost(false)
  }
  edit(){
    if(localStorage.accountId === this.state.ownerAId){
	  sessionStorage.folderedit_id = this.state.id
      sessionStorage.folderedit_aId = this.state.ownerAId
	  folderEdit(false)
    }
  }
  render(){
    return (
      <div className="urlset_panel" id={this.props.id} >
        <div className="folder__description">
          <h3>{this.props.name}</h3>
          <div className="folder__mini-profile">
            <img src={this.props.aProfileImg} className="profile-img" />
            <span className="account_name">{this.props.aName}</span>
            <a href={"/account?s=" + location.pathname.slice(1) + "2account&aId=" + this.state.ownerAId} className="profile-img__link"></a>
          </div>
          <button className="edit__folder fas fa-cog" onClick={this.edit.bind(this)}></button>
        </div>
        <a className="rigidFolder" onClick={this.state.putShow.bind(this)}></a>
      </div>
    )
  }
}


export default class Folders extends React.Component {
  render(){
    var return_html = []
    let i=0;
    for(let d of this.props.list){
      if(d.id===undefined)
        continue
      return_html.push( <Folder key={d.id} name={d.name} aName={d.aName} img={d.img}
        post={this.props.post}  aId={d.aId} aProfileImg={d.aProfileImg} id={d.id} kind={d.kind}/>);
    }
    return return_html;
  }
}


function getFolderType(folderId){
  let type
  let aId = localStorage.accountId
  return db.collection("account").doc(aId).collection("myfreefolders").doc(folderId).get().then(snap => {
    if(snap.exists){
	  type = "myfreefolders"
	  return snap
    }else{   
      return db.collection("account").doc(aId).collection("folders").doc(folderId).get()
	}
 }).then(snap => {
   if(snap.exists){
	 type = "folders"
	 return snap
   }else{
     return db.collection("freefolder").doc(folderId).get()
   }
 }).then(snap => {
   if(snap.exists){
	 type = "freefolder"
     let data = snap.data()
	 return {
	   id: snap.id,
	   ownerAId: data.aId,
       kind: type	
	 }
   }else{
	 alert("このフォルダは存在しません")
     console.error("Such a folder is not found.")
   }   
 })
}

export {getFolderType};
