import queryParser from "./query_parser";


function currentWhere(){
  let path = location.pathname.slice(1)
  let segue = queryParser().s
  let nowLocation

  return segue ? path + "?s=" + segue : path
}
export { currentWhere};
