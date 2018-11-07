import React from 'react';

class Url extends React.Component {
  render(){
    return (
      <div className="urlput_panel">
        <h3>{this.props.title}</h3>
        <a href={this.props.href}></a>
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
