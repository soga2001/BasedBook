import React, { Component } from "react";
import axios from "axios";
import {Button, Card, Row, Col, Container} from 'react-bootstrap';


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
            <Container style={{padding: '1%'}}>
                <Card style={{ width: '100%', margin: 'auto' }} className="text-center">
                    <Card.Header as='h3'>Post Content</Card.Header>
                    <Card.Body style={{width: '100%'}}>
                        <form className="post"onSubmit={this.post}>
                            <Row>
                                <Col xs={4} md={4}><label className="title">Title: </label></Col>
                                <Col xs={10} md={6}><input type="text" id="title" required style={{width: '100%'}}></input></Col>
                            </Row>
                            <Row >
                                <Col xs={4} md={4}><label className="post_content" >Content:</label></Col>
                                <Col xs={10} md={6}><textarea id="content" style={{width: '100%'}} rows={10}></textarea></Col>
                            </Row>
                            <Button style={{margin: '1%'}} type="submit">Post</Button>
                        </form>
                        {this.state.err ? <h3 className="message" >{this.state.err}</h3> : <h3 className="message">{this.state.message}</h3>}
                    </Card.Body>
                </Card>
                
            </Container>
        )
    }
}

export default Post;