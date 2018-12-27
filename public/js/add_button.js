import {SegueAnyToFolderList, SegueAnyToFolderPost, SegueAnyToUrlPostFolderChoice} from "./segue";
import {db, storage, auth} from "./firebase";


// @platong For compressed image
const THUMBNAIL_HEIGHT = 100;


function closePostView(){ 
  let list = sessionStorage.urlset_list.split("-@-")
  for(let i=0; i<list.length; i++){
    list[i] = JSON.parse(list[i])
  }
  ReactDOM.render(<SegueAnyToFolderList list={list} />, document.getElementById("container"));
  for(let d of list){
    $("#" + d.id ).css("background-image", "url(" + d.img + ")")
  }
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
  let url = document.urlput_form.url.value;
  let title = document.urlput_form.title.value;
  if(url !== "" && title !== "")
    return true;
  return false;
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


function blobToFile(theBlob, fileName){
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}


class AddButton extends React.Component{
  render(){
    return( <button id="add_button" onClick={this.props.func}>{this.props.icon}</button>);
  }
}


// @platong Appear if plus button is tapped or clicked.
class AddPanel extends React.Component{
  folderCreate(){
    let list = []
    let aId = localStorage.getItem("accountId")
    db.collection("account").doc(aId).collection("folders").get().then(snap1 => {
      let d;
      let for_saved_list = []
      for(let i of snap1.docs){
        d = i.data()
        d.id = i.id
        list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };
      db.collection("account").doc(aId).collection("myfreefolders").get().then(snap2 => {
        for(let i of snap2.docs){
          d = i.data()
          d.id = i.id
          list.push(d)
          for_saved_list.push(JSON.stringify(d))
        };
        sessionStorage.urlset_list = for_saved_list.join("-@-");
        ReactDOM.render(<SegueAnyToFolderPost list={list}/>, document.getElementById("container"));
        for(let d of list){
          $("#" + d.id ).css("background-image", "url(" + d.img + ")")
        }
      })
    })
  }
  urlCreate(){
    let list = []
    let aId = localStorage.getItem("accountId")
    db.collection("account").doc(aId).collection("folders").get().then(snap1 => {
      let d;
      let for_saved_list = []
      for(let i of snap1.docs){
        d = i.data()
        d.id = i.id
        list.push(d)
        for_saved_list.push(JSON.stringify(d))
      };
      db.collection("account").doc(aId).collection("myfreefolders").get().then(snap2 => {
        for(let i of snap2.docs){
          d = i.data()
          d.id = i.id
          list.push(d)
          for_saved_list.push(JSON.stringify(d))
        };
        sessionStorage.urlset_list = for_saved_list.join("-@-");
        ReactDOM.render(<SegueAnyToUrlPostFolderChoice list={list}/>, document.getElementById("container"));
        for(let d of list){
          $("#" + d.id ).css("background-image", "url(" + d.img + ")")
        }
      })
    })
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
class UrlPost extends React.Component{
  constructor(props){
    super(props)
    this.state = { 
      id: props.id,
      ownerAId: props.ownerAId,
      count: 0
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
  getChanged(){ urlSubmitActiveSwitch(); }
  urlputSubmit(){
    let aId = localStorage.accountId
    let t_id = this.state.id
    let user = auth.currentUser;
    let ownerAId = this.state.ownerAId

    for(let i=0; i<=this.state.count; i++){
      let url = $('input[name="url' + i + '"]').val()
      let title = $('input[name="title' + i + '"]').val()

      if(url === "" || title === "")
        continue

      let data = {
        title: title,
        content: "URLのコンテンツの概要は、現行のバージョンでは表示されません",
        href: url,
        aId: aId,
        aProfileImg: user.photoURL,
        aName: user.displayName,
        dateTime: new Date()
      }

      if(ownerAId === aId){
        db.collection("account").doc(aId).collection("myfreefolders").doc(t_id).collection("urls").add(data)
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
          closePostView()
        }).catch(function(error) {
          console.error("Error adding document: ", error);
        });
      }else{
        let myfolderRef = db.collection("account").doc(aId).collection("myfreefolders").doc(t_id)
  
        myfolderRef.get().then(snap => {
          if(snap.exists){
            return db.collection("account").doc(aId).collection("myfreefolders").doc(t_id).collection("urls").add(data)
          }else{
            return db.collection("freefolder").doc(t_id).get().then(snap => {
              return db.collection("account").doc(aId).collection("myfreefolders").doc(t_id).set(snap.data())
            }).then(docRef => {
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
          console.log("Document written with ID: ", docRef.id);
        }).catch(error => {
          console.error("Error adding document: ", error);
        });
      }
      closePostView()
    }
    this.state.count = 0
  }
  morePost(){
    ++this.state.count
    let element = document.createElement("div")
    element.setAttribute("id", "url_input" + this.state.count)
    document.getElementById("url_input").appendChild(element)
    ReactDOM.render(<UrlInput num={this.state.count} />, document.getElementById("url_input" + this.state.count))
  }
  render(){
    return (
      <div>
        <div className="window-overlay" onClick={closePostView}></div>
        <div className="post__container">
          <form name="urlput_form">
            <div id="url_input">
              <div id="url_input0">
                <input name="url0" type="text" onInput={this.urlConverter.bind(this, 0)} placeholder="URLを入力" required/>
                <input name="title0" type="text" placeholder="タイトル（自動入力）" onInput={this.getChanged} required/>
              </div>
            </div>
            <input type="button" onClick={this.urlputSubmit.bind(this)} value="登録" className="submit_is_disactive" id="url_submit"/>
          </form>
          <input type="button" onClick={this.morePost.bind(this)} value="さらにURLを登録" className="" />
        </div>
      </div>
    );
  }
}


class UrlInput extends React.Component{
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


var blob = null;
class UrlFolderPost extends React.Component{
  submit(){
    let file = document.urlset_form.urlbook_img.files[0]
    if(!folderSubmitValidation() && !blob) return; // validation
    let storageRef = storage.ref();
    let imagesRef = storageRef.child('urlset_images');
    const file_name = file.name
    file = blobToFile(blob)
    var ref = storageRef.child('urlset_images/' + file_name);
    var uploadTask = ref.put(file)
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
    function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
      }
    }, function(error) { // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized': 
          break;
        case 'storage/canceled': 
          break;
        case 'storage/unknown': 
          break;
      }
    }, function() { 
      let user = auth.currentUser;
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        let aId = localStorage.getItem("accountId")
        let ref = db.collection("account").doc(aId).collection("myfreefolders")

        ref.add({
          img: downloadURL,
          name: document.urlset_form.title.value,
          aId: localStorage.getItem("accountId"),
          aProfileImg: user.photoURL,
          aName: user.displayName,
          dateTime : new Date()
        }).then(function(docRef) {
          closePostView()
        }).catch(function(error) {
          console.error("Error adding document: ", error);
        });
        let listStr =  sessionStorage.urlset_list
        let list 
        if(listStr !== "")
          list = listStr.split("-@-").map(x => JSON.parse(x))
        else
          list = []
        ReactDOM.render(<SegueAnyToFolderList list={list}/>, document.getElementById("container"));
      });
    });
  };
  // @platong If file is changed, file will be compressed.
  fileChanged(){
    let file = document.urlset_form.urlbook_img.files[0]
    if (file.type != 'image/jpeg' && file.type != 'image/png') {
      file = null;
      blob = null;
      return;
     alert("画像でないものはアップロードできません。対応形式はjpegかpngです。");
    }
    var image = new Image();
    var reader = new FileReader();
  
    reader.onload = function(e) {
      image.onload = function() {
        var width, height;
        if(image.width > image.height){
          var ratio = image.width/ image.height;
          width = THUMBNAIL_HEIGHT * ratio;
          height = THUMBNAIL_HEIGHT;
        } else {
          alert("縦長の画像はアップロードできません");
          return
        }
        var canvas = $('#ap_preview').attr('width', width).attr('height', height);
        var ctx = canvas[0].getContext('2d');
        ctx.clearRect(0,0,width,height);
        ctx.drawImage(image,0,0,image.width,image.height,0,0,width,height);
  
        var base64 = canvas.get(0).toDataURL('image/jpeg');
        var barr, bin, i, len;
        bin = atob(base64.split('base64,')[1]);
        len = bin.length;
        barr = new Uint8Array(len);
        i = 0;
        while (i < len) {
          barr[i] = bin.charCodeAt(i);
          i++;
        }
        blob = new Blob([barr], {type: 'image/jpeg'});
      }
      image.src = e.target.result;
    }
    reader.readAsDataURL(file);
    buttonActiveSwitch()
  }
  render(){
    return (
      <div>
        <div className="window-overlay" onClick={closePostView}></div>
        <div className="post__container">
          <h1>URLを入れるフォルダを作成</h1>
          <form action="" name="urlset_form">
            <div className="post-folder__preview">
              <canvas id="ap_preview" className="post-folder__folder" width="0" height="0"></canvas>
              <span className="post-folder__upload-message">画像を選択する</span>
              <input id="ap_select_img"  className="post-folder__image" name="urlbook_img" type="file" onChange={this.fileChanged} />
              <input id="ap_panel_title" className="post-folder__title" name="title" type="text" onInput={buttonActiveSwitch} placeholder="タイトルを入力" required/>
            </div>
            <input type="checkbox" name="paid" id="post-folder__sell"/><label htmlFor="paid">販売する</label>
            <div className="sell__section">
              <input type="text" name="price" /><label htmlFor="price">円</label>
            </div>
            <input type="button" onClick={this.submit} value="作成" className="post__submit submit_is_disactive" id="ap_submit" />
          </form>
        </div>
      </div>
    );
  }
}

export {AddButton, AddPanel, UrlFolderPost, UrlPost}
