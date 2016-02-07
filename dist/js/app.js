(function () {
"use strict";
d3.json('data/nameKey.json', function(error, nameKey) {
d3.json('data/episodes-processed.json', function(error, episodes) {
  function chartRole(pageId, roles){
    //TODO make function more reusable: http://bost.ocks.org/mike/chart/
    //TODO roll data file into more standard form, maybe array of objects with episode key?

    var xIds = [],
        xNames = [];

    var h = 850,
        radius = 3.5,
        rem = 12;

    // var roles = ['title', 'actor', 'director', 'writer'];
    // dots of later roles are placed over top dots of earlier roles.
    // use a layout? count circles that are already along x?

    episodes.forEach(function(d){
        xIds.push(d.imdbID);
        xNames.push(d.title);
    });

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = (xIds.length*(2*radius+4)) - margin.left - margin.right,
        height =  h - margin.top - margin.bottom;

    var y = d3.scale.ordinal()
        .range( [ 2*height/3, 2*height/3 - 2*radius] )
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

    svgM.append('g').attr('class', 'person').selectAll('.person')
        .data(xNames)
      .enter().append('text')
        .attr('class', function(d,i) { return 'title ' + xIds[i]; })
        .attr('transform', function(d) { return 'translate(' + x(d) + ',' + y("title")  + ')rotate(90)'})
        .attr('text-anchor', 'start')
        .text(function(d){ return d });

    var circles = svgM.append('g').attr('class', 'circles');

    roles.forEach(function(role){
      episodes.forEach(function(movie){
        if (movie.repeats[role]){
          circles.selectAll('.circle')
              .data( movie.repeats[role] )
            .enter().append('circle')
              .attr('class', function(d) { return role + [nameKey[d].repeats[role].length] + ' ' + movie.imdbID + ' ' + d; })
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
          thisrole = /[a-z]+/.exec(me[0][0].classList[0])[0],
          thisMovie = me[0][0].classList[1], //figure out how to instead save titleId in data() of circle
          thisText = nameKey[thisInd].name + ' (' + nameKey[thisInd].repeats[thisrole].length +') '+ thisrole;

      // d3.select(pageId + ' .namebox')
      //   .text(nameKey[thisInd].name + ' (' + nameKey[thisInd].repeats[thisrole].length +') '+ thisrole );
      ttFollow(me, thisText)
      d3.selectAll('.' + thisInd).classed("active", true).transition().attr('r', 2*radius);
      d3.select(pageId + ' .' + thisInd).classed("active", true) ;
      d3.select(pageId + ' .' + thisMovie).classed("active", true) ;
      nameKey[thisInd].repeats[thisrole].forEach(function(d){ d3.select(pageId + ' .' + d).classed("active", true) });
    }

    function unhighlight(){
      var me = d3.select(this),
      thisInd = me.datum(),
      thisrole = /[a-z]+/.exec(me[0][0].classList[0])[0],
      thisMovie = me[0][0].classList[1];

      ttHide();
      // d3.select(pageId + ' .namebox').text('');
      d3.selectAll('.' + thisInd).classed("active", false).transition().attr('r', radius);
      d3.selectAll('.' + thisMovie).classed("active", false);
      nameKey[thisInd].repeats[thisrole].forEach(function(d){ d3.select(pageId + ' .' + d).classed("active", false) });
    }
  }

  function ttFollow(element, caption, options) {
    element.on('mousemove', null);
    element.on('mousemove', function() {
      var position = d3.mouse(document.body);
      d3.select('#tooltip')
        .style('top', ( (position[1] + 30)) + "px")
        .style('left', ( position[0]) + "px");
      d3.select('#tooltip .value')
        .text(caption);
    });
    d3.select('#tooltip').classed('hidden', false);
  };

  function ttHide() {
    d3.select('#tooltip').classed('hidden', true);
  }

  chartRole('#actor-chart', ['title', 'actor']);
  // chartRole('#director-chart', ['title', 'director']);
  // chartRole('#writer-chart',['title', 'writer']);


});
});
}());