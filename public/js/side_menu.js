import React from "react";
import {SegueAnyToFolder, SegueAnyToFolderList} from "./segue";
import {db} from "./firebase";


export default class SideMenu extends React.Component{
  homeClicked(){
    history.pushState('','',"feed")
    let list = []
    db.collection("urlset").get().then(snap => {
      let d;
      let for_saved_list = []
      for(let i of snap.docs){
        d = i.data()
        d.id = i.id
        list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };  
      sessionStorage.urlset_list = for_saved_list.join("-@-"); // @platong save list at urlset_list
      ReactDOM.unmountComponentAtNode(document.getElementById("container"))
      ReactDOM.render(<SegueAnyToFolder list={list}/>, document.getElementById("container"));
      for(let d of list){
        $("#" + d.id ).css("background-image", "url(" + d.img + ")")
      }   
    });
  }
  folderClicked(){
    history.pushState('','',"folders")
    let list = []
    let aId = localStorage.getItem("accountId")
    db.collection("account").doc(aId).collection("folders").get().then(snap1 => {
      let d;
      let for_saved_list = []
      for(let i of snap1.docs){
        d = i.data()
        d.id = i.id
        d.kind = "folders"
        list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };  
      db.collection("account").doc(aId).collection("myfreefolders").get().then(snap2 => {
        let d;
        for(let i of snap2.docs){
          d = i.data()
          d.id = i.id
          d.kind = "myfreefolders"
          list.push(d)
          for_saved_list.push(JSON.stringify(d))
        };  
        sessionStorage.urlset_list = for_saved_list.join("-@-"); 
        ReactDOM.unmountComponentAtNode(document.getElementById("container"))
        ReactDOM.render(<SegueAnyToFolderList list={list} />, document.getElementById("container"))
        for(let d of list){
          $("#" + d.id ).css("background-image", "url(" + d.img + ")")
        }
      })
    })
  }
  render(){
    return(
      <ul className="list-nav">
        <a href={"/account?aId=" + localStorage.getItem("accountId")}>Profile</a>
        <a onClick={this.homeClicked}>Home</a>
        <a onClick={this.folderClicked}>folders</a>
        <a href="">通知</a>
        <a href="">説明書</a>
      </ul>
    )
  }
}
