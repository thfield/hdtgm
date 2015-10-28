d3.json('data/repeats.json', function(error, data) {
  function chartRole(pageId, role){
    //TODO make function more reusable: http://bost.ocks.org/mike/chart/
    //TODO roll data file into more standard form, maybe array of objects with episode key?

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

    //TODO make this more elegant, possibly in reusable reformatting?
    if (role == 'actor'){
      var repeatRoles = 'repeatActors',
          moviesWithRepeatRoles = 'moviesWithRepeatActors',
          roleKey = 'actorKey'
          h = 950;
    } else if (role == 'director'){
      var repeatRoles = 'repeatDirectors',
          moviesWithRepeatRoles = 'moviesWithRepeatDirectors',
          roleKey = 'directorKey'
          h = 400;
    } else if (role == 'writer'){
      var repeatRoles = 'repeatWriters',
          moviesWithRepeatRoles = 'moviesWithRepeatWriters',
          roleKey = 'writerKey'
          h=400;
    }

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = (xIds.length*(2*radius+4)) - margin.left - margin.right,
        height =  h - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
        .range( [ 2*height/3, 2*height/3 - 2*radius, 2*height/3 - 2*radius, 2*height/3 - 2*radius] )
        .domain(['title', 'actor', 'director', 'writer']);

    var x = d3.scale.ordinal()
        .range( xIds.map(function(d,i){ return ( ((i+1) * width) / (xIds.length) + rem/2 ) + 4 }) )
        .domain( xIds );

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');

    var svgM = d3.select(pageId).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svgM.append('text')
        .attr('class', 'namebox');

    svgM.append('g').attr('class', 'titles').selectAll('.title')
        .data(xNames)
      .enter().append('text')
        .attr('class', function(d,i) { return 'title ' + xIds[i]; })
        .attr('transform', function(d) { return 'translate(' + x(d) + ',' + y("title")  + ')rotate(90)'})
        .attr('text-anchor', 'start')
        .text(function(d){ return d });

    var circles = svgM.append('g').attr('class', 'circles');

    for (var movie in data[moviesWithRepeatRoles] ){
      circles.selectAll('.circle')
          .data( data[moviesWithRepeatRoles][movie] )
        // .enter().append('text')
        .enter().append('circle')
          .attr('class', function(d) { return role + ' ' + d; })
          .attr("cy", function(d, i) { return y(role) - 3 * radius * i; })
          .attr("cx", function(d) { return (x(movie)+radius ); })
          .attr("fill", function(d) { return colorbrewer['Greys'][7][data[repeatRoles][d].length]; })
          .attr("r", radius)
          .on("mouseover", highlight )
          .on("mouseout", unhighlight );
    }
    function highlight(){
      var thisclass = d3.select(this).datum();
      d3.select(pageId + ' .namebox')
        .text(data[roleKey][thisclass] + ' (' + data[repeatRoles][thisclass].length +')');
      d3.selectAll('.' + thisclass).classed("active", true).transition().attr('r', 2*radius);
      data[repeatRoles][thisclass].forEach(function(d){ d3.select(pageId + ' .' + d).classed("active", true) });
    }
    function unhighlight(){
      var thisclass = d3.select(this).datum();
      d3.select(pageId + ' .namebox').text('');
      d3.selectAll('.' + thisclass).classed("active", false).transition().attr('r', radius);
      data[repeatRoles][thisclass].forEach(function(d){ d3.select(pageId + ' .' + d).classed("active", false) });
    }
  }

  chartRole('#actor-chart','actor');
  chartRole('#director-chart','director');
  chartRole('#writer-chart','writer');
  //TODO idea: move director/writer to single chart with color difference
});
