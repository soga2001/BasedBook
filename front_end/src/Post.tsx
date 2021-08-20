import React, { Component } from "react";
import axios from "axios";

class Post extends Component {
    state = {access_token: ""};
    config = {
        headers: {
        'Authorization': 'Bearer' + localStorage.getItem("token")
    } }

    post = (e: any) => {
        e.preventDefault(); // so that the page doesn't refresh everytime ths submit button if pressed.
        axios.get("http://127.0.0.1:5000/user_post", this.config)
        .then((res) => {
            console.log(res.data)
        })
    }

    render() {
        return (
            <div className="App">
                <header className="header">Post Content</header>
                <form className="post"onSubmit={this.post}>
                    <div>
                        <label >Title: </label>
                        <input type="text" id="title" required></input>
                    </div>
                    <div >
                        <label >Content:</label>
                        <textarea rows={5} cols={22} id="content"></textarea>
                    </div>
                    <div>
                        <button type="submit">Post</button>
                    </div>
                </form>
                
            </div>
        )
    }
}

export default Post;