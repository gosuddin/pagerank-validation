from flask import Flask, render_template, jsonify, request
from flask_pymongo import PyMongo
from flask_pymongo import DESCENDING as d
import pralgo
import numpy as np

app = Flask(__name__, static_url_path='')

app.config['MONGO_DBNAME'] = 'pr'
app.config['MONGO_URI'] = 'mongodb://admin:admin@ds019882.mlab.com:19882/pr'

mongo = PyMongo(app)



def last_matid():
	adjMat = mongo.db.adjMat
	last_row = adjMat.find().sort('_id',d).limit(1)
	for doc in last_row:
		print(doc['_id'])
		last_id = doc['_id']
	return last_id

@app.route('/')
def helloWorld():
	return "Hello World"


@app.route('/addMat',methods=['POST'])
def add_Mat():
	adjMat = mongo.db.adjMat
	print (request.json['adjMat'])
	new_adjMat = request.json['adjMat']
	last_id = last_matid()
	adjMat.insert({"_id":last_id+1,"mat": new_adjMat})

	return "Success"


@app.route('/addTransfers',methods=['POST'])
def add_Transfer():
	print(request.json)
	trx = request.json
	last_id = last_matid()
	transfers = mongo.db.transfers
	transfers.insert({"matid":last_id,"source":trx['source'],"target":trx["target"],"FIN":trx["status"]})
	return "Transfer success"	

@app.route('/updateTransfer',methods=['POST'])
def update_Transfer():
	updatedTrx = request.json
	last_id = last_matid()
	transfers = mongo.db.transfers
	transfers.update_one({'matid':last_id,'source':updatedTrx['source'],'target':updatedTrx['target']},{'$set':{'FIN':updatedTrx['status']}})

	return "Update Success"

@app.route('/getAdjMat',methods=['GET'])
def get_adjMat():
	adjMat = mongo.db.adjMat
	last_row = adjMat.find().sort('_id',d).limit(1)
	for doc in last_row:
		print(doc['_id'])
		last_id = doc['_id']
		mat = doc['mat']
	return jsonify({'mat':mat})

@app.route('/viz',methods=['GET'])
def view_viz():
	return render_template("test.html")

@app.route('/getTransfers',methods=['GET'])
def get_transfers():
	transfers=[]
	count=[]	
	last_id = last_matid()
	trx = mongo.db.transfers
	trx_rows = trx.find({'matid':last_id})

	## WRITE QUERY FOR COUNTING NUMBER OF TRANSFERS ON DISTINCT TARGETS
	for doc in trx_rows:
		print(doc)
		transfers.append({'source':doc['source'],'target':doc['target'],'status':doc['FIN']})
	print(transfers)

	return jsonify(transfers)

@app.route('/getLinks',methods=['GET'])
def getLinks():
	links = []
	adjMat = mongo.db.adjMat
	last_row = adjMat.find().sort('_id',d).limit(1)
	for doc in last_row:
		mat = doc['mat']
	print(mat)
	npmat = np.matrix(mat)
	length = len(npmat)
	for i in range(0,length):
		for j in range(0,length):
			print(npmat[j,i])
			if npmat[j,i]==1:
				links.append({'source':j,'target':i,'FIN':0})
	# print(links)
	return jsonify(links)    

@app.route('/getPR',methods=['GET'])
def getPR():
	nodes = []
	name = 65
	adjMat = mongo.db.adjMat
	last_row = adjMat.find().sort('_id',d).limit(1)
	for doc in last_row:
		mat = doc['mat']
	pr = pralgo.iniPR(mat)
	# print(pr[0][0])
	for i in range(0,len(pr)):
		nodes.append({'name':chr(name),'rank':pr[i][0],'count':0,'ip':""})
		name = name + 1
	return jsonify(nodes)


if __name__ == '__main__':
	app.run(debug=True)
