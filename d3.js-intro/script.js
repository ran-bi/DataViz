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