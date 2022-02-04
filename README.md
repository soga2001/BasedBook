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
        cd back_end (move to the back_end folder)
        pip install virtualenv (install virtualenv for virtual enviornment)
        virtualenv venv (Create a virtual environment)
        source venv/Scripts/activate (on windows) **or** source venv/bin/activate (on mac) (Activate the virtual enviornment)
        pip install -r requirements.txt (install all the requirements to run the backend part of this project)
3. To run the backend, do
        export FLASK_DEBUG=1
        export FLASK_ENV=development
        export FLASK_APP=app.py
        flask run
    This should run the backend
4. Now to move onto the front end
        cd .. (move one folder back)
        cd front_end (move to the front end folder)
        npm i (install all the dependencies)
        npm start (run the front end)
    After a few seconds, a window on your default web browser should open with the front end.
