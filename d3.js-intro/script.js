// Set Spacing Guidelines
var margin = {top: 125, right: 75, bottom: 100, left: 100} 
var width = 800 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;
var barPadding = 20;
var colors = ["#FDBF11", "#55A7ED"];

// Create and size svg
var svg = d3.select("#chart")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom);

// Create and place start of SVG g tag, where bar chart will appear
var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 

// Read in data and handle error
d3.json("sample.json",function(error, data) {
	if (error) {
    console.log(error);
  } else {
    makeBarchart(data);
  };
})


function makeBarchart(data = data){

	// Sort data
	var sorted_data = data.sort(function(x, y){
		return d3.descending(x.requests_per_10000, y.requests_per_10000)});

	// Setup x scale
	var xScale = d3.scaleBand()
		.domain(sorted_data.map(function (d) {return d.community;}))
		.range([0, width]);

	// Setup y scale
	var yScale = d3.scaleLinear()
		.domain(d3.extent(sorted_data, function(d) { return d.requests_per_10000;}))
		.range([0,height])
		.nice();

	// Create rects as individual negative bar
	var bars = g.selectAll(".bars")
		.data(sorted_data)
		.enter()
		.append("rect")
		.attr("class", "bars")
		.attr("x", function(d, i){ return i * (width / sorted_data.length) + barPadding/2;}) 
		.attr("y", 0)
		.attr("width",  width / sorted_data.length - barPadding)
		.attr("height", function(d){return yScale(d.requests_per_10000);})
		.style("fill", function(d){
			var col;
			if (d.majority == "Hispanic") { col = colors[0];}
			else {col = colors[1];}
			return col;
			})



}