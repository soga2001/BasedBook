import React, {Component} from 'react';

function token() {
    if(localStorage.getItem("token")) {
      console.log(localStorage.getItem("token"))
      return true;
    }
    return false;
}

class Token extends Component {
    render() {
        return(
            <div>
                <button onClick={token}>Button</button>
            </div>
        )
    }
}

export default Token;