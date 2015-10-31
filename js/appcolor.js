"use strict";
d3.json('data/episodeswrepeats.json', function(error, data) {
  function chartRole(pageId, roles){
    //TODO make function more reusable: http://bost.ocks.org/mike/chart/
    //TODO roll data file into more standard form, maybe array of objects with episode key?

    var xIds = [],
        xNames = [];

    var h = 950,
        radius = 4,
        rem = 12;

    // var roles = ['title', 'actor', 'director', 'writer'];
    // dots of later roles are placed over top dots of earlier roles.
    // use a layout? count circles that are already along x?


    data.episodes.forEach(function(d){
        xIds.push(d.imdbID);
        xNames.push(d.title);
    });

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = (xIds.length*(2*radius+4)) - margin.left - margin.right,
        height =  h - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
        .range( [ 2*height/3, 2*height/3 - 2*radius, 2*height/3 - 2*radius, 2*height/3 - 2*radius] )
        .domain(roles.shift());

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

    roles.forEach(function(role){
      data.episodes.forEach(function(movie){
        if (movie.repeats[role]){
          circles.selectAll('.circle')
              .data( movie.repeats[role] )
            .enter().append('circle')
              .attr('class', function(d) { return role + [data.nameKey[d].repeats[role].length] + ' ' + d; })
              .attr("cy", function(d, i) { return y(role) - 3 * radius * i; })
              .attr("cx", function(d) { return (x(movie.imdbID)+radius ); })
              .attr("r", radius)
              .on("mouseover", highlight )
              .on("mouseout", unhighlight );
        };
      });
    });

    function highlight(){
      var me = d3.select(this),
          thisInd = me.datum(),
          thisrole = /[a-z]+/.exec(me[0][0].classList[0])[0];

      d3.select(pageId + ' .namebox')
        .text(data.nameKey[thisInd].name + ' (' + data.nameKey[thisInd].repeats[thisrole].length +')');
      d3.selectAll('.' + thisInd).classed("active", true).transition().attr('r', 2*radius);
      d3.select(pageId + ' .' + thisInd).classed("active", true) ;
      // data.nameKey[thisInd].forEach(function(d){ d3.select(pageId + ' .' + d).classed("active", true) });
    }
    function unhighlight(){
      var thisInd = d3.select(this).datum();
      d3.select(pageId + ' .namebox').text('');
      d3.selectAll('.' + thisInd).classed("active", false).transition().attr('r', radius);
    //   data[repeatRoles][thisInd].forEach(function(d){ d3.select(pageId + ' .' + d).classed("active", false) });
    }
  }

  chartRole('#actor-chart', ['title', 'actor']);
  chartRole('#director-chart', ['title', 'director']);
  chartRole('#writer-chart',['title', 'writer']);
  //TODO idea: move director/writer to single chart with color difference
});
