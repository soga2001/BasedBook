import React, {Component} from 'react'
import axios from 'axios'


class Home extends Component {
    state = {err: "", data: []}

    home = (e: any) => {
        e.preventDefault();
        axios.get("http://127.0.0.1:5000/post")
        .then((res) => {
            this.setState({data: res.data})
            console.log(this.state.data[0])
            console.log(this.state.data[1])
            console.log(this.state.data[2])
            console.log(this.state.data[3])
            console.log(this.state.data[4])
        })
    }

    render() {
        return(
            <div className="App">
                <h3>Home Page</h3>

                <div>
                    <h1>Title</h1>
                    <p>Date Posted</p>
                    <h4>Content</h4>
                </div>
                <button onClick={this.home}>Submit</button>
            </div>
            
        )
    }
}

export default Home;