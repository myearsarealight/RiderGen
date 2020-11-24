"""
Routes and views for the flask application.
"""

import os
import pypyodbc
import sqlite3

from flask import Flask, flash, jsonify, redirect, render_template, request, session, g
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.exceptions import default_exceptions, HTTPException, InternalServerError
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime
from RiderGen import app

# DATABASE = 'channelsdb.db'

def get_db():
    db = getattr(g, '_channelsdb', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_channelsdb', None)
    if db is not None:
        db.close() 

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

@app.route('/channels')
def channels():
    """Renders the channel list generator page"""
    return render_template('channels.html')

@app.route('/channelsub', methods=["POST"])
def channelsub():
    """Renders the channel list inside the generator page."""
    # Make a variable for the form data and an empty channel list
    db = sqlite3.connect('RiderGen/channelsdb.db')
    
    req = request.form
    clist = []
    # Get the act name and contact details
    actname=req.get("actname")
    contactname=req.get("contactname")
    contactdets=req.get("contactdets")
    # Get the instruments to make up the channels
    instruments = req.getlist("instrument")
    # i = 0
    #for inst in instruments:
    #    db.execute("INSERT INTO Instruments (inst_id) VALUES (?)", (instruments[i],))
    #    i += 1
    #db.commit()
    #db.close()
    return jsonify({'data': render_template('/channelsub.html', act_name=actname, contact_name=contactname, contact_details=contactdets, channel_list=instruments)})