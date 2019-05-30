

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

d3.csv("./assets/data/data.csv").then(function(census_data) {


    census_data.forEach(function(data) {
        data.state = data.state;
        data.abbr = data.abbr;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    })


    var xScale = d3.scaleLinear()
    .domain([d3.min(census_data, d => d.poverty), d3.max(census_data, d => d.poverty)])
    .range([0, width]);

    var yScale = d3.scaleLinear()
    .domain([0, d3.max(census_data, d=>d.healthcare)])
    .range([height, 0]);



    var circlesGroup = chartGroup.selectAll("circle")
    .data(census_data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "5")
    .attr("fill", "red")
    .style("opacity", 0.5)
    .append('text')
    .attr("dx", function(d){return -20})
    .text(d=>d.abbr);

    var yAxis = d3.axisLeft(yScale);
    var xAxis = d3.axisBottom(xScale);
// set x to the bottom of the chart
  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis);

  chartGroup.append("g")
  .call(yAxis);

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .text("Healthcare");

  chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`)
  .append("text")
  .attr("x", 0)
  .attr("y", 20)
  .text("In Poverty (%)");
})


// When the browser window is resized, responsify() is called.

