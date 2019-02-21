import {segueAnyToURLPostFolderChoice, segueFolderFeed, segueFolderFeedToPostFolder, segueURLPost} from "./segue";
import {ViewPostFolder, ViewURLFeed} from "./view";
import generateUuid from "./uuid";
import {db, storage, auth} from "./firebase";
import {sideMenuButtonShift} from "./side_menu";
import {imgCompressor, submitImgToCloudStorage} from "./img_compressor";


function closePostView(){ 
  segueFolderFeed()
}


// @platong If the folder form can submit, return true.
function folderSubmitValidation(){
  let title = document.getElementById("ap_panel_title").value;
  let file = document.urlset_form.urlbook_img.files[0];
  if(title!=="" && file!==undefined)
    return true;
  return false;
}


// @platong If the url form can submit, return true.
function urlSubmitValidation(){
  return true;
}


// @platong Change button color if the form can submit.
function buttonActiveSwitch(){
  if(folderSubmitValidation()){
    $("#ap_submit").addClass("submit_is_active");
    $("#ap_submit").removeClass("submit_is_disactive");
  }else{
    $("#ap_submit").removeClass("submit_is_active");
    $("#ap_submit").addClass("submit_is_disactive");
  }
}


// @platong Change button color if the form can submit.
function urlSubmitActiveSwitch(){
  if(urlSubmitValidation()){
    $("#url_submit").addClass("submit_is_active");
    $("#url_submit").removeClass("submit_is_disactive");
  }else{
    $("#url_submit").removeClass("submit_is_active");
    $("#url_submit").addClass("submit_is_disactive");
  }
}


class AddButton extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      "kind": undefined
    }
    switch(props.icon){
      case "+":
        this.state.kind = "fa fa-plus";
        break;
      case "folder":
        this.state.kind = "fa fa-folder-plus";
        break;
      case "url":
        this.state.kind = "fa far fa-code";
        break;

      default:
        this.state.kind = "fa"
      break
    }
  }
  render(){
    return( <button id="add_button" key="addButtons" className={this.state.kind} onClick={this.props.func}></button>);
  }
}


// @platong Appear if plus button is tapped or clicked.
class AddPanel extends React.Component{
  folderCreate(){
    history.pushState('','',"folders")
    let aId = localStorage.getItem("accountId")
    let for_saved_list = []
    let list = []
    db.collection("account").doc(aId).collection("folders").get().then(snap => {
      for(let i of snap.docs){
        let d = i.data()
        d.id = i.id
        list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };
      return db.collection("account").doc(aId).collection("myfreefolders").get()
    }).then(snap => {
      for(let i of snap.docs){
        let d = i.data()
        d.id = i.id
        list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };
      sessionStorage.urlset_list = for_saved_list.join("-@-");
      sideMenuButtonShift("folders")
      ReactDOM.render(<ViewPostFolder key="AddPanelView" list={list}/>, document.getElementById("main__container"));
      ReactDOM.render(<AddButton func={segueFolderFeedToPostFolder} icon={"folder"} key="AddPanelAddButton"/>,
        document.getElementById("utility__area"))
      for(let d of list){
        $("#" + d.id ).css("background-image", "url(" + d.img + ")")
      }
    })
  }
  urlCreate(){
    sideMenuButtonShift("folders")
    segueAnyToURLPostFolderChoice()
  }
  render(){
    return(
      <div className="add_view">
        <div className="add_panel" onClick={this.folderCreate}>
          <h3>Add folder</h3>
          <p>URLを管理するフォルダを作成</p>
        </div>
        <div className="add_panel" onClick={this.urlCreate}>
          <h3>Add URL</h3>
          <p>URLをフォルダに追加</p>
        </div>
      </div>
    );
  }
}


// @platong register URL
class URLPost extends React.Component{
  constructor(props){
    super(props)
    this.state = { 
      id: props.id,
      ownerAId: props.ownerAId,
      count: 0
    }
    this.singleURLSubmit.bind(this)
  }
  urlConverter(num){
    let selector1 = 'input[name="url' + num + '"]'
    let url = $(selector1).val()
    $.ajax({
      url:"/api_v1/url_to_title",
      type:'GET',
      data:{ "url": url }
    })
    .done(data => {
      let selector2 = 'input[name="title' + num + '"]'
      $(selector2).val(data.title)
    })
    .fail( console.error("Error something bug is occured. Please contact us to inform this.") )
  }
  getChanged(){ urlSubmitActiveSwitch(); }
  singleURLSubmit(i){
    let aId = localStorage.accountId
    let t_id = this.state.id
    let user = auth.currentUser;
    let ownerAId = this.state.ownerAId

    let url = $('input[name="url' + i + '"]').val()
    let title = $('input[name="title' + i + '"]').val()
    if(url === "" || title === "") return
    let data = {
      title: title,
      content: "",
      href: url,
      aId: aId,
      aProfileImg: user.photoURL,
      aName: user.displayName,
      dateTime: new Date()
    }
    if(ownerAId === aId){
      return db.collection("account").doc(aId).collection("myfreefolders").doc(t_id).collection("urls").add(data).then(docRef => {
		data.id = docRef.id
		return data
      }).catch(error => {
        console.error("Error adding URL: ", error);
      });
    }else{
      let myfolderRef = db.collection("account").doc(aId).collection("myfreefolders").doc(t_id)
      return myfolderRef.get().then(snap => {
        if(snap.exists){
          return db.collection("account").doc(aId).collection("myfreefolders").doc(t_id).collection("urls").add(data)
		}else{
          return db.collection("freefolder").doc(t_id).get().then(snap => {
            return db.collection("account").doc(aId).collection("myfreefolders").doc(t_id).set(snap.data())
          }).then(docRef => {
            return db.collection("account").doc(aId).collection("folders").doc(t_id).delete()
          }).then(() => {
            return db.collection("freefolder").doc(t_id).collection("urls").get()
          }).then(snaps => {
            return snaps.forEach(x => {
              db.collection("account").doc(aId).collection("myfreefolders").doc(t_id)
                .collection("urls").doc(x.id).set(x.data())
            })
          }).then(res => {
            return db.collection("account").doc(aId).collection("myfreefolders").doc(t_id).collection("urls").add(data)
          })
        }
      }).then(docRef => {
        let url = $('input[name="url' + i + '"]').val()
        let title = $('input[name="title' + i + '"]').val()
        let user = auth.currentUser
        return {
	      id: docRef.id,
          title: title,
          content: "",
          href: url,
          aId: aId,
          aProfileImg: user.photoURL,
          aName: user.displayName,
          dateTime: new Date()
        }
      }).catch(error => {
          console.error("Error adding URL: ", error);
        });
      }
  }
  urlputSubmit(){
	let promises = []
    for(let i=0; i<=this.state.count; i++){
      promises.push(this.singleURLSubmit(i))
	}
    this.state.count = 0
	Promise.all(promises).then(resultLists => {
      console.log(resultLists)
      let query = location.search
      let hash = query.slice(1).split("&")
      var parameters = []
      hash.map(x => {
        let array = x.split("=")
        parameters.push(array[0])
        parameters[array[0]] = array[1]
      })
      let id = parameters["id"]
      let list = sessionStorage.url_list.split("-@-").map(x => { return JSON.parse(x)})
      Array.prototype.push.apply(list, resultLists);
      ReactDOM.render(<ViewURLFeed key="segueUrlFeed" id={id} list={list}/>, document.getElementById("main__container"))
	})
  }
  morePost(){
    ++this.state.count
    let element = document.createElement("div")
    element.setAttribute("id", "url_input" + this.state.count)
    document.getElementById("url_input").appendChild(element)
    ReactDOM.render(<URLInput num={this.state.count} />, document.getElementById("url_input" + this.state.count))
  }
  render(){
    return ([
      <div className="window-overlay" onClick={closePostView} key="urlPostOverlay"></div>,
      <div className="post__container" key="urlPostcontainer">
        <h1 className="view-title">URLを登録</h1>
        <form name="urlput_form">
          <div id="url_input">
            <div id="url_input0">
              <input name="url0" type="text" onInput={this.urlConverter.bind(this, 0)} placeholder="URLを入力" required/>
              <input name="title0" type="text" placeholder="タイトル（自動入力）" onInput={this.getChanged} required/>
            </div>
          </div>
          <input type="button" onClick={this.urlputSubmit.bind(this)} value="登録" className="post__submit submit_is_disactive" id="url_submit"/>
        </form>
        <input type="button" onClick={this.morePost.bind(this)} value="さらにURLを登録" className="" />
      </div>
    ]);
  }
}


class URLInput extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      urlName: "url" + this.props.num,
      titleName: "title" + this.props.num
    }
  }
  urlConverter(num){
    let selector1 = 'input[name="url' + num + '"]'
    let url = $(selector1).val()
    $.ajax({
      url:"/api_v1/url_to_title",
      type:'GET',
      data:{ "url": url }
    })
    .done(data => {
      let selector = 'input[name="title' + num + '"]'
      $(selector).val(data.title)
    })
    .fail( console.error("Error something bug is occured. Please contact us to inform this.") )
  }
  render(){
    return(
      <div>
        <input name={this.state.urlName} type="text" onInput={this.urlConverter.bind(this, this.props.num)} placeholder="URLを入力" required/>
        <input name={this.state.titleName} type="text" placeholder="タイトル（自動入力）" required/>
      </div>
    )
  }
}


class URLFolderPost extends React.Component{
  submit(){
    let firestoreUpload = function(downloadURL) { 
      let user = auth.currentUser;
      let aId = localStorage.getItem("accountId")
      let ref = db.collection("account").doc(aId).collection("myfreefolders")
      ref.add({
        img: downloadURL,
        name: document.urlset_form.title.value,
        aId: localStorage.getItem("accountId"),
        aProfileImg: user.photoURL,
        aName: user.displayName,
        dateTime : new Date()
      }).then(docRef => {
        closePostView()
      }).catch(error => {
        console.error("Error adding document: ", error);
      })
    }
    submitImgToCloudStorage(document.urlset_form.urlbook_img, "urlset_images", firestoreUpload)
  }
  // @platong If file is changed, file will be compressed.
  fileChanged(){
    imgCompressor(document.urlset_form.urlbook_img, $('#ap_preview'), 192, false)
  }
  render(){
    return ([
      <div className="window-overlay" onClick={closePostView} key="urlFolderPostOverlay"></div>,
      <div className="post__container"key="urlFolderPostContainer">
        <h1 className="view-title">URLを入れるフォルダを作成</h1>
        <form action="" name="urlset_form">
          <div className="post-folder__preview">
            <canvas id="ap_preview" className="post-folder__folder" width="0" height="0"></canvas>
            <span className="post-folder__upload-message">画像を選択する</span>
            <input id="ap_select_img"  className="post-folder__image" name="urlbook_img" type="file" onChange={this.fileChanged} />
            <input id="ap_panel_title" className="post-folder__title" name="title" type="text" onInput={buttonActiveSwitch} placeholder="タイトルを入力" required/>
          </div>
          <div className="post-folder__sub">
            <input type="checkbox" name="paid" id="post-folder__sell"/><label htmlFor="paid">販売する</label>
          </div>
          <div className="sell__section">
            <input type="text" name="price" /><label htmlFor="price">円</label>
          </div>
          <input type="button" onClick={this.submit} value="作成" className="post__submit submit_is_disactive" id="ap_submit" />
        </form>
      </div>,
    ]);
  }
}

export {AddButton, AddPanel, URLFolderPost, URLPost}
