import React, { Component } from "react";
import axios from "axios";


interface Post {
  author: string;
  title: string;
  content: string;
  date_posted: string;
}

class Home extends Component {
  state: { err: string; data: Post[] } = { err: "", data: [] };

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

  renderData(post: Post) {
      return (
        <div className="posts">
            <h3>{post.title}</h3>
            <p className="author"><strong>Author: </strong> {post.author} </p>
            <p className="date"><strong>Date Posted: </strong>{post.date_posted}</p>
            <p className="content">{post.content}</p>
      </div>
      )
    
  }

  render() {
    return (
      <div className="App">
        <h1>Home Page</h1>
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