# Social Media

---
## Requirements

**Python 3.9.5** <br />
**NodeJS v14.16.1** <br />
**MongoDB shell version v4.4.6** <br />

---

## Steps


1. After everything has been installed from **Requirements**, clone this git repository.
2. Now open the terminal into the Social_Media folder and <br/>
        cd back_end (move to the back_end folder) <br/>
        pip install virtualenv (install virtualenv for virtual enviornment) <br/>
        virtualenv venv (Create a virtual environment) <br/>
        source venv/Scripts/activate (on windows) **or** source venv/bin/activate (on mac) (Activate the virtual enviornment) <br/>
        pip install -r requirements.txt (install all the requirements to run the backend part of this project) <br/>
3. To run the backend, do <br/>
        export FLASK_DEBUG=1 <br/>
        export FLASK_ENV=development <br/>
        export FLASK_APP=app.py <br/>
        flask run <br/>
    This should run the backend
4. Now to move onto the front end <br/>
        cd .. (move one folder back) <br/>
        cd front_end (move to the front end folder) <br/>
        npm i (install all the dependencies) <br/>
        npm start (run the front end) <br/>
    After a few seconds, a window on your default web browser should open with the front end.
