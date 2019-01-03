import React from 'react';
import Folders from '../js/folder';
import {storage, db} from "../js/firebase";
import {fileChanged} from "../js/img_compresser";

var isFollow

init()

function init(){
  let targetAId = location.search.substring(1).split('=')[1];
  let aId = localStorage.getItem("accountId")
  let queryToFollow = db.collection("account").doc(aId).collection("followees").doc(targetAId)

  db.collection("account").doc(targetAId).get().then(snap => {
    let d = snap.data();
    document.getElementById("account_profile_img").src =  d.img;
    document.getElementById("account_name").innerHTML= d.name;
    document.getElementById("account_intro").innerHTML= d.intro;
  });

  queryToFollow.get().then(snap => {
    if(snap.exists){
      isFollow = true
      document.getElementById("button_follow").innerHTML = "フォロー中"
    }else{
      isFollow = false
      document.getElementById("button_follow").innerHTML = "フォロー"
    }
  })

  // @platong  アカウントのURLフォルダを表示
  db.collection("account").doc(targetAId).collection("myfreefolders").get().then(snap => {
    let d;
    let list = []
    let for_saved_list = []
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      list.push(d)
    }
    ReactDOM.render( <div className="container__wrapper"><Folders list={list}/></div>, document.getElementById("container"));
    for(let d of list){
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
  });
}


// @platong Follow button
$("#button_follow").on("click", function(){
  let targetAId = location.search.substring(1).split('=')[1];
  let aId = localStorage.getItem("accountId")
  let queryToFollow = db.collection("account").doc(aId).collection("followees").doc(targetAId)

  if(isFollow){
    queryToFollow.delete().then(() => {
      return db.collection("account").doc(aId).get()
    }).then(snap => {
      let data = snap.data()
      data.followee =  data.followee - 1
      return db.collection("account").doc(aId).set(data)
    }).then(() => {
      document.getElementById("button_follow").innerHTML = "フォロー"
      isFollow = false
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }else{
    db.collection("account").doc(targetAId).get().then(snap => {
      let d = snap.data()
      queryToFollow.set({
        name: d.name,
        profile_img: d.img
      }).then(() => {
        return db.collection("account").doc(aId).get()
      }).then(snap => {
        let data = snap.data()
        data.followee =  data.followee + 1
        return db.collection("account").doc(aId).set(data)
      }).then(() => {
        document.getElementById("button_follow").innerHTML = "フォロー中"
        isFollow = true
      }).catch(function(error) {
        console.error("Error adding document: ", error);
      });
    });
  }
});


var inputElement = document.getElementById("changer__profile-img");
inputElement.addEventListener("change", fileChanged, false);
inputElement.fileDomObj = document.getElementById("changer__profile-img");
inputElement.canvasDomObj = $("#preview");
