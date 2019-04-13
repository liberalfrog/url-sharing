import {segueAnyToURLPostFolderChoice, segueFolderFeed, segueURLPost} from "./segue";
import {ViewPostFolder, ViewURLFeed} from "./view";
import generateUuid from "./uuid";
import {db, storage, auth} from "./firebase";
import {sideMenuButtonShift} from "./side_menu";
import {imgCompressor, submitImgToCloudStorage} from "./img_compressor";
import {vSegueAddPanel2FolderPost, vSegueAddPanel2FolderChoice, vSegueURLPost2URL, vSegueFolderPost2Folder, vSegueAddPanel2Home} from "./vector_segue";


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
	vSegueAddPanel2FolderPost(false)
  }
  urlCreate(){
    sideMenuButtonShift("folders")
    vSegueAddPanel2FolderChoice(false)
  }
  cancel(){
    vSegueAddPanel2Home(false)
  }
  render(){
    return(
      <div className="add_view">
        <div className="add_panel" onClick={this.folderCreate}>
          <i className="fas fa-folder-plus"></i>
        </div>
        <div className="add_panel" onClick={this.urlCreate}>
          <i className="fas fa-code"></i>
        </div>
        <div className="add_panel" onClick={this.cancel}>
		  <i className="fas fa-times"></i>
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
      urlInputs: [{title: ""}]
    }
    this.urlConverter = this.urlConverter.bind(this)
    this.singleURLSubmit = this.singleURLSubmit.bind(this)
  }
  urlConverter(event, index){
    let url = event.target.value
    $.ajax({
      url:"/api_v1/url_to_title",
      type:'GET',
      data:{ "url": url }
    })
    .done(data => {
      let urlInputs = this.state.urlInputs
      urlInputs[index] = {
        title: data.title,
        url: url
      }
      this.setState({urlInputs: urlInputs})
    })
    .fail( console.error("Error something bug is occured. Please contact us to inform this.") )
  }
  getChanged(){ urlSubmitActiveSwitch(); }
  singleURLSubmit(urlData){
    let aId = localStorage.accountId
    let t_id = this.state.id
    let user = auth.currentUser;
    let ownerAId = this.state.ownerAId

    let url = urlData.url
    let title = urlData.title
    if(!url || !title){
      return
    }
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
      return db.collection("account").doc(aId).collection("myfreefolders")
             .doc(t_id).collection("urls").add(data).then(docRef => {
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
    let promises = this.state.urlInputs.map(x => { return this.singleURLSubmit(x) })
    Promise.all(promises).then(resultLists => {
      sessionStorage.urlpost_uploadURLList = resultLists.filter(x => x !== undefined).map(x => {return JSON.stringify(x)}).join("-@-")
      sessionStorage.urlpost_isUpload = "true"
      vSegueURLPost2URL(false)
    }).catch(e => {
      console.error(e)
    })
  }
  morePost(){
    let urlInputs = this.state.urlInputs
    urlInputs.push({title:""})
    this.setState({urlInputs: urlInputs})
  }
  postCancel(){
    sessionStorage.urlpost_isUpload = ""
    vSegueURLPost2URL(false)
  }
  render(){
    return ([
      <div className="window-overlay" onClick={this.postCancel.bind(this)} key="urlPostOverlay"></div>,
      <div className="post__container" key="urlPostcontainer">
        <h1 className="view-title">URLを登録</h1>
        <form name="urlput_form">
          <div id="url_input">
            { this.state.urlInputs.map((x, i) => {
                return <URLInput key={i} title={x.title} index={i} urlConverter={this.urlConverter} />
              })
            }
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
  }
  render(){
    return(
      <div>
        <input type="text" 
         onInput={(e) => this.props.urlConverter(e, this.props.index)} placeholder="URLを入力" required/>
        <input type="text" value={this.props.title} placeholder="タイトル（自動入力）" required/>
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
	  let folderData = {
        img: downloadURL,
        name: document.urlset_form.title.value,
        aId: localStorage.getItem("accountId"),
        aProfileImg: user.photoURL,
        aName: user.displayName,
        dateTime : new Date()
      }
      ref.add(folderData).then(docRef => { 
	    sessionStorage.folderpost_isUpload = "true"
		sessionStorage.folderpost_uploadFolderData = JSON.stringify(folderData)
        vSegueFolderPost2Folder(true)
      }).catch(error => {
        console.error("Error adding document: ", error);
      })
    }
    submitImgToCloudStorage($("#ap_preview"), "urlset_images", firestoreUpload)
  }
  fileChanged(){
    imgCompressor(document.urlset_form.urlbook_img, $('#ap_preview'), 192, false)
  }
  postCancel(){
	sessionStorage.folderpost_isUpload = ""
    vSegueFolderPost2Folder(false)
  }
  render(){
    return ([
      <div className="window-overlay" onClick={this.postCancel} key="urlFolderPostOverlay"></div>,
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
