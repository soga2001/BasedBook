import React, { Component } from "react";
import axios from "axios";
import {Button, Card, Row, Col, Container, FloatingLabel, Form} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import {Check_token} from './Token';


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
                console.log("token", localStorage.getItem('token'));
                if(Check_token()) {
                    console.log(localStorage.getItem('token'))
                    this.setState({message: "Access Token has been refreshed, please try again."})
                }
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
                <Card border="light" style={{ width: '70%', margin: 'auto' }}>
                    <Card.Header as='h3' className="header" style={{background: '#FFD9AE'}}>Post Content</Card.Header>
                    <Card.Body style={{width: '100%', margin: 'auto', background: "#FFEBD4"}}>
                        <form className="post"onSubmit={this.post}>
                            <Row>
                                <Col>
                                    <FloatingLabel label="Title" className="mb-3">
                                    <Form.Control type="text" id="title" placeholder="title" required/>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                            <Row >
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Content</Form.Label>
                                        <Form.Control as="textarea" id="content" rows={10} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button type="submit" variant="outline-primary" className='button'>Post</Button>
                        </form>
                        {this.state.err ? <Alert className="message">{this.state.err}</Alert>: this.state.message && <Alert className="message">{this.state.message}</Alert>}
                    </Card.Body>
                </Card>
                
            </Container>
        )
    }
}

export default Post;