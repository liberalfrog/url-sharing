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
        <h3>{this.props.name}</h3>
        <div className="folder__mini-profile">
          <img src={this.props.aProfileImg} className="profile-img" />
          <span className="account_name">{this.props.aName}</span>
          <a href={"/account?aId=" + this.state.ownerAId} className="profile-img__link"></a>
        </div>
        <a className="rigidFolder" onClick={this.state.putShow.bind(this)}></a>
        <button className="edit__folder fas fa-cog" onClick={this.edit.bind(this)}></button>
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
    let i=0;
    for(let d of this.state.list){
      return_html.push( <Folder key={d.id} name={d.name} aName={d.aName}
        post={this.props.post}  aId={d.aId} aProfileImg={d.aProfileImg} id={d.id} kind={d.kind}/>);
    }
    return return_html;
  }
}
