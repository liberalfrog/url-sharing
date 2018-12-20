import {db} from "./firebase";
import React from 'react';

class Url extends React.Component {
  constructor(props){
    this.state = {
      title: props.title,
      href: props.href,
      content: props.content
    }
  }
  clickHandler(){
    let aId = localStorage.getItem("accountId")
    let data = {
      href: this.state.href,
      date: new Data()
    }
    db.collection("account").doc(aId).collection("page_trackings").add(data);
  }
  render(){
    return (
      <div className="urlput_panel">
        <h3>{this.state.title}</h3>
        <p className="text_overflow_url">
          <a href={this.state.href} target="_blank" onClick={this.clickHandler}></a>
        </p>
        <p className="baloon">{this.state.content}</p>
      </div>
    )
  }
}


export default class Urls extends React.Component {
  constructor(props){
    super()
    this.state = {
      list: props.list
    };
  }
  render(){
    var return_html = []
    for(let [i, d] of this.state.list.entries()){
      return_html.push( <Url key={i} title={d.title} content={d.content} href={d.href}/>);
    }
    return return_html;
  }
}

jQuery(function($){
  $('.textOverflowUrl').each(function() {
    var $target = $(this);

    var html = $target.html();

    var $clone = $target.clone();
    $clone
      .css({
        display: 'none',
        position : 'absolute',
        overflow : 'visible'
      })
      .width($target.width())
      .height('auto');

    $target.after($clone);
    while((html.length>0) && ($clone.height()>$target.height())){
      html = html.substr(0, html.length-1);
      $clone.html(html+'...');
    }

    $target.html($clone.html());
    $clone.remove();
  });
});
