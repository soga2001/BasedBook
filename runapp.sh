#!/bin/sh

source ./shell/Scripts/activate
export FLASK_DEBUG=1
export FLASK_APP=./app/app.py
flask run