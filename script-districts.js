// Dimensions and margins
const districtsMargin = { top: 20, right: 100, bottom: 50, left: 70 };
const districtsWidth = 700 - districtsMargin.left - districtsMargin.right;
const districtsHeight = 500 - districtsMargin.top - districtsMargin.bottom;

// Create the SVG canvas
const districts = d3.select("#districts")
  .attr("width", districtsWidth + districtsMargin.left + districtsMargin.right)
  .attr("height", districtsHeight + districtsMargin.top + districtsMargin.bottom)
  .append("g")
  .attr("transform", `translate(${districtsMargin.left}, ${districtsMargin.top})`);

// Tooltip
const tooltip = d3.select(".tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden") // Make sure the tooltip is hidden initially
  .style("background-color", "white")
  .style("border", "1px solid #ddd")
  .style("padding", "5px")
  .style("border-radius", "3px");

// Current variable being displayed
let currentVariable = "Trash tonnage (per 1,000 people)";

// Load the data
d3.csv("./data_analysis/data.csv").then(data => {
  // Parse data
  data.forEach(d => {
    d.Year = +d.Year;
    d.Value = +d.Value;
  });

  // Group data by district and variable
  const groupedData = d3.group(data, d => d.District);

  // Create scales
  const xScale = d3.scaleLinear()
    .domain([2020, 2024]) // Years
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .range([height, 0]); // y starts at the bottom

  // Define district color map
  const districtColorMap = {
    "Charlestown, Downtown Boston, and Roxbury": "#FB4D42",  // Red
    "Jamaica Plain and Brighton": "#091f2f",  // Dark blue
    "North and South Dorchester": "#288BE4",  // Blue
    "East and South Boston": "#45789C",  // Light blue
    "West Roxbury and Hyde Park": "#D2D2D2"   // Light gray
  };

  // Append x-axis group
  const xAxisGroup = districts.append("g")
    .attr("transform", `translate(0, ${height})`);

  // Append y-axis group
  const yAxisGroup = districts.append("g");

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.Value));

  // Append Y-axis title once (ensure it's not overwritten)
  districts.append("text")
    .attr("class", "y-axis-title")
    .attr("transform", "rotate(-90)")  // Rotate the title
    .attr("y", -margin.left + 20)
    .attr("x", -height / 2)
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Tonns per thousand people");

  // Draw chart
  function updateChart(variable) {
    const filteredData = Array.from(groupedData, ([district, values]) => ({
      district,
      values: values.filter(v => v.Variable === variable),
    }));

    // Update scales
    yScale.domain([
      0,
      d3.max(filteredData.flatMap(d => d.values), d => d.Value),
    ]);

    // Update axes
    xAxisGroup.call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("d")));
    yAxisGroup.call(d3.axisLeft(yScale).tickFormat(d3.format(".0f")));

    // Bind data to lines
    const lines = districts.selectAll(".line")
      .data(filteredData, d => d.district);

    // Enter new lines
    lines.enter()
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", d => districtColorMap[d.district])  // Use the color map
      .attr("stroke-width", 3)
      .merge(lines)
      .attr("d", d => line(d.values))
      .on("mouseover", (event, d) => {
      const mouseX = d3.pointer(event, districts.node())[0]; // Get mouse X relative to SVG
      const mouseYear = Math.round(xScale.invert(mouseX)); // Map X position to Year
      
      // Find the data point for the closest year
      const closestDataPoint = d.values.find(v => v.Year === mouseYear);

      if (closestDataPoint) {
        tooltip.style("visibility", "visible")
          .html(`District: ${d.district}<br>Year: ${closestDataPoint.Year}<br>Value: ${closestDataPoint.Value}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      }
    })
      .on("mousemove", event => {
        // Update tooltip position on mouse movement
        tooltip.style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        // Hide the tooltip on mouseout
        tooltip.style("visibility", "hidden");
      });


     // Add labels to lines
    lines.enter().append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.values[d.values.length - 1].Year))
      .attr("y", d => yScale(d.values[d.values.length - 1].Value))
      .attr("dy", -5)
      .attr("text-anchor", "start")
      .style("fill", d => districtColorMap[d.district])
      .style("font-size", "10px")
      .text(d => d.district);

    // Exit old lines and labels
    lines.exit().remove();
  }

  // Initial render
  updateChart("Trash tonnage (per 1,000 people)");

  // Create legend inside the graph at the top-right corner, with vertical arrangement
  const legend = districts.append("g")
    .attr("transform", `translate(${width - 100},20)`);  // Position the legend inside
});


