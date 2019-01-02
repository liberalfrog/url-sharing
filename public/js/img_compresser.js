var blob;

function blobToFile(theBlob, fileName){
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

// @platong If file is changed, file will be compressed.
// document.getElementById("ra_profile_img")
function fileChanged(event){
  let fileDomObj = event.target.fileDomObj
  let canvasDomObj = event.target.canvasDomObj
  let file = fileDomObj.files[0]
  if (file.type != 'image/jpeg' && file.type != 'image/png') {
    file = null;
    blob = null;
    return;
    alert("画像でないものはアップロードできません。対応形式はjpegかpngです。");
  }
  var image = new Image();
  var reader = new FileReader();
  const IMG_MAX_WIDTH = 96;

  reader.onload = function(e) {
    image.onload = function() {
      var width, height, ratio;
      if(image.width > image.height){
        ratio = image.height / image.width;
        width = IMG_MAX_WIDTH
        height = IMG_MAX_WIDTH * ratio;
      } else {
        ratio = image.width/ image.height;
        width = IMG_MAX_WIDTH * ratio;
        height = IMG_MAX_WIDTH
      }
      var canvas = canvasDomObj.attr('width', width).attr('height', height);
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
  submit(fileDomObj)
}

function submit(fileDomObj){
  let file = fileDomObj.files[0]
  if(!blob) return; // validation
  let storage = firebase.storage();
  let storageRef = storage.ref();
  let imagesRef = storageRef.child('account_profile_imgs');
  const file_name = file.name
  file = blobToFile(blob)
  var ref = storageRef.child('account_profile_imgs/' + file_name);
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
    });
  });
};


export {fileChanged}
