

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

// When the browser loads, makeResponsive() is called.
makeResponsive();


function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  margin = {
    top: 50,
    bottom: 50,
    right: 50,
    left: 50
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
  // Read CSV
  d3.csv("state_data.csv", function(err, stateData) {

    // parse data
    stateData.forEach(function(data) {
      data.divorced = +data.divorced /100 ;
      data.depress = +data.depress /100;
    });

    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain(d3.extent(stateData, d => d.divorced))
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.depress)])
      .range([height, 0]);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale).ticks(5).tickFormat(d3.format(".0%"));
    var yAxis = d3.axisLeft(yLinearScale).ticks(6).tickFormat(d3.format(".0%"))

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);


    var circlesGroup = chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.divorced))
      .attr("cy", d => yLinearScale(d.depress))
      .attr("r", "15")
      .attr("fill", "gold")
      .attr("stroke-width", "1")
      .attr("stroke", "black")
      .style("opacity", .5);

      chartGroup.append("g").selectAll("text")
      .data(stateData)
      .enter()
      .append("text")
      .classed('state-name', true)
      .attr("dx", d => xLinearScale(d.divorced)-11)
      .attr("dy", d => yLinearScale(d.depress)+6)
      .text(d => (d.state))
    
  
    chartGroup.append("text")
      .attr("text-anchor", "middle")  
      .attr("transform", "translate("+ (-35) +","+(height/2)+")rotate(-90)")  
      .text("Depressed");

    chartGroup.append("text")
      .attr("text-anchor", "middle")  
      .attr("transform", "translate("+ (width/2) +","+(275)+")")  
      .text("Divorced");

    chartGroup.append("text")
    .attr("text-anchor", "middle")  
    .attr("transform", "translate("+ (width/2) +","+(-25)+")")  
    .text("2014 - % Divorced vs. % Depressed by State");
  
  
  });
};
   