var width = 500,
    height = 500;

var links=[];
var nodes = [];
var transfers = [];
var type ;
var trxTimer;

function initStaticGraph(){
    
    var q = d3_queue.queue(1);

    q.defer(d3.xhr, '/getPR')
        .defer(d3.xhr, '/getLinks')
        .awaitAll(cleanNodesAndLinks);
}


function cleanNodesAndLinks(err,results){
    if (err){
        console.log("THERE WAS AN ERROR ENCOUNTERED WHILE LOADING NODES AND LINKS: "+err)
    }
    else{
        nodes = JSON.parse(results[0].response)
        links = JSON.parse(results[1].response)

        }
    for (i=0;i<2;i++)
    {
    drawStaticGraph(i);
    }
}
    
function drawStaticGraph(t){
   type=t;
    var radiusScale = d3.scale.linear()
    radiusScale.domain(d3.extent(nodes,function(d){return d.rank}))
                .range([20,60])
    var pracRadiusScale = d3.scale.linear()
    pracRadiusScale.domain(d3.extent(nodes,function(d){return d.count}))
                .range([15,40])

    var force = d3.layout.force()
    .size([width, height])
    .nodes(nodes)
    .links(links)
    /*.charge(-300)*/
    .linkDistance(height/2)
    ;
    force.start();

    if (type == 0){
    playArea = "#theoretical"
    }
    else{
    playArea = "#practical"
    }

    var svg = d3.select(playArea).append('svg:svg')

    .attr('width', width)
    .attr('height', height);

    svg.append("svg:defs").append("svg:marker")
    .data(nodes)
    .attr("id", "triangle")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", function(d){return radiusScale(d.rank);})
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 12)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .style("fill", "#008CC9");



    var link = svg.append("svg:g").selectAll("line")
    .data(force.links())
    .enter().append("svg:line")

    .attr("marker-end", "url(#triangle)");



    var drag = force.drag()
    .on("dragstart", dragstart);  


    var node = svg.selectAll(".node")
    .data(force.nodes())
    .enter().append("g")
    .attr("class", function(d){
    return "node " + d.name;
    })
    .call(drag);

    // add the nodes
    node.append("circle")
    .attr("r",function(d) { if (type == 0){return (radiusScale(d.rank))} else{return 10+(2*d.count)}/**100+15*/;});

    var texts = svg.selectAll("text.label")
            .data(nodes)
            .enter().append("text")
            .attr("class", "label")
            .attr("fill", "black")
            .text(function(d) {  return d.name;  });
    /* node.each(function(d){
        d3.select(this).classed(d.className, true)
    });*/
    function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true)
    //.style("fill", function(d) { return colorScale(d.rank); })
    };


    force.on("tick", function() {

    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) {
        if(d.source.x>d.target.x)
        {return (d.target.x);}
        else
        {
            return (d.target.x);
        }
    })
    .attr("y2", function(d){
        if(d.source.y>d.target.y)
        {return (d.target.y);}
        else
        {
            return (d.target.y);
        }
    })
    .attr('class',(function(d)
    {
        /*console.log("link " + d.source.name + d.target.name); */
        return ("link " + d.source.name + d.target.name);
    }))

    /*.attr("marker-end", "url(#triangle)");*/


    node
    .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; });

    texts.attr("transform", function(d) {
    
    if(type==1){
    return "translate(" + (d.x+(pracRadiusScale(d.count)/*d.rank*100*/)) + "," + (d.y+5) + ")";
        }
        else{
         return "translate(" + (d.x+(radiusScale(d.rank)/*d.rank*100*/)) + "," + (d.y+5) + ")";   
        }
        }

    );


    })

    tooltip = d3.select("body")
        .append("div")
        .attr('class','tip')
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    d3.selectAll("#theoretical .node").on("mouseover", function(d) {
            
            return (tooltip.style("visibility", "visible")
                .html("Node Name: " + d.name + "<br>" + " IP: " + d.ip + "<br>" + " Eigen Value: "+ d.rank));
            
        })
        .on("mousemove", function() {
            /*console.log("Move");*/
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            
        })
        .on("mouseout", function() {
            /*console.log("Out");*/
            return tooltip.style("visibility", "hidden");
        });
    d3.selectAll("#practical .node").on("mouseover", function(d) {
            
            return (tooltip.style("visibility", "visible")
                .html("Node Name: " + d.name + "<br>" + " IP: " + d.ip + "<br>" + " Times Targeted "+ d.count));
            
        })
        .on("mousemove", function() {
            /*console.log("Move");*/
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
            
        })
        .on("mouseout", function() {
            /*console.log("Out");*/
            return tooltip.style("visibility", "hidden");
        });
}


function loadTransfers(){
    d3.select('#splash').style('visibility','visible')
    var q = d3_queue.queue(1);
    console.log("CALL TO TRANSFER API")
    q.defer(d3.xhr,'/getTransfers')

        .awaitAll(cleanTransfer);
}

function cleanTransfer(err,results){
    if(err){
        console.log("THERE WAS AN ERROR ENCOUNTERED WHILE LOADING TRANSFERS: " + err)
    }
    else{
        transfers = JSON.parse(results[0].response)
    }

    drawTransfers();
}

function drawTransfers(){
    
    var colorScale = d3.scale.linear();

    colorScale.domain([0,20])
                .range(['#FFE2D2','#98041B'])


    nodes.forEach(function(d){
        d.count =0;
    })

    transfers.forEach(function(d){
        var index = d.target.charCodeAt(0)-65; 

        if (d.status==2){
        nodes[index].count = nodes[index].count+1 ;
        }
    }
        )


    d3.select('#practical').remove()

    d3.select('.viz-body.practical').append('div').attr('id','practical'); 

    var trxListElem = d3.select('.trx.list-group')

        trxListElem.selectAll('li').remove();
    
    d3.select('#splash').style('visibility','hidden')
    drawStaticGraph(1);

    transfers.forEach(function(d){
        var area = '#practical '
        
            var link = area+'.'+d.source+d.target
            var source = area+'.'+d.source
            var target =area+ '.'+d.target
            d3.select(target).style('fill',colorScale(nodes[d.target.charCodeAt(0)-65].count))
        if (d.status == 1){
            var li = trxListElem.append('li').attr('class','list-group-item').style('background-color','#8F6CAA').style('color','#F2F2F2')
            li.text("Transferring from " + d.source + " to " + d.target);
        }
        else if (d.status == 2){
            var li = trxListElem.append('li').attr('class','list-group-item').style('background-color','#DC4B89').style('color','#F2F2F2')
            li.text("Transferred from " + d.source + " to " +d.target);   
            /*d3.select(link).style('stroke','green')
            d3.select(source).style('fill','orange')*/
            /*d3.select(target).style('fill',colorScale(nodes[d.target.charCodeAt(0)-65].count))*/

        }
        
        
    });
    
}

function startPolling(){
    d3.select('#trxList').style('visibility','visible')
    d3.select('#splash').style('visibility','visible')
    trxTimer = window.setInterval(function(){loadTransfers()},10000);
}

function stopPolling(){

    clearInterval(trxTimer);
    console.log("Cleared Interval")
}

function insertNode(){
    var allListItems = d3.selectAll('#addIPAddress .list-group-item')
    var countLI= allListItems[0].length;
    var nextNode = String.fromCharCode(countLI + 65)
    var ul = d3.select('#addIPAddress .list-group');
    var appText = nextNode + ": "
    var li = ul.append('li').attr('class','list-group-item')
    li.text(appText)
    li.append('input').attr('type','text')
}

function saveNode(){
    var nodeName=[];
    var IP =[];
    var li = d3.selectAll('#addIPAddress .list-group-item')

    li[0].forEach(function (d){
        var element = d.childNodes; 
        nodeName = nodeName.concat(element[0].wholeText.charAt(0)); 
        IP = IP.concat(element[1].value); 
    })

    nodes.forEach(function(d,i){
        d.ip =  IP[i];
    })


}

function showConfigScreen(){
    var configScreen = d3.select('#config');

    configScreen.style('visibility','visible');
}

function closeConfig(){
    var configScreen = d3.select('#config');

    configScreen.style('visibility','hidden');
}
