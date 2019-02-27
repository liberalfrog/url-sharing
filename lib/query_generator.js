export default function folderEditQueryGenerator(){
  let type = sessionStorage.getItem("folderedit_isManipulateType")
  let query = "&manipulate_type="
  switch(type){
    case "delete": 
	  query += "delete"
	  break
    case "":
	  query += "cancel"
	  break
    default: console.error("Error incorrect manipulate at folderEditQueryGenerator")
  }
  sessionStorage.removeItem("folderedit_isManipulateType")
  return query
}
