import sys
import requests as r
import json


if(len(sys.argv)!=4):
	print( "Incorrect usage")
	print ("To insert transfer correct usage: python --filename.py --source --target --updated_status: (1 = started) (2 = finished)")
	sys.exit()

headers = {'content-type': 'application/json'}
data = {'source': sys.argv[1],'target' : sys.argv[2],'status':sys.argv[3]}
r1 = r.post('http://localhost:5000/addTransfers',json.dumps(data),headers=headers)