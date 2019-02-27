export default function queryParser(){
  let queryOfURL = location.search;
  var parameters = {};
  if(queryOfURL === ""){
	return {};
  }
  let hash = location.search.slice(1).split("&")
    hash.map(x => {
    let array = x.split("=")
    parameters[array[0]] = array[1]
  })
  return parameters
}
