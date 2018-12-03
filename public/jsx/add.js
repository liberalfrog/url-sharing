(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// @platong For compressed image
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var blob = null;
var THUMBNAIL_HEIGHT = 100;

//@ platong unmount is not obvious for everyone who read this.
function closePostView() {
  ReactDOM.unmountComponentAtNode(document.getElementById("post_add_view"));
  ReactDOM.unmountComponentAtNode(document.getElementById("urlput_post"));
}

function closeAddPanel() {
  ReactDOM.unmountComponentAtNode(document.getElementById("add_view"));
}

// @platong If the folder form can submit, return true.
function folderSubmitValidation() {
  var title = document.getElementById("ap_panel_title").value;
  var file = document.urlset_form.urlbook_img.files[0];
  if (title !== "" && file !== undefined) return true;
  return false;
}

// @platong If the url form can submit, return true.
function urlSubmitValidation() {
  var url = document.urlput_form.url.value;
  var title = document.urlput_form.title.value;
  var index = document.getElementById("urlput_option").selectedIndex;
  if (index !== 0 && url !== "" && title !== "") return true;
  return false;
}

// @platong Change button color if the form can submit.
function buttonActiveSwitch() {
  if (folderSubmitValidation()) {
    $("#ap_submit").addClass("submit_is_active");
    $("#ap_submit").removeClass("submit_is_disactive");
  } else {
    $("#ap_submit").removeClass("submit_is_active");
    $("#ap_submit").addClass("submit_is_disactive");
  }
}

// @platong Change button color if the form can submit.
function urlSubmitActiveSwitch() {
  if (urlSubmitValidation()) {
    $("#url_submit").addClass("submit_is_active");
    $("#url_submit").removeClass("submit_is_disactive");
  } else {
    $("#url_submit").removeClass("submit_is_active");
    $("#url_submit").addClass("submit_is_disactive");
  }
}

function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

// @platong add button is clicked.
$("#add_button").on("click", function () {
  ReactDOM.render(React.createElement(AddPanel, null), document.getElementById("add_view"));
});

// @platong option change from folder which is got from Firebase.
function optionChange() {
  var list = sessionStorage.urlset_list.split("-@-");
  list = list.map(function (value) {
    return JSON.parse(value);
  });
  var select = $("#urlput_option");
  var options = $.map(list, function (d) {
    var option = $('<option>', { value: d.id, text: d.name });
    return option;
  });
  options.push($('<option>', { value: "新しいURLセットを作成", text: "新しいURLセットを作成" }));
  select.append(options);
}

// @platong Appear if plus button is tapped or clicked.

var AddPanel = (function (_React$Component) {
  _inherits(AddPanel, _React$Component);

  function AddPanel() {
    _classCallCheck(this, AddPanel);

    _get(Object.getPrototypeOf(AddPanel.prototype), "constructor", this).apply(this, arguments);
  }

  // @platong register URL

  _createClass(AddPanel, [{
    key: "folderCreate",
    value: function folderCreate() {
      ReactDOM.render(React.createElement(UrlFolderPost, null), document.getElementById("post_add_view"));
      closeAddPanel();
    }
  }, {
    key: "urlCreate",
    value: function urlCreate() {
      ReactDOM.render(React.createElement(UrlPost, null), document.getElementById("post_add_view"));
      closeAddPanel();
      optionChange();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "add_panel", onClick: this.folderCreate },
          React.createElement(
            "h3",
            null,
            "Add folder"
          ),
          React.createElement(
            "p",
            null,
            "URLを管理するフォルダを作成"
          )
        ),
        React.createElement(
          "div",
          { className: "add_panel", onClick: this.urlCreate },
          React.createElement(
            "h3",
            null,
            "Add URL"
          ),
          React.createElement(
            "p",
            null,
            "URLをフォルダに追加"
          )
        )
      );
    }
  }]);

  return AddPanel;
})(React.Component);

var UrlPost = (function (_React$Component2) {
  _inherits(UrlPost, _React$Component2);

  function UrlPost() {
    _classCallCheck(this, UrlPost);

    _get(Object.getPrototypeOf(UrlPost.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(UrlPost, [{
    key: "getChangedOption",
    value: function getChangedOption() {
      urlSubmitActiveSwitch();
      var obj = document.getElementById("urlput_option");
      var index = obj.selectedIndex;
      if (index != 0 && obj.options[index].value === "新しいURLセットを作成") ReactDOM.render(React.createElement(UrlsetMainFrame, null), document.getElementById("urlput_post"));
    }

    // @platong When URL is changed, XMLObject is created and send Ajax to get information about URL.
  }, {
    key: "urlConverter",
    value: function urlConverter() {
      var url = document.urlput_form.url.value;

      $.ajax({
        url: "/api_v1/",
        type: 'GET',
        data: {
          "url": url
        }
      }).done(function (data) {
        $('.result').html(data);
        document.urlput_form.title.value = data.title;
      }).fail(console.error("Error something bug is occured. Please contact us to inform this."));
    }
  }, {
    key: "getChanged",
    value: function getChanged() {
      urlSubmitActiveSwitch();
    }
  }, {
    key: "urlputSubmit",
    value: function urlputSubmit() {
      var obj = document.getElementById("urlput_option");
      var index = obj.selectedIndex;
      if (index === 0 || obj.options[index].value === "URLを登録するフォルダを選択") return;

      var db = firebase.firestore();

      var t_id = $("#urlput_option").val();
      var user = firebase.auth().currentUser;
      db.collection("urlset").doc(t_id).collection("urlputs").add({
        title: document.urlput_form.title.value,
        content: "URLのコンテンツの概要は、現行のバージョンでは表示されません",
        href: document.urlput_form.url.value,
        aId: localStorage.getItem("accountId"),
        aProfileImg: user.photoURL,
        aName: user.displayName,
        dateTime: new Date()
      }).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        closePostView();
      })["catch"](function (error) {
        console.error("Error adding document: ", error);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement("div", { className: "window-overlay", onClick: closePostView }),
        React.createElement(
          "div",
          { className: "add_post" },
          React.createElement(
            "form",
            { name: "urlput_form" },
            React.createElement("input", { name: "url", type: "text", onInput: this.urlConverter, placeholder: "URLを入力", required: true }),
            React.createElement(
              "select",
              { id: "urlput_option", required: true, onChange: this.getChangedOption },
              React.createElement(
                "option",
                { value: "URLを登録するフォルダを選択" },
                "URLを登録するフォルダを選択"
              )
            ),
            React.createElement("input", { name: "title", type: "text", placeholder: "タイトル（自動入力）", onInput: this.getChanged, required: true }),
            React.createElement("input", { type: "button", onClick: this.urlputSubmit, value: "登録", className: "submit_is_disactive", id: "url_submit" })
          )
        )
      );
    }
  }]);

  return UrlPost;
})(React.Component);

var UrlFolderPost = (function (_React$Component3) {
  _inherits(UrlFolderPost, _React$Component3);

  function UrlFolderPost() {
    _classCallCheck(this, UrlFolderPost);

    _get(Object.getPrototypeOf(UrlFolderPost.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(UrlFolderPost, [{
    key: "submit",
    value: function submit() {
      var file = document.urlset_form.urlbook_img.files[0];
      if (!folderSubmitValidation() && !blob) return; // validation
      var db = firebase.firestore();
      var storage = firebase.storage();
      var storageRef = storage.ref();
      var imagesRef = storageRef.child('urlset_images');
      var file_name = file.name;
      file = blobToFile(blob);
      var ref = storageRef.child('urlset_images/' + file_name);
      var uploadTask = ref.put(file);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function (snapshot) {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function (error) {
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
      }, function () {
        // Upload completed successfully, now we can get the download URL
        var user = firebase.auth().currentUser;
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at', downloadURL);
          db.collection("urlset").add({
            img: downloadURL,
            name: document.urlset_form.title.value,
            aId: localStorage.getItem("accountId"),
            aProfileImg: user.photoURL,
            aName: user.displayName,
            dateTime: new Date()

          }).then(function (docRef) {
            closePostView();
          })["catch"](function (error) {
            console.error("Error adding document: ", error);
          });
          ReactDOM.render(React.createElement(UrlPost, null), document.getElementById("urlput_post"));
        });
      });
    }
  }, {
    key: "fileChanged",

    // @platong If file is changed, file will be compressed.
    value: function fileChanged() {
      var file = document.urlset_form.urlbook_img.files[0];
      if (file.type != 'image/jpeg' && file.type != 'image/png') {
        file = null;
        blob = null;
        return;
        alert("画像でないものはアップロードできません。対応形式はjpegかpngです。");
      }
      var image = new Image();
      var reader = new FileReader();

      reader.onload = function (e) {
        image.onload = function () {
          var width, height;
          if (image.width > image.height) {
            var ratio = image.width / image.height;
            width = THUMBNAIL_HEIGHT * ratio;
            height = THUMBNAIL_HEIGHT;
          } else {
            alert("縦長の画像はアップロードできません");
            return;
          }
          var canvas = $('#ap_preview').attr('width', width).attr('height', height);
          var ctx = canvas[0].getContext('2d');
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);

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
          blob = new Blob([barr], { type: 'image/jpeg' });
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
      buttonActiveSwitch();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement("div", { className: "window-overlay", onClick: closePostView }),
        React.createElement(
          "div",
          { className: "add_post" },
          React.createElement(
            "form",
            { action: "", name: "urlset_form" },
            React.createElement(
              "div",
              { className: "ap_panel_main" },
              React.createElement("input", { id: "ap_panel_title", name: "title", type: "text", onInput: buttonActiveSwitch, placeholder: "タイトルを入力", required: true })
            ),
            React.createElement(
              "div",
              { className: "ap_panel_sub" },
              React.createElement("input", { id: "ap_select_img", name: "urlbook_img", type: "file", onChange: this.fileChanged }),
              React.createElement("input", { type: "button", onClick: this.submit, value: "作成", className: "submit_is_disactive", id: "ap_submit" })
            ),
            React.createElement("canvas", { id: "ap_preview", width: "0", height: "0" })
          )
        )
      );
    }
  }]);

  return UrlFolderPost;
})(React.Component);

},{}]},{},[1]);
