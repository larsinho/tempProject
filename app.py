#!/usr/bin/python3.6
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, redirect, url_for, jsonify
import dataGetter




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
@app_flask.route('/blog/add/ajax', methods=['POST', 'GET'])
def add_blog_ajax():
    if request.method == 'POST':
        lambdaP = request.json['lambdaP']
        sigma = request.json['sigma']
        print(sigma)
        outDict = policyCalc.fun_retraction(sigma = sigma, lambdaP = lambdaP)
        #print(outDict['eps12_retraction'],outDict['vfun_F12_retraction'])
        #outDict = policyCalc.fun_permanet(sigma = sigma, lambdaP = lambdaP)
        #print(outDict['Pt'])
        return jsonify(outDict)



#if __name__ == '__main__':
app_flask.run(debug=True)