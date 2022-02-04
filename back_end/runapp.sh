#!/bin/sh

source ../venv/Scripts/activate
export FLASK_DEBUG=1
export FLASK_ENV=development
export FLASK_APP=app.py
flask run