var nodes=[];
var links=[];
var graph = [];

/*
var width = document.body.clientWidth;
var height = document.body.clientHeight/2;*/
function loadData(){
    var q = d3_queue.queue();
    
    q.defer(d3.json,'/data/nodes.json')
     .defer(d3.json,'/data/links.json')
        
        .awaitAll(prepGraph);
}

function prepGraph(err,data){
    if(err){
        console.log(err);
    }
    /*console.log(data);
    data.forEach(function(d){
        console.log(d);
    })*/
    console.log(data);
    graph = data;
    /*nodes = data[0];
    links = data[1];*/
    console.log("Data Loaded");
    createViz();
}

function createViz(){
    graph = counts
    nodes = graph[0];
    links = graph[1];
    var svg = d3.select("#theoretical")
                .append('svg')
                .attr('width',600)
                .attr('height',400);
                
                
    var force = d3.layout.force()
    .size([500, 300])
    .nodes(nodes)
    .links(links);
    
    force.linkDistance(250);
    
    var link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link');

// Now it's the nodes turn. Each node is drawn as a circle.

var node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('circle')
    .attr('class', 'node');
    
    node.append("text")
    .attr("x", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });
;

// We're about to tell the force layout to start its
// calculations. We do, however, want to know when those
// calculations are complete, so before we kick things off
// we'll define a function that we want the layout to call
// once the calculations are done.

force.on('end', function() {

    // When this function executes, the force layout
    // calculations have concluded. The layout will
    // have set various properties in our nodes and
    // links objects that we can use to position them
    // within the SVG container.

    // First let's reposition the nodes. As the force
    // layout runs it updates the `x` and `y` properties
    // that define where the node should be centered.
    // To move the node, we set the appropriate SVG
    // attributes to their new values. We also have to
    // give the node a non-zero radius so that it's visible
    // in the container.

    node.attr('r', function(d)  { return (300/10)/d.rank})
        .attr('cx', function(d) { return d.x; })
        .attr('cy', function(d) { return d.y; });

    // We also need to update positions of the links.
    // For those elements, the force layout sets the
    // `source` and `target` properties, specifying
    // `x` and `y` values in each case.

    link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

});

// Okay, everything is set up now so it's time to turn
// things over to the force layout. Here we go.

force.start();
}