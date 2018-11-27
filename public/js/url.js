import React from 'react';

class Url extends React.Component {
  render(){
    return (
      <div className="urlput_panel">
        <class="text_overflow_url">
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
