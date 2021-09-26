import axios from 'axios';

async function Check_token() {
    try {
        await axios.post("http://127.0.0.1:5000/protected", {}, {
            headers: {
                'Authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        .then((res)=> {
            return true;
        })
    } 
    catch {
        if(!localStorage.getItem("token")) {
            return false;
        }
        await axios.post("http://127.0.0.1:5000/refresh-token", {}, {
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
            if(window.location.href === '/Post' || window.location.href === '/Profile')
            {
                window.location.href = '/Home'
            }
            else {
                window.location.reload();
            }
            return false;
        })
    }
}


export {Check_token};