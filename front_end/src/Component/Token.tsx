import axios from 'axios';
import Logout from './Logout';

function Check_token() {
    try {
        axios.post("/protected", {}, {
            headers: {
                'Authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
    } 
    catch {
        axios.post("/refresh-token", {}, {
            headers: {
                'Authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        .then((res)=> {
            localStorage.setItem('token', res.data);
        })
        .catch((error) =>{
            Logout();
        })
    }
}

export {Check_token};