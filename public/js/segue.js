import React from "react";
import Urls from "./url";
import Folders from "./folder";
import AddButton from './add_button';

var func = function(){ console.log("Hello world") };
const db = firebase.firestore();

class SegueAnyToUrl extends React.Component {
  render(){
    return(
      <div><Urls list={this.props.list} /><AddButton func={func} icon={"f"} /></div>
    );
  }
}


class SegueAnyToFolder extends React.Component {
  render(){
    return(
      <div className="container__wrapper"><Folders list={this.props.list} /><AddButton func={func} icon={"+"} /></div>
    );
  }
}

export {SegueAnyToUrl, SegueAnyToFolder}
