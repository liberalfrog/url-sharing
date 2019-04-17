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
    document.getElementById("account_twitter").setAttribute("href", d.twitter);
    document.getElementById("account_facebook").setAttribute("href", d.facebook);
    document.getElementById("account_instagrm").setAttribute("href", d.instagram);
    document.getElementById("account_github").setAttribute("href", d.github);
    document.getElementById("account_others").setAttribute("href", d.others);
  });

  if(aId === targetAId){
    $("#button_follow").css("display","none");
    $("#changer__ap__profile-img").removeClass("changer__ap__profile-img");
    $("#changer__ap__profile-img").addClass("edit-active__ap__profile-img");
    $(".ap__profile-img__container").addClass("edit-active__ap__profile-img__container");
  }else{
   $("#button_edit").css("display","none");
  }

// @TKM 編集ボタンのクリック時処理
  $("#button_edit").on("click", function(){
    $("#edit_box").css("display", "block");
    $("#bb").css("display", "block");
  });

// @TKM save button
  $(".edi__save").on("click", function(){
    let aId = localStorage.getItem("accountId")
    let bId = $(this).attr("id");
    let type = bId.substr(3);
    let eId = "edit_" + type
    let value = document.getElementById(eId).value
   switch(type){

      case'name':
        $.ajax({
	  async: true,
	  url: "./api_v1/changeProfileName", 
	  type: "POST", 
	  data: {
    	    aId: aId, 
	    value: value
	  }
        }).done(function(){
          document.getElementById("account_name").innerHTML = value;
        }).fail(function(){
	  alert("Name's change is failed.")
        });
        break;

      case'intro':
        $.ajax({
	  async: true,
	  url: "./api_v1/changeProfileIntro", 
	  type: "POST", 
	  data: {
    	    aId: aId, 
	    value: value
	  }
        }).done(function(){
          document.getElementById("account_intro").value = value;
        }).fail(function(){
	  alert("Introduction's change is failed.")
        });
        break;

      case'twitter':
        $.ajax({
	  async: true,
	  url: "./api_v1/changeProfileTwitter", 
	  type: "POST", 
	  data: {
    	    aId: aId, 
	    value: value
	  }
        }).done(function(data){
          document.getElementById("account_twitter").serAttribute('href', value);
        }).fail(function(){
	  alert("Twitter's change is failed.")
        });
        break;

      case'facebook':
        $.ajax({
	  async: true,
	  url: "./api_v1/changeProfileFacebook", 
	  type: "POST", 
	  data: {
    	    aId: aId, 
	    value: value
	  }
        }).done(function(data){
          document.getElementById("account_facebook").serAttribute('href', value);
        }).fail(function(){
	  alert("Facebook's change is failed.")
        });
        break;

      case'github':
        $.ajax({
	  async: true,
	  url: "./api_v1/changeProfileGithub", 
	  type: "POST", 
	  data: {
    	    aId: aId, 
	    value: value
	  }
        }).done(function(data){
          document.getElementById("account_github").serAttribute('href', value);
        }).fail(function(){
	  alert("Github's change is failed.")
        });
        break;

      case'instagram':
        $.ajax({
	  async: true,
	  url: "./api_v1/changeProfileInstagram", 
	  type: "POST", 
	  data: {
    	    aId: aId, 
	    value: value
	  }
        }).done(function(data){
          document.getElementById("account_instagram").serAttribute('href', value);
        }).fail(function(){
	  alert("Instagram's change is failed.")
        });
        break;

      case'others':
        $.ajax({
	  async: true,
	  url: "./api_v1/changeProfileOthers", 
	  type: "POST", 
	  data: {
    	    aId: aId, 
	    value: value
	  }
        }).done(function(data){
          document.getElementById("account_others").serAttribute('href', value);
        }).fail(function(){
	  alert("Others' change is failed.")
        });
        break;

      default:
        alert('error');
    }
        $("#edit_box").css("display", "none");
        $("#bb").css("display", "none");
  });

// @TKM cancel button
  $("#edit_cancel").on("click", function(){
    $("#edit_box").css("display", "none");
    $("#bb").css("display", "none");
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
