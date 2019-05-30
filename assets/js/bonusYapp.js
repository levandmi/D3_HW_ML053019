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

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(census_data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(census_data, d => d[chosenXAxis]) *.95,
      d3.max(census_data, d => d[chosenXAxis])*1.05])
    .range([0, width]);

  return xLinearScale;

}



// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


// =====================y==========================
var chosenYAxis = "obesity";

// function used for updating y-scale var upon click on axis label
function yScale(census_data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(census_data, d => d[chosenYAxis]) *.95,
      d3.max(census_data, d => d[chosenYAxis])*1.05])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

  
// =====================y==========================




// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d=> newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var dollar = ""
    var xlabel = "Poverty:"
    var ending = "%"
    if (chosenYAxis === "obesity"){
        var ylabel = "Obesity:"
    }
    else if (chosenYAxis === "smokes"){
        var ylabel = "Smokes:"
    }
    else {
        var ylabel = "Lacks Healthcare:"
    }
  }
// =====================================================

  else if (chosenXAxis === 'income') {
    var dollar = "$"
    var xlabel = "Income:"
    var ending = "%"
    if (chosenYAxis === "obesity"){
        var ylabel = "Obesity:"
    }
    else if (chosenYAxis === "smokes"){
        var ylabel = "Smokes:"
    }
    else {
        var ylabel = "Lacks Healthcare:"
    }
  }
// ==================================================

  else {
    var dollar = ""
    var xlabel = "Age (Median):";
    var ending = " Years"
    if (chosenYAxis === "obesity"){
        var ylabel = "Obesity:"
    }
    else if (chosenYAxis === "smokes"){
        var ylabel = "Smokes:"
    }
    else {
        var ylabel = "Lacks Healthcare:"
    }
  }


  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([100, 0])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${dollar}${d[chosenXAxis]}${ending}<br>
                            ${ylabel} ${d[chosenYAxis]}${ending}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
      
    });

  return circlesGroup;
}







// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(census_data) {

  // parse data
  census_data.forEach(function(data) {
    // data.id = +data.id;
    data.state = data.state;
    data.abbr = data.abbr;
    data.poverty = +data.poverty ;
    // data.povertyMoe = +data.povertyMoe ;
    data.age = +data.age ;
    // data.ageMoe = +data.ageMoe ;
    data.income = +data.income ;
    // data.incomeMoe = +data.incomeMoe ;
    data.healthcare = +data.healthcare ;
    // data.healthcareLow = +data.healthcareLow ;
    // data.healthcareHigh = +data.healthcareHigh ;
    data.obesity = +data.obesity ;
    // data.obesityLow = +data.obesityLow ;
    // data.obesityHigh = +data.obesityHigh ;
    data.smokes = +data.smokes ;
    // data.smokesLow = +data.smokesLow ;
    // data.smokesHigh = +data.smokesHigh ;
  })

  // xLinearScale function above csv import
  var xLinearScale = xScale(census_data, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(census_data, chosenYAxis)

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, ${width})`)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(census_data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", ".5");
// =============================================================================
    circlesGroup.data(census_data).append("text").text(d=>d.abbr)
// =============================================================================


  // Create group for  3 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");


  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

 

// ==========================================
    
  // append y axis
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    .classed("yaxis-text", true)

    var obeseLabel = ylabelsGroup.append("text")
    .attr("x", 20)
    .attr("y", 0)
    .attr("value", "obese") // value to grab for event listener
    .classed("active", true)
    .text("Obese (%)");

    var smokesLabel = ylabelsGroup.append("text")
    .attr("x", 40)
    .attr("y", 0)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");
   
    var healthcareLabel = ylabelsGroup.append("text")
    .attr("x", 40)
    .attr("y", 0)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(census_data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === 'income'){
          povertyLabel
            .classed("active", false)
            .classed("inactive", false);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        } 
        else {
          povertyLabel
            .classed("active", false)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
    ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(census_data, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "obese") {
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === 'smokes'){
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        } 
        else {
        obeseLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

});
