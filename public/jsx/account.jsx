import React from 'react';
import Folders from '../js/folder';

const db = firebase.firestore();
const storage = firebase.storage();

// @platong initialize this page
init()

function init(){
  let aId = location.search.substring(1).split('=')[1];
  db.collection("account").doc(aId).get().then((querysnapShot) => {
    var d = querysnapShot.data();
    // @platong 様々な初期値を設定
    document.getElementById("account_profile_img").src =  d.img;
    document.getElementById("account_name").innerHTML= d.name;
    document.getElementById("account_intro").innerHTML= d.intro;
  });

  // @platong  アカウントのURLフォルダを表示
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


// @platong Follow button
$("#button_follow").on("click", function(){
  let aId = location.search.substring(1).split('=')[1];

  db.collection("account").doc(aId).get().then((querysnapShot) => {
    let d = querysnapShot.data()
    let myAId = localStorage.getItem("accountId")

    db.collection("account").doc(myAId).collection("followees").doc(aId).set({
      name: d.name,
      profile_img: d.img
    }).then(function(){
      console.log("Document written.");
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });
  });
});
