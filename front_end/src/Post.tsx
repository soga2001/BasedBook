import React, { Component } from "react";
import axios from "axios";

class Post extends Component {
    state = {err: '', message: ''}

    post = (e: any) => {
        e.preventDefault(); // so that the page doesn't refresh everytime ths submit button if pressed.
        axios.post("http://127.0.0.1:5000/post", {
            title: (document.getElementById('title') as HTMLInputElement).value,
            content: (document.getElementById('content') as HTMLInputElement).value
        }, {
            headers: {
                'Authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        .then((res) => {
            this.setState({err: ''})
            this.setState({message: "Posted"})
            setTimeout(()=>window.location.href = '/Home', 800)
        })
        .catch((err) => {
            if (localStorage.getItem('token')) {
                axios.post("http://127.0.0.1:5000/refresh-token", {}, {
                    headers: {
                        'Authorization': 'Bearer' + localStorage.getItem('token')
                    }
                })
                .then((res) => {
                    this.setState({message: "Access Token has been refreshed, please try again."})
                    localStorage.setItem('token', res.data)
                })
            }
            else {
                this.setState({message: ''})
                this.setState({err: "Please login before trying to post a content."})
            }
        })
    }

    render() {
        return (
            <div className="App">
                <header className="header">Post Content</header>
                <form className="post"onSubmit={this.post}>
                    <div>
                        <label className="title">Title: </label>
                        <input type="text" id="title" required></input>
                    </div>
                    <div >
                        <label className="post_content" >Content:</label>
                        <textarea rows={5} cols={50} id="content"></textarea>
                    </div>
                    <div>
                        <button type="submit">Post</button>
                    </div>
                </form>
                {this.state.err ? <h3 className="message" >{this.state.err}</h3> : <h3 className="message">{this.state.message}</h3>}
                
            </div>
        )
    }
}

export default Post;