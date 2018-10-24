class UrlPut extends React.Component {
  render(){
    return (
      <div className="urlput">
        <h3>{this.props.title}</h3>
        <p>{this.props.content}</p>
        <a href={this.props.href}></a>
      </div>
    )
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


var urlputShow = function(list){
    ReactDOM.render( <Urlputs list={list}/>, document.getElementById("urlput_container"));
}

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDifH0dRKR2w8XRZIeXgKOZANnP3iv2qsc",
  authDomain: "urlsharing-541c7.firebaseapp.com",
  databaseURL: "https://urlsharing-541c7.firebaseio.com",
  projectId: "urlsharing-541c7",
   storageBucket: "urlsharing-541c7.appspot.com",
  messagingSenderId: "756728507687"
};

firebase.initializeApp(config);

var db = firebase.firestore();
db.collection("urlput").get().then((querysnapShots) => {
  var list = []
  for(var i of querysnapShots.docs){
    list.push(i.data())
  };
  urlputShow(list);
});
