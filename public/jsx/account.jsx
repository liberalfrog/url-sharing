import React from 'react';
import Folders from '../../component/folder';
import {storage, db} from "../../component/firebase";
import {imgCompressor} from "../../component/img_compressor";
import queryParser from "../../lib/query_parser";
import {backBefore} from "../../lib/spa_router";


// @plaong Use session storage ( like a iOS user defaults )
// 2019-2-18 Had better use indexedDB!!

window.addEventListener('popstate', function(e) {
  backBefore(true)
});

var isFollow

init()

function init(){
  let targetAId = queryParser().aId
  let aId = localStorage.getItem("accountId")
  let queryToFollow = db.collection("account").doc(aId).collection("followees").doc(targetAId)

  db.collection("account").doc(targetAId).get().then(snap => {
    let d = snap.data();
    document.getElementById("account_profile_img").src =  d.img;
    document.getElementById("account_name").innerHTML= d.name;
    document.getElementById("account_intro").innerHTML= d.intro;
    document.getElementById("follow__number").innerHTML= d.followee;
    document.getElementById("follower__number").innerHTML= d.follower;
    document.getElementById("account_twitter").getAttribute('href') = d.twitter;
    document.getElementById("account_facebook").getAttribute('href') = d.facebook;
    document.getElementById("account_instagrm").getAttribute('href') = d.instagram;
    document.getElementById("account_github").getAttribute('href') = d.github;
    document.getElementById("account_others").getAttribute('href') = d.others;
  });

  if(aId === targetAId){
    $("#button_follow").css("display","none");
    document.getElmentById("buttonDeatil").innerHTML = "編集する"
    // TKM buttonDetail's id changes buttonedit.
    $("#changer__ap__profile-img").removeClass("changer__ap__profile-img");
    $("#changer__ap__profile-img").addClass("edit-active__ap__profile-img");
    $(".ap__profile-img__container").addClass("edit-active__ap__profile-img__container");
  }

// @TKM 編集ボタンのクリック時処理
  $("#button_edit").on("click", function(){
// @TKM 初期値valueに既存データ設置
    $("edit_box", "bb").css("display" : "block")
  });

// @TKM save button
  $(".edi__save").on("click", function(){
    let aId = localStorage.getItem("accountId")
    let bId = $(this).attr("id");
    let type = bId.substr(3);
    let iId = "edit_" + type;
    let value = document.getElementById(iId).value
  $.ajax({
	  async: true,
	  url: "/api_v1/changeProfile", 
	  type: "POST", 
	  data: {
		  aId: aId, 
		  type: type, 
		  value: value
	  }
        }).done(function(){
	  let aT = "account_" + type
	  if(type === "name" || "intro")
	    $(aT).innerHTML = value
	  else
	    $(aT).getAttribute('href') = value
	}).fail(function(){
	  alert(type + "'s change is failed.")
	});
    $("edit_box", "bb").css("display" : "none")
  });

// @TKM cancel button
  $("#edit_cancel").on("click", function(){
    $("edit_box", "bb").css("display" : "none")
  })



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
    let d;\
    let list = []\
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

let fileChanged = function(){
  imgCompressor(document.getElementById("changer__ap__profile-img"), $("#preview"), 192, true)
}

document.getElementById("changer__ap__profile-img").addEventListener("change", fileChanged, false)
