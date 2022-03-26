import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Logout from '../Logout';
import {Container, Button, Row, Col} from 'react-bootstrap';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';

class Setting extends Component {
    state = {err: "", passMes: "", passErr: "", userMes: "", userErr: "", numMes: "", numErr: "", delMes: "", delErr: "", 
    passLoad: false, userLoad: false, numLoad: false, delLoad: false};

    changeUsername = (e: any) => {
        e.preventDefault();
        this.setState({userLoad: true})
        var username = (document.getElementById("username") as HTMLInputElement).value;
        var cusername = (document.getElementById("cusername") as HTMLInputElement).value;
        if(username === cusername) {
            axios.put("/update_username", { 
                username: username, 
                password: (document.getElementById("userPass") as HTMLInputElement).value
            }, { headers: {'Authorization': 'Bearer' + localStorage.getItem('token')}})
            .then((res) => {
                if(res.data.success) {
                    this.setState({userMes: "Username has been changed. Logging out..."})
                    this.setState({userErr: ""})
                    this.setState({userLoad: false})
                    setTimeout(Logout, 2000);
                }
                else {
                    this.setState({userErr: res.data.message})
                    this.setState({userMes: ""})
                    this.setState({userLoad: false})
                }
            })
        };
        
    };

    changePass = (e: any) => {
        e.preventDefault();
        this.setState({passLoad: true})
        var opass = (document.getElementById("oldPass") as HTMLInputElement).value;
        var npass = (document.getElementById("newPass") as HTMLInputElement).value;
        var cpass = (document.getElementById("confirmPass") as HTMLInputElement).value;
        if(npass === cpass) {
            axios.put("/update_password", {
                email: (document.getElementById("email") as HTMLInputElement).value, 
                password: opass, 
                newPass: npass
            }, { headers: {'Authorization': 'Bearer' + localStorage.getItem('token')}})
            .then((res) => {
                if(res.data.success) {
                    this.setState({passLoad: false})
                    this.setState({passMes: "Password has been changed. You will be logged out."})
                    this.setState({passErr: ""})
                    setTimeout(Logout, 2000);
                    
                }
                else {
                    this.setState({passLoad: false})
                    this.setState({passErr: res.data.message})
                    this.setState({passMes: ""})
                }
            })
        } 
        else {
            this.setState({passErr: "Please make sure your new password are the same."})
            this.setState({passLoad: false})
        }
    };

    changePhone = (e: any) => {
        e.preventDefault();
        var phone = (document.getElementById("phone") as HTMLInputElement).value;
        var cphone = (document.getElementById("cphone") as HTMLInputElement).value;
        if(phone === cphone) {
            alert(true)
        };
        alert(false)
    }

    deleteAcc = (e: any) => {
        e.preventDefault();
        this.setState({delLoad: true})
        var pass = (document.getElementById("delPass") as HTMLInputElement).value
        var cpass = (document.getElementById("delCPass") as HTMLInputElement).value
        if(pass === cpass) {
            var confirmed = window.confirm('Are you sure you wish to delete your account?');
            if(confirmed)
            {
                console.log("confirmed")
                axios.delete("/delete_user", {
                    headers: {'Authorization': 'Bearer' + localStorage.getItem('token')
                }, 
                data: {
                    password: pass,
                }})
                .then((res) => {
                    if(res.data.success) {
                        this.setState({delMes: "Account has been deleted. You will be logged out."})
                        this.setState({delErr: ""})
                        this.setState({delLoad: false})
                        setTimeout(Logout, 2000);
                    }
                })
            }
            else {
                this.setState({delMes: "You have decided to not delete your account thus it won't be deleted."})
                this.setState({delErr: ""})
                this.setState({delLoad: false})
            }
        }
        else{
            this.setState({delErr: "Please make sure your new password are the same."})
            this.setState({delMes: ""})
            this.setState({delLoad: false})
        }
        
    }

    render() {
        return (
            <Container className="body">
                <h1 className='header'>Setting</h1>
                <hr></hr>
                <div>
                    <h3>Change username</h3>
                    <form onSubmit={this.changeUsername}>
                        <Row>
                            <Col><label>Username:</label></Col>
                            <Col><input type='text' id='username' required></input></Col>
                        </Row>
                        <Row>
                            <Col><label>Confirm Username:</label></Col>
                            <Col><input type='text' id='cusername' required></input></Col>
                        </Row>
                        <Row>
                            <Col><label>Password:</label></Col>
                            <Col><input type="password" id="userPass" required></input> </Col>
                        </Row>
                        {this.state.userLoad ? <ReactLoading type={'bars'} color={"purple"} height={30} width={30} className="loading"/> : <Button type="submit" variant="primary">Change</Button>}
                        {this.state.userMes !== "" && <Alert >{this.state.userMes}</Alert>}
                        {this.state.userErr !== "" && <Alert variant='danger' >{this.state.userErr}</Alert>}
                    </form>
                </div>
                <hr></hr>
                <div>
                    <h3>Change password</h3>
                    <form onSubmit={this.changePass}>
                        <Row>
                            <Col><label>Email:</label></Col>
                            <Col><input type="email" id="email" required></input></Col>
                        </Row>
                        <Row>
                            <Col><label>Old Password:</label></Col>
                            <Col><input type='password' id='oldPass' required></input></Col>
                        </Row>
                        <Row>
                            <Col><label>New Password:</label></Col>
                            <Col><input type='password' id='newPass' required></input></Col>
                        </Row>
                        <Row>
                            <Col><label>Confirm Password:</label></Col>
                            <Col><input type='password' id='confirmPass' required></input></Col>
                        </Row>
                        {this.state.passLoad ? <ReactLoading type={'bars'} color={"purple"} height={30} width={30} className="loading"/> : <Button type="submit" variant="primary">Change</Button>}
                        {this.state.passMes !== "" && <Alert >{this.state.passMes}</Alert>}
                        {this.state.passErr !== "" && <Alert variant='danger' >{this.state.passErr}</Alert>}
                    </form>
                </div>
                <hr></hr>
                <div>
                    <h3>Change phone number</h3>
                    <form onSubmit={this.changePhone}>
                        <Row>
                            <Col><label>Phone:</label></Col>
                            <Col><input type='password' id='phone'></input></Col>
                        </Row>
                        <Row>
                            <Col><label>Confirm Phone:</label></Col>
                            <Col><input type='text' id='cphone'></input></Col>
                        </Row>
                        {this.state.numLoad ? <ReactLoading type={'bars'} color={"purple"} height={30} width={30} className="loading"/> : <Button type="submit" variant="primary">Change</Button>}
                    </form>
                </div>
                <hr></hr>
                <div>
                    <h3>Delete Account</h3>
                    <form onSubmit={this.deleteAcc}>
                        <Alert variant="danger" className='text-center'> Once removed, the account cannot be retrieved. Please proceed with caution.</Alert>
                        <Row>
                            <Col><label>Password:</label></Col>
                            <Col><input type="password" id="delPass"></input></Col>
                        </Row>
                        <Row>
                            <Col><label>Confirm Password:</label></Col>
                            <Col><input type="password" id="delCPass"></input></Col>
                        </Row>
                        {this.state.numLoad ? <ReactLoading type={'bars'} color={"purple"} height={30} width={30} className="loading"/> : <Button type="submit" variant="primary">Delete</Button>}
                        {this.state.delMes !== "" && <Alert >{this.state.delMes}</Alert>}
                        {this.state.delErr !== "" && <Alert variant='danger' >{this.state.delErr}</Alert>}
                    </form>
                </div>
            </Container>
        )
    }
}


export default Setting;