import numpy as np
transfer = []
    #! Calculate PageRank
    #! Calculate PageRank
def calculatePageRank(transitionMat):
    print(transitionMat)
    lenOfV = (np.sqrt(transitionMat.size));
    v = np.ones((lenOfV,1));   
    p = np.zeros((lenOfV,1));
    for i in range(0,int(lenOfV)):
        v[i] = 1/lenOfV; 
    count = 0;
    diff = 1;
    while(not(diff < 0.0001)):
        p= np.dot(transitionMat,v);
        
        #print ("value of previous " , p.sum() , "value of previous " , v.sum() )
        diff = abs(p.sum() - v.sum());
        v = p;
        count = count + 1;
    # print(count);
    # print(v); 
    # toJSON(v);
    return v

def adjToTranMat(aMat):
    m = aMat;
    count=0
    length=len(m)
    trans=np.empty([length, length])
    countadj=np.empty([length])
    for i in range(0,length):
        count=0
        for j in range(0,length):
            if m[j,i]==1:
                count+=1
        countadj[i]=count
        for k in range(0,length):
            if m[k,i]==1:
                trans[k,i]=round(1/countadj[i],3)
            else:
                trans[k,i]=0
    return trans
    
    
    #MAIN FUNCTIOnN

# def toJSON(v):
#     results = v;
#     print(results)
    

def iniPR(adjMat):
    
    #CREATE ADJACENTARY MATRIX
    adjacentaryMat = np.matrix(adjMat);
    
    #print(adjacentaryMat)
    
    #CREATE TRANSITION MATRIX
    transitionMat = adjToTranMat(adjacentaryMat);
    #print("Size of transitionMat "+ transitionMat.size);
            
    #CALL PAGERANK        
    return calculatePageRank(transitionMat);

if __name__ == '__main__':
    iniPR("0 1 1 0; 1 0 0 1; 1 0 0 1; 1 1 0 0")