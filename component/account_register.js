import {db, storage, auth} from "./firebase";
import {imgCompressor, submitImgToCloudStorage} from "./img_compressor";


function accountRegisterSubmitValidation(){
  let name = document.getElementById("ra_name").value;
  let file = document.getElementById("ra_profile_img").files[0];
  if(name!=="" && file!==undefined)
    return true;
  return false;
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
  fileChanged(){
	imgCompressor( document.getElementById("ra_profile_img"), $('#ra_preview'), 96, false)
  }
  submit(){
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
        location.reload();
      }).catch(err => {
        console.error("Error: Register account: ", err);
      });
	}
    submitImgToCloudStorage(document.getElementById("ra_profile_img"), "account_profile_imgs", firestoreUpload)
  }
  render(){
    return(
      <div className="ra">
        <div className="window-overlay"></div>
        <div className="centering_popover">
          <h2>Register an account</h2>
          <form>
            <input type="text" id="ra_name" style={{display: "block"}} placeholder="表示名（アカウント名）" onInput={raButtonActiveSwitch}/>
            <label htmlFor="ra_profile_img">プロフィール画像を選択</label>
            <input type="file" id="ra_profile_img" name="ra_profile_img" onChange={this.fileChanged} />
            <input type="text" id="ra_intro" placeholder="自己紹介" />
            <input type="button" onClick={this.submit} value="登録" className="submit_is_disactive" id="ra_submit"/>
          </form>
          <canvas id="ra_preview" width="96" height="96"></canvas>
        </div>
      </div>
    );
  }
}
