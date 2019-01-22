export default class LaterButton extends React.Component {
  laterButtonClicked(){
    alert("すみません、あとで読むは後日実装されます。")
  }
  render(){
    return(
      <button id="later_button" onClick={this.laterButtonClicked}>Watch later</button>
    )
  }
}
