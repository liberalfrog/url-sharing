import React from 'react';
import Urls from './url';

firebase.initializeApp({
  apiKey: "AIzaSyDifH0dRKR2w8XRZIeXgKOZANnP3iv2qsc",
  authDomain: "urlsharing-541c7.firebaseapp.com",
  databaseURL: "https://urlsharing-541c7.firebaseio.com",
  projectId: "urlsharing-541c7",
  storageBucket: "urlsharing-541c7.appspot.com",
  messagingSenderId: "756728507687"
});

const db = firebase.firestore();
const storage = firebase.storage();


// @platong component of a urlset
class Folder extends React.Component {
putShow(){
  let list = []
    let d
    db.collection("urlset").doc(this.props.id).collection("urlputs").get().then((querysnapShots) => {
      for(var i of querysnapShots.docs){
        d = i.data()
        d.id = i.id
        if(d.aId === undefined){
          d.aId = ""
          d.aProfileImg = ""
          d.aName = ""
        }
        list.push(d)
      };
      history.pushState('','',"?id=" + this.props.id);
      window.addEventListener('popstate', function(e) {
        const pathname = location.pathname
        if(pathname === "/feed" || pathname === "/feed/"){
          init()
        }
      });
      urlputShow(list);
    });
  }
  render(){
    return (
      <div className="urlset_panel" id={this.props.id}>
        <a href={"/account?aId=" + this.props.aId}><img src={this.props.aProfileImg} className="account_profile_img" /></a>
        <h3>{this.props.name}</h3>
        <p className="account_name">{this.props.aName}</p>
        <a className="rigidFolder" onClick={() => this.putShow()}></a>
      </div>
    )
  }
}


export default class Folders extends React.Component {
  constructor(props){
    super()
    this.state = {
      list: props.list
    };
  }
  render(){
    var return_html = []
    for(let d of this.state.list){
      return_html.push( <Folder key={d.id} name={d.name} aName={d.aName} aId={d.aId} aProfileImg={d.aProfileImg} id={d.id}/>);
    }
    return return_html;
  }
}


function urlputShow(list){
  ReactDOM.render( <Urls list={list}/>, document.getElementById("container"));
}


function init(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("Hello world");
    } else {
      var redirect_url = "/" + location.search;
      if (document.referrer) {
        var referrer = "referrer=" + encodeURIComponent(document.referrer);
        redirect_url = redirect_url + (location.search ? '&' : '?') + referrer;
      }
      location.href = redirect_url;
    }
  });

  db.collection("urlset").get().then((querysnapShots) => {
    let d;
    let list = []
    let for_saved_list = []
    for(var i of querysnapShots.docs){
      d = i.data()
      d.id = i.id
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    };
    folderShow(list);
    sessionStorage.urlset_list = for_saved_list.join("-@-"); // @platong save list at urlset_list
  });
}

var folderShow = function(list){
  ReactDOM.render( <Folders list={list}/>, document.getElementById("container"));
  for(let d of list){
    $("#" + d.id ).css("background-image", "url(" + d.img + ")")
  }
}
