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

#def get_db():
#    db = getattr(g, '_channelsdb', None)
 #   if db is None:
  #      db = g._database = sqlite3.connect(DATABASE)
   # return db

#@app.teardown_appcontext
#def close_connection(exception):
 #   db = getattr(g, '_channelsdb', None)
  #  if db is not None:
   #     db.close() 

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
    cur = db.cursor()
    
    req = request.form
    clist = []
    # Get the act name and contact details
    actname=req.get("actname")
    contactname=req.get("contactname")
    contactdets=req.get("contactdets")
    # Get the instruments to make up the channels
    instruments = req.getlist("instrument")
    
    # For each instrument, get row of the same name from database, tables joined on mic ID.
    for instrument in instruments:
        cur.execute("SELECT inst.inst_name, inst.def_mic, inst.stand, mic.need_stand, inst.pos, mic.phantom FROM inst JOIN mic ON inst.def_mic = mic.mic_name WHERE inst_ref = ?", ([instrument]))
        rows = cur.fetchall()
        # Add to clist
        clist.append(rows[0])
    # Send data to channel list template
    return jsonify({'data': render_template('/channelsub.html', act_name=actname, contact_name=contactname, contact_details=contactdets, channel_list=clist)})

@app.route('/channelprint', methods=["POST"])
def channelprint():
    """Renders the channel list to print to pdf or csv."""
    # Make a variable for the form data and an empty channel list
    req = request.form
    clist = []
    # Get the act name and contact details
    actname=req.get("actname")
    contactname=req.get("contactname")
    contactdets=req.get("contactdets")
    
    # For each channel, make a dictionary of its values, then add it to clist
    i = 1
    while True:
        if req.get("ch" + str(i)) != None:
            row = {}
            row["inst"] = req.get("inst" + str(i))
            row["mic"] = req.get("mic" + str(i))
            row["stand"] = req.get("stand" + str(i))
            row["pos"] = req.get("pos" + str(i))
            row["phnt"] = req.get("phnt" + str(i))
            row["notes"] = req.get("notes" + str(i))
            i += 1
        
            # Add to clist
            clist.append(row)
        else:
            break
    # Send data to channel list template
    return jsonify({'data': render_template('/channelprint.html', act_name=actname, contact_name=contactname, contact_details=contactdets, channel_list=clist)})