"""
Routes and views for the flask application.
"""

import os

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from RiderGen import app

@app.route('/')
@app.route('/home')
def home():
    """Renders the home page."""
    return render_template(
        'index.html'
    )

@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template('about.html')

@app.route('/channels', methods=["GET", "POST"])
def channels():
    """Renders the channel list generator page."""
    if request.method == "POST":
        actname=request.form.get("actname")
        contactname=request.form.get("contactname")
        contactdets=request.form.get("contactdets")
        if request.form.get("drums") == "1":
            clist = "Drums"
        else:
            clist = "Nope"
        return render_template('channels.html', act_name=actname, contact_name=contactname, contact_details=contactdets, channel_list=clist)
    else:
        return render_template('channels.html', act_name="Your act name here", channel_list="")