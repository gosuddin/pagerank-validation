var nodes = []
var links = []
var width = 800
var height = 400
function loadGraph(){
	var q = d3_queue.queue(1);

    q.defer(d3.xhr, '/getPR')
        .defer(d3.xhr, '/getLinks')
        .awaitAll(testmerge);
}

function testmerge(err,results){
	if (err){
		console.log(err);
	}
	else{
		nodes = JSON.parse(results[0].response)
		links = JSON.parse(results[1].response)

		}
	
	drawStaticGraph()
}

function drawStaticGraph(){
	var svg = d3.select('#theoretical').append('svg')
    .attr('width', width)
    .attr('height', height);

    var force = d3.layout.force()
    .size([width, height])
    .charge(-300)
    .linkDistance(100)
    .nodes(nodes)
    .links(links)
    .on('tick',function(){
    	link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

      
      node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    })
    .start();

    var drag = force.drag()
    .on("dragstart", function(d){
    	d3.select(this).classed("fixed", d.fixed = true);
    });

    var link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link');

	var node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('circle')
    .attr('class', 'node')
    .call(drag);

    force.on('end',function(){
    	node.attr('r', function(d){ return d.rank*200})
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });

        link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });
    });

   
    
}



  