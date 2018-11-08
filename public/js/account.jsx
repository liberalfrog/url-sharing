import React from 'react';
import Folders from './folder';

const db = firebase.firestore();
const storage = firebase.storage();

// @platong initialize this page
init()

function init(){
  var aId = location.search.substring(1).split('=')[1];
  db.collection("account").doc(aId).get().then((querysnapShot) => {
    var d = querysnapShot.data();
    console.log(d);
    document.getElementById("account_profile_img").src =  d.img;
    document.getElementById("account_name").innerHTML= d.name;
    document.getElementById("account_intro").innerHTML= d.intro;
  });


  db.collection("account").doc(aId).collection("folders").get().then((querysnapShots2) => {
    let d;
    let list = []
    let for_saved_list = []
    for(let i of querysnapShots2.docs){
      d = i.data()
      d.id = i.id
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    }
    folderShow(list);
  });
}


var folderShow = function(list){
  ReactDOM.render( <Folders list={list}/>, document.getElementById("container"));
  for(let d of list){
    $("#" + d.id ).css("background-image", "url(" + d.img + ")")
  }
}
