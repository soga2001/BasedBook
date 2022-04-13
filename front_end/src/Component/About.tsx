import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import {Container, Button, Row, Col} from 'react-bootstrap';


class About extends Component {

    render() {
        return (
            <Container className='body'>
                <h1 className='text-center'>Welcome!!!</h1>
                <hr></hr>
                <div>
                    <h2>Q&A</h2>
                    <ol>
                        <li id="question">What is the purpose of this website?</li>
                        <p id="answer">Originally this was supposed to be a social media platform but soon after, I decided to turn this into a platform
                            where users are able to post their narrative stories. I, myself, love writing fictional stories to add some creativity and joy to my life. I made this website because I want to read stories written by others.</p>
                        <li id="question">What was used to build this project?</li>
                        <p id="answers"> This website has 2 different components: <strong>Front-End</strong> and <strong>Back-End</strong>.
                            <ol>
                                <li><strong>Front-End</strong></li>
                                <p>For the front-end, I used <strong>React Typescript</strong> and <strong>CSS</strong>. It was a lot of work to build each page from scratch but honestly
                                    it was a lot of fun.
                                </p>
                                <li><strong>Back-End</strong></li>
                                <p>For the back-end, I used <strong>Flask</strong>. It was definitely the hardest part of my project, especially user authentication, which
                                    took me a long time to figure out. I couldn't have done it without help. 
                                    For the database I used <strong>MongoDB </strong> and really enjoyed learning it.
                                </p>
                            </ol>
                        </p>
                        <li id="question">Current Features</li>
                        <ul>
                            <li>Login and Registration</li>
                            <li>Like stories which can be found in your <strong>Liked</strong> page, sorted by the latest liked</li>
                            <li>View your account information and the stories you have posted from the <strong>Profile</strong> page.</li>
                            <li>Post your stories</li>
                            <li>Delete your stories</li>
                            <li>Change Username and Password</li>
                            <li>Delete account</li>
                            <li>Edit your stories</li>
                            <li>Rate stories</li>
                            <li>Comment Section for posts (needs formatting)</li>
                        </ul>
                        <li id="question">Features planned for the future</li>
                        <ul>
                            <li>Email verification</li>
                            <li>Search for other users and view their posts</li>
                            <li>Search for posts based on genre</li>
                            <li>Roles (admin, operator, mod)</li>
                            <li>Discover page with the ability to filter posts based on likes, comments, latest, oldest, rating, etc</li>
                        </ul>
                    </ol>
                </div>
                <div className='home-page'>
                    <a href="/Home" className="button"><Button variant="primary" >Home Page</Button></a>
                </div>
                <div className='footer'>

                </div>
            </Container>
        )
    }
}
export default About;