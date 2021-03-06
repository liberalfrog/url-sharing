import {db} from "./firebase";
import React from 'react';

class URL extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      title: props.title,
      href: props.href,
      content: props.content,
      id: props.id
    }
  }
  clickHandler(){
    let query = location.search;
    let hash = query.slice(1).split("&")
    var parameters = []
    hash.map(x => {
      let array = x.split("=")
      parameters.push(array[0])
      parameters[array[0]] = array[1]
    })
    let folderId = parameters["id"]
    let aId = localStorage.getItem("accountId")
    let data = {
      href: this.state.href,
      date: new Date(),
      urlId: this.state.id,
      folderId: folderId
    }
    db.collection("account").doc(aId).collection("page_trackings").add(data);
  }
  render(){
    return (
      <div className="urlput_panel">
        <div className="text_overflow_url">
          <h3>{this.state.title}</h3>
          <a href={this.state.href} target="_blank" onClick={this.clickHandler.bind(this)}></a>
        </div>
        <p className="baloon">{this.state.content}</p>
      </div>
    )
  }
}


export default class URLs extends React.Component {
  constructor(props){
    super()
    this.state = {
      list: props.list
    };
  }
  render(){
    var return_html = []
    for(let [i, d] of this.state.list.entries()){
      return_html.push( <URL key={d.id} title={d.title} id={d.id} content={d.content} href={d.href}/>);
    }
    return return_html;
  }
}
