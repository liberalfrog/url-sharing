import * as vs from "../component/vector_segue";


function pageMoving(nextLocation, unwind){
  let functionListCamel = [ 
	  "vSegueHome2Folder", "vSegueFolder2Home", "vSegueFolder2URL",
"vSegueURL2Folder", "vSegueHome2AddPanel", "vSegueAddPanel2Home",
"vSegueAccount2Folder", "vSegueFolderChoice2URLPost", "vSegueFolderChoice2AddPanel",
"vSegueFolder2Account", "vSegueAddPanel2FolderChoice", "vSegueFolderPost2AddPanel",
"vSegueAccount2URL", "vSegueAddPanel2FolderPost", "vSegueURLPost2URL",
"vSegueURL2Account", "vSegueURL2URLPost", "vSegueFolderPost2Folder",
"vSegueAccount2Followee", "vSegueFolder2FolderPost", "vSegueFolderEdit2Folder",
"vSegueFollowee2Account", "vSegueHome2URL", "vSegueURL2Home", "vSegueURLPost2FolderChoice",
"vSegueAccount2Follower", "vSegueHome2FolderEdit", "vSegueFolderEdit2Home",
"vSegueFollower2Account", "vSegueFolder2FolderEdit", "vSegueAccount2FolderEdit"
]

  let functionListLower = functionListCamel.map(x => { return x.toLowerCase() }) 

  let segueFunctionString = "vsegue" + nextLocation
  let index = functionListLower.findIndex(x => x === segueFunctionString)
  if(unwind){
    eval("vs." + functionListCamel[index] + "(true)")
  }else{
    eval("vs." + functionListCamel[index] + "(false)")
  }
}


function backBefore(unwind){
  let beforeLocate = sessionStorage.udBeforeLocation
  let segue
  let backSegue 
  if(beforeLocate !== undefined){
    segue = beforeLocate.split("?s=")[1]
    backSegue = segue.split("2")
    backSegue = backSegue[1] + "2" + backSegue[0]
  }else{
  }
  let path = location.pathname
  pageMoving(backSegue, unwind)
}


function folderSegue(nextPath){
  let path = location.pathname.slice(1)
  let nextLocation = path + "2" + nextPath
  pageMoving(nextLocation, false)
}

function folderEdit(unwind){
  let path = location.pathname.slice(1)
  let nextLocation = path + "2folderedit" 
  console.log(nextLocation)
  pageMoving(nextLocation, unwind)
}


export { folderSegue, backBefore, folderEdit};
