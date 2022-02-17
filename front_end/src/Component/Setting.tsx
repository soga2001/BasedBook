import React, { Component, ChangeEvent, useState } from 'react';
import { User } from 'react-feather';
import ReactLoading from 'react-loading';
// import {Button} from 'react-bootstrap';
import axios from 'axios';
import {Button, Card, Row, Col, Container, FloatingLabel, Form} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';


interface UploadFile {
    image: File | null;
}

function Setting() {
    // state = {err: "", logged_in: "", loading: false, image: null};

    const [formValues, setFormValues] = useState<UploadFile>({
        image: null
    })

    const [uploaded, setUploaded] = useState(false)

    const upload_image = async(e: any) => {
        e.preventDefault();
        const formData = new FormData();
        const img = (document.getElementById("image") as HTMLInputElement).value
        img && formData.append("image", img)
        axios.post("/upload_image",
         img, 
         {headers:{
                'Authorization': 'Bearer' + localStorage.getItem('token')
            }
        })
        .then((res) => {
            console.log(res.data.success)
            formValues.image = res.data.success
            setUploaded(true);
        })
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            image: event.target.files ? event?.target.files[0] : null,
        }));
    }
  
    // const uploadfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   e.preventDefault();
    //   this.setState({loading: true})
    // }
      return (
          <Container className="body">
            <div className="user">
              <h1 className="text-center">Setting</h1>
              <form onSubmit={upload_image} id="upload_image">
                <input type='file' name="img" accept='image/*' id="image" required></input>

                <Button type="submit">Submit Post </Button>
              </form>
                {uploaded && <img src="{{formValues.image}}"/>}  
            </div>
          </Container>
  
        
        
      );
  }

export default Setting;