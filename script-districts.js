// Dimensions and margins
const margin = { top: 20, right: 50, bottom: 50, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG canvas
const svg = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

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
  const xAxisGroup = svg.append("g")
    .attr("transform", `translate(0, ${height})`);

  // Append y-axis group
  const yAxisGroup = svg.append("g");

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.Value));

  // Append Y-axis title once (ensure it's not overwritten)
  svg.append("text")
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
    const lines = svg.selectAll(".line")
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
        tooltip.style("visibility", "visible")  // Make tooltip visible
          .html(`District: ${d.district}<br>Year: ${d.values[0].Year}<br>Value: ${d.values[0].Value}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mousemove", event => {
        tooltip.style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");  // Hide tooltip on mouseout
      });

    // Exit old lines
    lines.exit().remove();
  }

  // Initial render
  updateChart(currentVariable);
});
