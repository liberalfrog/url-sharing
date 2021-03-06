import React from 'react';
import Folders from '../component/folder';
import {storage, db} from "../component/firebase";
import {imgCompressor} from "../component/img_compressor";
import queryParser from "../lib/query_parser";
import {backBefore} from "../lib/spa_router";


// @plaong Use session storage ( like a iOS user defaults )
// 2019-2-18 Had better use indexedDB!!

window.addEventListener('popstate', function(e) {
  backBefore(true)
});

var isFollow
let aId = queryParser().aId
let myAId = localStorage.getItem("accountId")

init()

function init(){
  let queryToFollow = db.collection("account").doc(myAId).collection("followees").doc(aId)

  db.collection("account").doc(aId).get().then(snap => {
    let d = snap.data();
    document.getElementById("account_profile_img").src =  d.img;
    document.getElementById("account_name").innerHTML= d.name;
    document.getElementById("account_intro").innerHTML= d.intro;
    document.getElementById("follow__number").innerHTML= d.followee;
    document.getElementById("follower__number").innerHTML= d.follower;
  });

  if(aId === myAId){
    $("#button_follow").css("display","none");
    $("#changer__ap__profile-img").removeClass("changer__ap__profile-img");
    $("#changer__ap__profile-img").addClass("edit-active__ap__profile-img");
    $(".ap__profile-img__container").addClass("edit-active__ap__profile-img__container");
  }

  queryToFollow.get().then(snap => {
    if(snap.exists){
      isFollow = true
      document.getElementById("button_follow").innerHTML = "フォロー中"
    }else{
      isFollow = false
      document.getElementById("button_follow").innerHTML = "フォローする"
    }
  })

  // @platong  アカウントのURLフォルダを表示
  db.collection("account").doc(aId).collection("myfreefolders").get().then(snap => {
    let d;
    let list = []
    let for_saved_list = []
    for(let i of snap.docs){
      d = i.data()
      d.id = i.id
      d.kind = "freefolder"
      list.push(d)
    }
    ReactDOM.render( <div className="container__wrapper"><Folders list={list}/></div>, document.getElementById("container"));
    for(let d of list){
      $("#" + d.id ).css("background-image", "url(" + d.img + ")")
    }
  });
}


// @platong Follow button
$("#button_follow").on("click", () => {
  let queryToFollow = db.collection("account").doc(myAId).collection("followees").doc(aId)

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
    db.collection("account").doc(aId).get().then(snap => {
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

let fileChanged = function(){
  imgCompressor(document.getElementById("changer__ap__profile-img"), $("#preview"), 192, true)
}

document.getElementById("changer__ap__profile-img").addEventListener("change", fileChanged, false)
