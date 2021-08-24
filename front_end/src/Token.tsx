import axios from 'axios';
import React from 'react';

async function check_token() {
    const access_token = localStorage.getItem('token');
    try {
        axios.post("http://127.0.0.1:5000/protected", {}, {
            headers: {
                'Authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        .then((res)=> {
            return res.data.success
        })

    }
    catch {
        if(!access_token) {
            return false;
        }
        axios.post("http://127.0.0.1:5000/refresh-token", {}, {
            headers: {
                'Authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        .then((res)=> {
            localStorage.setItem('token', res.data)
        })
    }
}

export {check_token};