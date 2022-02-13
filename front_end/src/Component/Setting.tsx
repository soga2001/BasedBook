import React, { Component } from 'react';
import { User } from 'react-feather';
import ReactLoading from 'react-loading';

class Setting extends Component {
    render() {
        return (
            <div>
                <ReactLoading type={'spin'} color={"blue"} height={100} width={100}/>
                <h1>This is the setting page <User/> </h1>
                <h1>Upload a profile picture</h1>
                <input type='file' name="img" accept='image/*'></input>
            </div>
        )
    }
}


export default Setting;