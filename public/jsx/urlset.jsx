// @plaong Use session storage ( like a iOS user defaults )
// If anyone knows more smart ways, please tell me about that.
firebase.initializeApp({
  apiKey: "AIzaSyDifH0dRKR2w8XRZIeXgKOZANnP3iv2qsc",
  authDomain: "urlsharing-541c7.firebaseapp.com",
  databaseURL: "https://urlsharing-541c7.firebaseio.com",
  projectId: "urlsharing-541c7",
  storageBucket: "urlsharing-541c7.appspot.com",
  messagingSenderId: "756728507687"
});

const db = firebase.firestore();
const storage = firebase.storage();

function init(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      console.log(user);
    } else {
      console.log("Please sign in");
      var redirect_url = "/" + location.search;
      if (document.referrer) {
        var referrer = "referrer=" + encodeURIComponent(document.referrer);
        redirect_url = redirect_url + (location.search ? '&' : '?') + referrer;
      }
      location.href = redirect_url;
    }
  });

  var d;
  db.collection("urlset").get().then((querysnapShots) => {
    var list = []
    var for_saved_list = []
    for(var i of querysnapShots.docs){
      d = i.data()
      d.id = i.id
      list.push(d)
      for_saved_list.push(JSON.stringify(d))
    };
    urlsetShow(list);
    sessionStorage.urlset_list = for_saved_list.join("-@-"); // @platong save list at urlset_list
  });
}


// @platong initialize this page
init()


// @platong component of a urlset
class Urlset extends React.Component {

  putShow(){
    var list = []
    var d
    const db = firebase.firestore();
    db.collection("urlset").doc(this.props.id).collection("urlputs").get().then((querysnapShots) => {
      for(var i of querysnapShots.docs){
        d = i.data()
        d.id = i.id
        list.push(d)
      };
      history.pushState('','',"?id=" + this.props.id);
      window.addEventListener('popstate', function(e) {
        const pathname = location.pathname
        if(pathname === "/feed" || pathname === "/feed/"){
          init()
        }
      });
      urlputShow(list);
    });
    
  }

  render(){
    return (
      <div className="urlset_panel" id={this.props.id}>
        <h3>{this.props.name}</h3>
        <a onClick={() => this.putShow()}></a>
      </div>
    )
  }
}


class UrlPut extends React.Component {
  render(){
    return (
      <div className="urlput_panel">
        <h3>{this.props.title}</h3>
        <p>{this.props.content}</p>
        <a href={this.props.href}></a>
      </div>
    )
  }
}


class Urlsets extends React.Component {

  constructor(props){
    super()
    this.state = {
      list: props.list
    };
  }

  render(){
    var return_html = []
    for(let d of this.state.list){
      return_html.push( <Urlset key={d.id} name={d.name} id={d.id}/>);
    }
    return return_html;
  }
}


class Urlputs extends React.Component {

  constructor(props){
    super()
    this.state = {
      list: props.list
    };
  }

  render(){
    var return_html = []
    for(let [i, d] of this.state.list.entries()){
      return_html.push( <UrlPut key={i} title={d.title} content={d.content} href={d.href}/>);
    }
    
    return return_html;
  }
}


var urlsetShow = function(list){
  ReactDOM.render( <Urlsets list={list}/>, document.getElementById("container"));
  for(let d of list){
    $("#" + d.id ).css("background-image", "url(" + d.img + ")")
  }
}


function urlputShow(list){
  ReactDOM.render( <Urlputs list={list}/>, document.getElementById("container"));
}
