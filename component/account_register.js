import {db, storage, auth} from "./firebase";
import {imgCompressor, submitImgToCloudStorage} from "./img_compressor";


function accountRegisterSubmitValidation(){
  let name = document.getElementById("ra_name").value;
  if(name !== "")
    return true
  return false
}


function raButtonActiveSwitch(){
  if(accountRegisterSubmitValidation()){
    $("#ra_submit").addClass("submit_is_active");
    $("#ra_submit").removeClass("submit_is_disactive");
  }else{
    $("#ra_submit").removeClass("submit_is_active");
    $("#ra_submit").addClass("submit_is_disactive");
  }
}


export default class AccountRegister extends React.Component{
  componentDidMount(){
	let img = new Image()
	img.src = "/common/img/apple.jpg"
	let ctx = document.getElementById("ra_preview").getContext("2d");
	img.onload = function(){
      ctx.drawImage(img,0,0)
	}
  }
  fileChanged(){
	imgCompressor( document.getElementById("ra_profile_img"), $('#ra_preview'), 128, false)
  }
  submit(){
    if(!accountRegisterSubmitValidation())
	  return
	let firestoreUpload = function(downloadURL){
      let user = auth.currentUser;
      db.collection("account").add({
        img: downloadURL,
        name: document.getElementById("ra_name").value,
        uId: user.uid,
        followee: 0,
        follower: 0,
      }).then(docRef => {
		let currentToken = localStorage.tokenSaved
        if(currentToken){
	      return db.collection("account").doc(docRef.id).get().then(snap => {
            let data = snap.data();
			if(data.iid === undefined)
			  data.iid = []
            for(var i of data.iid){
              if(currentToken === i)
               return;
            }   
            data.iid.push(currentToken);
            return db.collection("account").doc(docRef.id).set(data, { merge: true });  
		  })
        }
		return true
	  }).then(() => {
        return user.updateProfile({
          displayName: name,
          photoURL: downloadURL
        })
	  }).then(() => {
        console.log("All process is done");
        location.href = "/home";
      }).catch(err => {
        console.error("Error: Register account: ", err);
      });
	}
    submitImgToCloudStorage(document.getElementById("ra_preview"), "account_profile_imgs", firestoreUpload)
  }
  render(){
    return(
      <div className="ra">
        <div className="centering_popover">
          <form>
		    <div className="register-account__profile-img">
              <canvas id="ra_preview" width="128" height="128"></canvas>
              <input type="file" id="ra_profile_img" name="ra_profile_img" onChange={this.fileChanged} />
		    </div>
            <input type="text" id="ra_name" style={{display: "block"}} placeholder="表示名（アカウント名）" onInput={raButtonActiveSwitch}/>
            <input type="button" onClick={this.submit} value="新しい世界を楽しむ" className="submit_is_disactive" id="ra_submit"/>
          </form>
        </div>
      </div>
    );
  }
}
