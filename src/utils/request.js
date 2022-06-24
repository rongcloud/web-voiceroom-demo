
import Axios from 'axios'
//import config from '../config'
Axios.defaults.baseURL = ""
Axios.headers = {
    'Content-Type': 'application/json;charset=UTF-8'
}
let request = Axios
// console.log("base:", request.defaults.baseURL)

export default request;