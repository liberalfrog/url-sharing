$("#add_button").on("click", function(){
  ReactDOM.render(
    <UrlputMainFrame></UrlputMainFrame>,
    document.getElementById("urlput_post")
  );
  optionChange();
});


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
  select.append(options);
}


//* URLPutの表示メインフレーム
class UrlputMainFrame extends React.Component{

  getChangedOption(){
    var obj = document.getElementById("urlput_option");
    let index = obj.selectedIndex;
    if (index != 0 && obj.options[index].value == "新しいURLセットを作成")
      ReactDOM.render(<UrlsetMainFrame></UrlsetMainFrame>, document.getElementById("urlput_post"));
  }

  urlputSubmit(){
    const db = firebase.firestore();
    let t_id = $("#urlput_option").val()
    db.collection("urlset").doc(t_id).collection("urlputs").add({
      title: "Hello world",
      content: "Hello world",
      href: document.urlput_form.url.value,
    }).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
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
          <input name="url" type="text" required/>
          <label htmlFor="urlbook">URLset:</label> <select id="urlput_option" required onChange={() => this.getChangedOption()}>
            <option value="新しいURLセットを作成">新しいURLセットを作成</option>
          </select>
          <input type="button" onClick={this.urlputSubmit} />
        </form>
      </div>
    );
  }
}


class UrlsetMainFrame extends React.Component{

  urlsetSubmit(){
    // validation
    if(document.urlset_form.title.value !== ""){
      var db = firebase.firestore();
      var storage = firebase.storage();
      var storageRef = storage.ref();

      var imagesRef = storageRef.child('urlset_images');

      var file = document.urlset_form.urlbook_img.files[0]

      let metadata = { contentType: file.type };
      var ref = storageRef.child('urlset_images/' + file.name);

      var uploadTask = ref.put(file, metadata)

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
      }, function(error) {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, function() {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
          db.collection("urlset").add({
            img: downloadURL,
            name: document.urlset_form.title.value
          }).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
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
  }

  render(){
    return (
      <div className="urlset_post_view">
        <h1>URLセットを登録する</h1>
        <form name="urlset_form">
          <label htmlFor="title">タイトル:</label>
          <input name="title" type="text" required/>
          <label htmlFor="urlbook_img" required>URLSet:</label>
          <input name="urlbook_img" type="file" />
          <input type="button" onClick={this.urlsetSubmit} />
        </form>
      </div>
    );
  }

}


