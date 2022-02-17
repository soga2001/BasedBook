import axios from 'axios';

function Check_token() {
    try {
        axios.post("/protected", {}, {
            headers: {
                'Authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        .then((res)=> {
            return true;
        })
        .catch((err => {
            return false;
        }))
    } 
    catch {
        if(!localStorage.getItem("token")) {
            return false;
        }
        axios.post("/refresh-token", {}, {
            headers: {
                'Authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        .then((res)=> {
            localStorage.setItem('token', res.data);
            return true;
        })
        .catch((error) =>{
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            return false;
        })
    }
    return false;
}

export {Check_token};