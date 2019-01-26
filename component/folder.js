import React from 'react';
import Urls from './url';
import {segueURLFeed, segueURLPost} from "./segue";
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
    segueURLFeed(this.state.kind, this.state.id, this.state.ownerAId)
  }
  urlPost(){
    segueURLPost(this.state.id, this.state.ownerAId, this.state.kind)
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
