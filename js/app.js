$(document).ready(function ( ) {

	function countCrew(database, credit) {
		var personCount = [];
		for (var movie = 0; movie < database.length; movie++) {
		  var crew = [];
		  switch (credit) {
		  	case "actors":
			  	crew = database[movie].actors;
			  	break;
			  case "directors":
			  	crew = database[movie].directors;
			  	break;
			  case "writers":
			  	crew = database[movie].writers;
			  	break;	
			  default: 
			  	break;	
			 }
		  for (var i = 0; i < crew.length; i++) {
		    var role, imdbID, title = database[movie].title ;
			 	(credit === "actors") ? ( role = crew[i].actorName, imdbID = crew[i].actorId )
			 												: ( role = crew[i].name, imdbID = crew[i].nameId ) ;
		    var foundIndex = -1 ;
		    $.map(personCount, function(obj, index) {
			    if(obj.name === role) { foundIndex = index };	 
			  });
			  (foundIndex != -1) ? (personCount[foundIndex].count += 1, personCount[foundIndex].titles.push(title) )
			  									 : personCount.push({ name: role, count: 1, imdb: imdbID, titles: [title] });
		  }
		}

		for(var i = personCount.length;  i-- ;){
			if (personCount[i].count < 2 ) personCount.splice(i, 1);
		}
		return personCount;
	}

	function drawCastCrew(data, cssTarget){
		//console.log(data);
		var margin = {top: 20, right: 20, bottom: 120, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .15, 1);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-10, 0])
			  .html(function(d) {
			    return "<span>"+ d.name +" has been in " + d.count + " HDTGM movies:</span>"+  d.titles;
				})
			  ;	

		var svg = d3.select(cssTarget).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		svg.call(tip);

		x.domain(data.sort(function(a, b) { return b.count - a.count; })	
	        			 .map(function(d) { return d.name; }));
	  y.domain([0, d3.max(data, function(d) { return d.count; })]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	      .selectAll("text")  
            .style("text-anchor", "start")
            .attr("dx", ".8em")
            .attr("dy", "-.15em")
            .attr("transform", function(d) {
                return "rotate(65)" 
            });

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("HDTGM Movies");

	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.name); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.count); })
	      .attr("height", function(d) { return height - y(d.count); })
	      .on('mouseover', tip.show)
      	.on('mouseout', tip.hide);
	}

	function countCategory(database, category) {
		var catCounts = [];
		for (var movie = 0; movie < database.length; movie++) {
		  var cat =[];
		  switch (category) {
		  	case "rated":
			  	cat = database[movie].rated;
			  	break;
			  case "year":
			  	cat = database[movie].year;
			  	break;
			  case "genres":
			  	cat = database[movie].genres;
			  	break;	
			  default: 
			  	break;	
			}
		    var currentCat, title = database[movie].title ;
			 	(category === "genres") ? ( currentCat = cat[i] )
			 												: ( currentCat = cat ) ;
		    var foundIndex = -1 ;
		    $.map(catCounts, function(obj, index) {
			    if(obj.category === currentCat) { foundIndex = index };	 
			  });
			  (foundIndex != -1) ? (catCounts[foundIndex].count += 1, catCounts[foundIndex].titles.push(title) )
			  									 : catCounts.push({ category: currentCat, count: 1, titles: [title] });
		  
		}
		//for(var i = catCounts.length;  i-- ;){
		//	if (catCounts[i].count < 2 ) catCounts.splice(i, 1);
		//}
		console.log(catCounts);
		return catCounts;
	}

	function countGenres(database, category) {
		var catCounts = [];
		for (var movie = 0; movie < database.length; movie++) {
		  var cat =[];
		  cat = database[movie].genres;
			for (var genre in cat) {
		    var currentCat, title = database[movie].title ;
			 	currentCat = cat[genre];
		    var foundIndex = -1 ;
		    $.map(catCounts, function(obj, index) {
			    if(obj.category === currentCat) { foundIndex = index };	 
			  });
			  (foundIndex != -1) ? (catCounts[foundIndex].count += 1, catCounts[foundIndex].titles.push(title) )
			  									 : catCounts.push({ category: currentCat, count: 1, titles: [title] });
		  }
		}
		//for(var i = catCounts.length;  i-- ;){
		//	if (catCounts[i].count < 2 ) catCounts.splice(i, 1);
		//}
		return catCounts;
	}

	function countRated(database, category) {
		var catCounts = [];
		for (var movie = 0; movie < database.length; movie++) {
		  var cat = database[movie].rated;
			
		    var currentCat = cat, 
		    		title = database[movie].title ;
		    var foundIndex = -1 ;
		    $.map(catCounts, function(obj, index) {
			    if(obj.category === currentCat) { foundIndex = index };	 
			  });
			  (foundIndex != -1) ? (catCounts[foundIndex].count += 1, catCounts[foundIndex].titles.push(title) )
			  									 : catCounts.push({ category: currentCat, count: 1, titles: [title] });
		  
		}
		//for(var i = catCounts.length;  i-- ;){
		//	if (catCounts[i].count < 2 ) catCounts.splice(i, 1);
		//}
		return catCounts;
	}

	function drawPie(data, cssTarget){
		var width = 960,
		    height = 500,
		    radius = Math.min(width, height) / 2;

		var color = d3.scale.ordinal()
		    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

		var arc = d3.svg.arc()
		    .outerRadius(radius - 10)
		    .innerRadius(0);

		var pie = d3.layout.pie()
		    .sort(null)
		    .value(function(d) { return d.count; });

		var svg = d3.select(cssTarget).append("svg")
		    .attr("width", width)
		    .attr("height", height);

		  var g = svg.append("g")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		    .selectAll(".arc")
		      .data(pie(data))
		    .enter().append("g")
		      .attr("class", "arc");

		  g.append("path")
		      .attr("d", arc)
		      .style("fill", function(d) { return color(d.data.category); });

		  g.append("text")
		      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
		      .attr("dy", ".35em")
		      .style("text-anchor", "middle")
		      .text(function(d) { return d.data.count; });    

		//var legend = d3.select("body").append("svg")
		var legend = svg.append("g")
	      .attr("class", "legend")
	      .attr("width", radius * 2)
	      .attr("height", radius * 2)
	    .selectAll("g")
	      .data(color.domain().slice().reverse())
	    .enter().append("g")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("rect")
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color);

	  legend.append("text")
	      .attr("x", 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .text(function(d) { return d; });
	}

	function drawBar(data, cssTarget){
		//console.log(data);
		var margin = {top: 20, right: 20, bottom: 120, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .15, 1);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var tip = d3.tip()
			  .attr('class', 'd3-tip')
			  .offset([-10, 0])
			  .html(function(d) {
			    return "<span>" + d.count + " HDTGM movies in " +d.category+": </span>"+  d.titles;
				})
			  ;	

		var svg = d3.select(cssTarget).append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		svg.call(tip);

		//x.domain(data.sort(function(a, b) { return b.count - a.count; })	
		x.domain(data.sort(function(a, b) { return a.category - b.category; })	
	        			 .map(function(d) { return d.category; }));
	  y.domain([0, d3.max(data, function(d) { return d.count; })]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	      .selectAll("text")  
            .style("text-anchor", "start")
            .attr("dx", ".8em")
            .attr("dy", "-.15em")
            .attr("transform", function(d) {
                return "rotate(65)" 
            });

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("HDTGM Movies");

	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.category); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.count); })
	      .attr("height", function(d) { return height - y(d.count); })
	      .on('mouseover', tip.show)
      	.on('mouseout', tip.hide);
	}

	$.getJSON("data/list_actors.json", function(alldata) {
	 	
	 	//console.log(countCategory(alldata, "rated"));

		/*
		drawCastCrew(countCrew(alldata, "actors"), ".drawActors");
		drawCastCrew(countCrew(alldata, "directors"), ".drawDirectors");
		drawCastCrew(countCrew(alldata, "writers"), ".drawWriters");
		*/
		drawPie(countRated(alldata, "rated"), ".drawRatings");
		
		drawBar(countGenres(alldata, "genres"), ".drawGenres");
		
		drawBar(countCategory(alldata, "year"), ".drawYear");

	});

});