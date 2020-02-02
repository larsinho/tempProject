#!/usr/bin/python3.6
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, redirect, url_for, jsonify
import dataGetter


import time
import atexit

from apscheduler.schedulers.background import BackgroundScheduler


def print_date_time():
    print(time.strftime("%A, %d. %B %Y %I:%M:%S %p"))


#scheduler = BackgroundScheduler()
#scheduler.add_job(func=dataGetter.getTemp, trigger="interval", seconds=3)
#scheduler.start()
# Shut down the scheduler when exiting the app
#atexit.register(lambda: scheduler.shutdown())



app_flask = Flask(__name__)


@app_flask.route('/')
def index():
    tempValues = dataGetter.getTemp()
    return render_template('index.html', temp = tempValues)



@app_flask.route('/research')
def research():
    return render_template('research.html')

@app_flask.route('/snake')
def snake():
    return render_template('snake_index.html')

@app_flask.route('/competition')
def competition():
    return render_template('competition.html')

@app_flask.route('/PresentationInvestExL2nd')
def presentation1():
    return render_template('presentationinvestexl2nd/presentation.html')


@app_flask.route('/teaching')
def teaching():
    return render_template('teaching.html')

@app_flask.route('/paper1_policy')
def paper1_policy():
    return render_template('paper1_policy.html')

# Post and request data:
@app_flask.route('/index/add/ajax', methods=['POST', 'GET'])
def add_blog_ajax():
    return jsonify(dataGetter.getTemp())





#if __name__ == '__main__':
app_flask.run(debug=True)