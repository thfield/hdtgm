d3.json('data/repeats.json', function(error, data) {
  var xIds = [],
      xNames = [];

  var radius = 4,
      rem = 12;

  data.movieKey.forEach(function(d){
    if (d) {
      xIds.push(d.id);
      xNames.push(d.title);
    }

  });
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = (xIds.length*(2*radius+4)) - margin.left - margin.right,
      height =  540 - margin.top - margin.bottom;

  var y = d3.scale.ordinal()
      .range( [ height/2, height/2 - 2*radius, height/2, height/4] )
      .domain(['Title', 'Actors', 'Director', 'Writer']);

  var x = d3.scale.ordinal()
      .range( xIds.map(function(d,i){ return ( ((i+1) * width) / (xIds.length) + rem/2 ) + 4 }) )
      .domain( xIds );

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom');

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

  var svgM = d3.select('#chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  svgM.selectAll('.title')
      .data(xNames)
    .enter().append('text')
      .attr('class', function(d,i) { return 'title ' + xIds[i]; })
      .attr('transform', function(d) { return 'translate(' + x(d) + ',' + y("Title")  + ')rotate(90)'})
      .attr('text-anchor', 'start')
      .text(function(d){ return d });

  svgM.append('text')
      .attr('class', 'namebox');

  for (var movie in data.moviesWithRepeatActors ){
    svgM.selectAll('.circle')
        .data( data.moviesWithRepeatActors[movie] )
      // .enter().append('text')
      .enter().append('circle')
        .attr('class', function(d) { return 'actor ' + d; })
        .attr("cy", function(d, i) { return y( 'Actors' ) - 3 * radius * i; })
        .attr("cx", function(d) { return (x(movie)+radius ); })
        .attr("fill", function(d) { return colorbrewer['Greys'][7][data.repeatActors[d].length]; })
        .attr("r", radius)
        .on("mouseover", highlight )
        .on("mouseout", unhighlight );
  }

  function highlight(){
    var thisclass = d3.select(this).data()[0];
    // console.log(data.repeatActors[thisclass].length))
    d3.select('.namebox').text(data.actorKey[thisclass] + ' (' + data.repeatActors[thisclass].length +')');
    d3.selectAll('.' + thisclass).classed("active", true).attr('r', 2*radius);
    data.repeatActors[thisclass].forEach(function(d){ d3.select('.' + d).classed("active", true) });
  }
  function unhighlight(){
    var thisclass = d3.select(this).data()[0];
    d3.select('.namebox').text('');
    d3.selectAll('.' + thisclass).classed("active", false).attr('r', radius);
    data.repeatActors[thisclass].forEach(function(d){ d3.select('.' + d).classed("active", false) });
  }

});
