import React from 'react';
import Urls from './url';
import {SegueAnyToUrl, SegueAnyToUrlPost} from "./segue";
import {db, storage} from "./firebase";
import {ViewFolderEdit} from "./view";

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
  putShow(){
    let list = []
    let d
    let aId = localStorage.accountId
    let query
    switch(this.state.kind){
      case "folders":
        query = db.collection("account").doc(aId).collection("folders").doc(this.state.id).collection("urls")
        break
      case "myfreefolders":
        query = db.collection("account").doc(aId).collection("myfreefolders")
                  .doc(this.state.id).collection("urls")
        break
      case "freefolder":
        query = db.collection("freefolder").doc(this.state.id).collection("urls")
        break
      default: break
    }
    query.get().then(snap => {
      let for_saved_list = []
      for(let i of snap.docs){
        d = i.data()
        d.id = i.id
        list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };
      sessionStorage.url_list = for_saved_list.join("-@-");
      ReactDOM.render(<SegueAnyToUrl id={this.state.id} ownerAId={this.state.ownerAId} list={list}/>, document.getElementById("container"))
    });
  }
  urlPost(){
    let list = []
    let d
    db.collection("urlset").doc(this.state.id).collection("urlputs").get().then(snap => {
      let for_saved_list = []
      for(let i of snap.docs){
        d = i.data()
        d.id = i.id
        list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };
      sessionStorage.url_list = for_saved_list.join("-@-");
      history.pushState('','',"folder?id=" + this.props.id);
      ReactDOM.render(<SegueAnyToUrlPost id={this.state.id} list={list}/>, document.getElementById("main__container"))
    });
  }
  edit(){
    if(localStorage.accountId === this.state.ownerAId){
      ReactDOM.render(<ViewFolderEdit ownerAId={this.state.ownerAId} id={this.state.id} />, document.getElementById("container"))
    }
  }
  render(){
    return (
      <div className="urlset_panel" id={this.props.id}>
        <button className="edit__folder" onClick={this.edit.bind(this)}>…</button>
        <a href={"/account?aId=" + this.state.ownerAId} className="profile-img__link">
          <img src={this.props.aProfileImg} className="profile-img" />
        </a>
        <h3>{this.props.name}</h3>
        <p className="account_name">{this.props.aName}</p>
        <a className="rigidFolder" onClick={this.state.putShow.bind(this)}></a>
      </div>
    )
  }
}


export default class Folders extends React.Component {
  constructor(props){
    super(props)
    this.state = { list: props.list };
  }
  render(){
    var return_html = []
    for(let d of this.state.list){
      return_html.push( <Folder key={d.id} name={d.name} aName={d.aName}
        post={this.props.post}  aId={d.aId} aProfileImg={d.aProfileImg} id={d.id} kind={d.kind}/>);
    }
    return return_html;
  }
}
