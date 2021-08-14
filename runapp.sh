#!/bin/sh

source ./shell/Scripts/activate
export FLASK_DEBUG=1
export FLASK_APP=./back_end/app.py
flask run