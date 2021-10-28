import React, { Component, useState, useEffect } from "react";
import axios from "axios";
import '../style.css'
import 'bootstrap/dist/css/bootstrap.css';
import {Button, Card, Row, Col, Container} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import {FaHeart} from "react-icons/fa"
import {FiHeart} from "react-icons/fi";
import FadeIn from 'react-fade-in';
import Pageview from "./Profile/Information";
import UserPosted_Pageview from "./Profile/UserPosted";

function Profile() {
  return (
    <Container className="body">
      <h1 className="header">Profile</h1>
      <Pageview />
      <h1 className="header">Your Posts</h1>
      <FadeIn>
        <UserPosted_Pageview />
      </FadeIn>
    </Container>
  )
}

export default Profile;