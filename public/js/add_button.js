import {SegueAnyToFolderList} from "./segue";

// @platong For compressed image
var blob = null;
const THUMBNAIL_HEIGHT = 100;

firebase.initializeApp({
  apiKey: "AIzaSyDifH0dRKR2w8XRZIeXgKOZANnP3iv2qsc",
  authDomain: "urlsharing-541c7.firebaseapp.com",
  databaseURL: "https://urlsharing-541c7.firebaseio.com",
  projectId: "urlsharing-541c7",
  storageBucket: "urlsharing-541c7.appspot.com",
  messagingSenderId: "756728507687"
});


// @platong unmount is not obvious.
function closePostView(){ 
  ReactDOM.unmountComponentAtNode(document.getElementById("post_add_view")); 
  ReactDOM.unmountComponentAtNode(document.getElementById("urlput_post"));
  let list = sessionStorage.urlset_list.split("-@-")
  for(let i=0; i<list.length; i++){
    list[i] = JSON.parse(list[i])
  }
  ReactDOM.render(<SegueAnyToFolderList list={list} />, document.getElementById("container"));
  for(let d of list){
    $("#" + d.id ).css("background-image", "url(" + d.img + ")")
  }
}

function closeAddPanel(){ ReactDOM.unmountComponentAtNode(document.getElementById("add_view")); }


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
  let index = document.getElementById("urlput_option").selectedIndex;
  if(index !== 0 && url !== "" && title !== "")
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



// @platong option change from folder which is got from Firebase.
function optionChange(){
  let list = sessionStorage.urlset_list.split("-@-")
  list = list.map(value => {
    return JSON.parse(value)
  })
  let select = $("#urlput_option")
  let options = $.map(list, (d) => {
    let option = $('<option>', { value: d.id, text: d.name });
    return option;
  });
  options.push($('<option>', { value: "新しいURLセットを作成", text: "新しいURLセットを作成"}));
  select.append(options);
}


class AddButton extends React.Component{
  render(){
    return(
      <button id="add_button" onClick={this.props.func}>{this.props.icon}</button>
    );
  }
}


// @platong Appear if plus button is tapped or clicked.
class AddPanel extends React.Component{
  folderCreate(){
    ReactDOM.render(<UrlFolderPost></UrlFolderPost>, document.getElementById("post_add_view"));
    closeAddPanel();
  }
  urlCreate(){
    ReactDOM.render(<UrlPost></UrlPost>, document.getElementById("post_add_view"));
    closeAddPanel();
    optionChange();
  }
  render(){
    return(
      <div>
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
  getChangedOption(){
    urlSubmitActiveSwitch();
    var obj = document.getElementById("urlput_option");
    let index = obj.selectedIndex;
    if (index != 0 && obj.options[index].value === "新しいURLセットを作成")
      ReactDOM.render(<UrlsetMainFrame></UrlsetMainFrame>, document.getElementById("urlput_post"));
  }
  // @platong When URL is changed, XMLObject is created and send Ajax to get information about URL.
  urlConverter(){
    const url = document.urlput_form.url.value
    $.ajax({
      url:"/api_v1/",
      type:'GET',
      data:{ 
        "url": url,
      }
    })
    .done( (data) => {
      $('.result').html(data); 
      document.urlput_form.title.value = data.title
    })
    .fail( console.error("Error something bug is occured. Please contact us to inform this.") )
  }
  getChanged(){ urlSubmitActiveSwitch(); }
  urlputSubmit(){
    var obj = document.getElementById("urlput_option");
    let index = obj.selectedIndex;
    if (index === 0 || obj.options[index].value === "URLを登録するフォルダを選択")
      return

    const db = firebase.firestore();
    
    let t_id = $("#urlput_option").val()
    let user = firebase.auth().currentUser;
    db.collection("urlset").doc(t_id).collection("urlputs").add({
      title: document.urlput_form.title.value,
      content: "URLのコンテンツの概要は、現行のバージョンでは表示されません",
      href: document.urlput_form.url.value,
      aId: localStorage.getItem("accountId"),
      aProfileImg: user.photoURL,
      aName: user.displayName,
      dateTime: new Date()
    }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      closePostView()
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }
  render(){
    return (
      <div>
        <div className="window-overlay" onClick={closePostView}></div>
        <div className="post__container">
          <form name="urlput_form">
            <input name="url" type="text" onInput={this.urlConverter} placeholder="URLを入力" required/>
            <select id="urlput_option" required onChange={this.getChangedOption}>
              <option value="URLを登録するフォルダを選択">URLを登録するフォルダを選択</option>
            </select>
            <input name="title" type="text" placeholder="タイトル（自動入力）" onInput={this.getChanged} required/>
            <input type="button" onClick={this.urlputSubmit} value="登録" className="submit_is_disactive" id="url_submit"/>
          </form>
        </div>
      </div>
    );
  }
}


class UrlFolderPost extends React.Component{
  submit(){
    let file = document.urlset_form.urlbook_img.files[0]
    if(!folderSubmitValidation() && !blob) return; // validation
    let db = firebase.firestore();
    let storage = firebase.storage();
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
      let user = firebase.auth().currentUser;
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        db.collection("urlset").add({
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
        ReactDOM.render(
          <UrlPost></UrlPost>,
          document.getElementById("urlput_post")
        );
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
