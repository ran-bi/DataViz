// Set Spacing Guidelines
var margin = {top: 125, right: 75, bottom: 100, left: 75} 
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

	// Add the x axis
	svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(d3.axisTop(xScale))

	// Add the y axis
	svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(d3.axisLeft(yScale));

	// Text label for the x axis
	svg.append("text")             
		.attr("transform", "translate(" + (width/2 + margin.left) + " ," + (margin.top *3/4) + ")")
		.style("text-anchor", "middle")
		.text("Community")
		.attr("class", "axisLabel");

	// Text label for the y axis
	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", margin.left/2)
		.attr("x",0 - (height + margin.top)/2)
		.style("text-anchor", "middle")
		.text("Requests / 10,000 population")
		.attr("class", "axisLabel");

	// Add graph title
	svg.append("text")
		.attr("transform", "translate(" + (width/2 + margin.left) + "," + margin.top/4 + ")")
		.style("text-anchor", "middle")
		.text("Number of Graffiti Removal Requests in Selected Communities")
		.attr("class", "title");


	// Add subtitle
	svg.append("text")
		.attr("transform", "translate(" + (width/2 + margin.left) + "," + margin.top/2 + ")")
		.style("text-anchor", "middle")
		.text("Hispanic communities show higher requests volume")
		.attr("class", "subTitle");

	// Add legends

	svg.append("rect")
		.attr("x", margin.left + width * 3 / 4)
		.attr("y", margin.top + height * 5 / 6 )
		.attr("width", 30)
		.attr("height", 30)
		.style("fill", colors[0]);

	svg.append("rect")
		.attr("x", margin.left + width * 3 / 4)
		.attr("y", margin.top + height * 5 / 6 + 40)
		.attr("width", 30)
		.attr("height", 30)
		.style("fill", colors[1]); 







}