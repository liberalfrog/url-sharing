// @platong For compressed image
var blob = null;
const THUMBNAIL_WIDTH = 500;


// @platong URLput post view disable
function unmountURLputPostView(){ ReactDOM.unmountComponentAtNode(document.getElementById("urlput_post")); }


// @platong add button is clicked.
$("#add_button").on("click", function(){
  ReactDOM.render(
    <UrlputMainFrame></UrlputMainFrame>,
    document.getElementById("urlput_post")
  );
  optionChange();
});


function blobToFile(theBlob, fileName){
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}


// @platong option change from urlset_list
function optionChange(){
  var list = sessionStorage.urlset_list.split("-@-")
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




// @platong URLPutの表示メインフレーム
class UrlputMainFrame extends React.Component{

  getChangedOption(){
    var obj = document.getElementById("urlput_option");
    let index = obj.selectedIndex;
    if (index != 0 && obj.options[index].value == "新しいURLセットを作成")
      ReactDOM.render(<UrlsetMainFrame></UrlsetMainFrame>, document.getElementById("urlput_post"));
  }

  getChangeURL(){
    let url = document.urlput_form.url.value
    $.ajax({
      url:"/api_v1/",
      type:'GET',
      data:{ "url": url }
    })
    .done( (data) => {
      $('.result').html(data); 
      document.urlput_form.title.value = data.title
      console.log(data);
    })
    .fail( (data) => {
      $('.result').html(data);
      console.log(data);
    })
  }

  urlputSubmit(){
    const db = firebase.firestore();
    let t_id = $("#urlput_option").val()
    db.collection("urlset").doc(t_id).collection("urlputs").add({
      title: document.urlput_form.title.value,
      content: "URLのコンテンツの概要は、現行のバージョンでは表示されません",
      href: document.urlput_form.url.value,
    }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      unmountURLputPostView()
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  render(){
    return (
      <div className="urlput_post_view">
        <h1>URLを登録する</h1>
        <form name="urlput_form">
          <label htmlFor="url">URL:</label>
          <input name="url" type="text" onInput={() => this.getChangeURL()} required/>
          <label htmlFor="urlbook">URLset:</label> <select id="urlput_option" required onChange={() => this.getChangedOption()}>
          </select>
          <input name="title" type="text" required/>
          <input type="button" onClick={this.urlputSubmit} />
        </form>
      </div>
    );
  }
}


class UrlsetMainFrame extends React.Component{

  urlsetSubmit(){
    let file = document.urlset_form.urlbook_img.files[0]
    // validation
    if(document.urlset_form.title.value === "" && !blob) return;

    var db = firebase.firestore();
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var imagesRef = storageRef.child('urlset_images');

    const file_name= document.urlset_form.urlbook_img.files[0].name
    file = blobToFile(blob)

    var ref = storageRef.child('urlset_images/' + file_name);

    var uploadTask = ref.put(file)

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function(snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
        case 'storage/unauthorized': // User doesn't have permission to access the object
          break;
        case 'storage/canceled': // User canceled the upload
          break;
        case 'storage/unknown': // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, function() { // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log('File available at', downloadURL);
        db.collection("urlset").add({
          img: downloadURL,
          name: document.urlset_form.title.value
        }).then(function(docRef) {
          unmountURLputPostView()
        }).catch(function(error) {
          console.error("Error adding document: ", error);
        });
        ReactDOM.unmountComponentAtNode(document.getElementById("urlput_post"));
        ReactDOM.render(
          <UrlputMainFrame></UrlputMainFrame>,
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
          var ratio = image.height/image.width;
          width = THUMBNAIL_WIDTH;
          height = THUMBNAIL_WIDTH * ratio;
        } else {
          alert("縦長の画像はアップロードできません");
          return
        }
        var canvas = $('#preview').attr('width', width).attr('height', height);
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
        console.log(blob);
      }
      image.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }
  
  render(){
    return (
      <div className="urlset_post_view">
        <h1>URLセットを登録する</h1>
        <form name="urlset_form">
          <label htmlFor="title">タイトル:</label>
          <input name="title" type="text" required/>
          <label htmlFor="urlbook_img" required>URLSet:</label>
          <input name="urlbook_img" type="file" onChange={this.fileChanged} />
          <input type="button" onClick={this.urlsetSubmit} />
        </form>
        <canvas id="preview" width="0" height="0"></canvas>
      </div>
    );
  }
}
