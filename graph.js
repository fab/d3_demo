var width = 1500,
    height = 600;

var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

var enabledDimensions = [1,2,3,4,5,6];

var color = d3.scale.category10();

var force = d3.layout.force()
    .charge(-50)
    .linkDistance(function(d) {
      return distanceBetween(d.source.vector, d.target.vector) * 3;
    })
    .friction(0)
    .gravity(0)
    .linkStrength(0.5)
    .size([width, height]);

d3.json("entities.json", function(error, graph) {
  for (var i=0; i < graph.nodes.length; i++) {
      graph.nodes[i].x = 0.5*width;
      graph.nodes[i].y = 0.5*height;
  }
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.number); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.number; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
});

function distanceBetween(vector1, vector2) {
  var sum = 0
    for (var i = 0; i < enabledDimensions.length; i++){
      var dimension = enabledDimensions[i];
      sum += Math.pow((vector1[dimension - 1] - vector2[dimension - 1]), 2);
    }
  return Math.sqrt(sum);
}

$(document).ready(function() {
  $('a').on('click', function(e) {
    e.preventDefault();
    $(this).parent().toggleClass('active');
    var dimension = parseInt($(this).attr('id'));
    var index = enabledDimensions.indexOf(dimension);
    if (index == -1) {
      enabledDimensions.push(dimension);
    }
    else {
      enabledDimensions.splice(index, 1);
    }
    force.start();
  });
});
