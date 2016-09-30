import sys
import requests as r
import json

if(len(sys.argv)!=2):
	print( "Incorrect usage")
	print ("To insert matrix correct usage: python --filename.py --adajcentary matrix string")
	sys.exit()

headers = {'content-type': 'application/json'}
data = {'adjMat': sys.argv[1]}
r1 = r.post('http://localhost:5000/addMat',json.dumps(data),headers=headers)