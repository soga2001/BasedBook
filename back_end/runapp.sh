#!/bin/sh

source ../venv/Scripts/activate
export FLASK_DEBUG=0
export FLASK_ENV=production
export FLASK_APP=app.py
flask run