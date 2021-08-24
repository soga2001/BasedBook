import React, { Component } from "react";
import axios from "axios";


interface Post {
  _id: string;
  author: string;
  title: string;
  content: string;
  date_posted: string;
}

class Home extends Component {
  state: { err: string; data: Post[], username: string, message: string } = { err: "", data: [], username: '', message: '' };

  constructor(props: any) {
    super(props);
    this.setData();
  }

  setData() {
    axios.get("http://127.0.0.1:5000/post").then((res) => {
      this.setState({ data: res.data });
    });
  }

  home = (e: any) => {
    this.setData();
  };

  
  delete = (e: any) => {
    const post_id = {post_id: (document.getElementById("post_id") as HTMLInputElement).value
    }
    console.log(post_id.post_id)
    axios.delete(`http://127.0.0.1:5000/post/${post_id.post_id}`, {
      headers:{
        'Authorization': 'Bearer' + localStorage.getItem('token')}
    })
    .then((res)=> {
      if(res.data.success) {
        this.setState({message: res.data.success})
        setTimeout(() => window.location.href = '/Home', 800)
      }
    })
  }



  renderData(post: Post) {
      return (
        <div className="posts">
            <h3>{post.title} <p hidden>Id: {post._id}</p></h3>
            <input type="text" id="post_id" value={post._id} hidden readOnly></input>
            <p className="author"><strong>Author: </strong> {post.author} </p>
            <p className="date"><strong>Date Posted: </strong>{post.date_posted}</p>
            <p className="content">{post.content}</p>
            <div className="delete_content">
              {post.author == localStorage.getItem('username') ? <button className="delete" onClick={this.delete}>Delete</button> : '' }
            </div>
      </div>
      )
    
  }

  render() {
    return (
      <div className="App">
        <header className="header">Home Page</header>
        <div>
          {this.state.data.map((post) => (
            <div>
              {this.renderData(post)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}


export default Home;