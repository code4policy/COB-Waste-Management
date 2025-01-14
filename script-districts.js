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
const tooltip = d3.select(".tooltip");

// Current variable being displayed
let currentVariable = "Trash tonnage (per 1,000 people)";

// Load the data
d3.csv("./data_analysis/data.csv").then(data => {
  // Parse data
  data.forEach(d => {
    d.Year = +d.Year;
    // Check for invalid percentage values like #DIV/0! or NaN
    if (d.Value === '#DIV/0!' || isNaN(d.Value)) {
      d.Value = null;  // Set to null or any other value you prefer
    } else {
      d.Value = +d.Value;
    }
  });

  // Group data by district and variable
  const groupedData = d3.group(data, d => d.District);

  // Create scales
  const xScale = d3.scaleLinear()
    .domain([2020, 2024]) // Years
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .range([height, 0]); // y starts at the bottom

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Append x-axis group
  const xAxisGroup = svg.append("g")
    .attr("transform", `translate(0, ${height})`);

  // Append y-axis group
  const yAxisGroup = svg.append("g");

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.Value));

  // Draw chart
  function updateChart(variable) {
    const filteredData = Array.from(groupedData, ([district, values]) => ({
      district,
      values: values.filter(v => v.Variable === variable),
    }));

    // Update scales
    // For "per 1,000 people", set the domain accordingly
    yScale.domain([
      0,
      d3.max(filteredData.flatMap(d => d.values), d => d.Value),
    ]);

    // Update axes
    xAxisGroup.call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("d")));
    yAxisGroup.call(d3.axisLeft(yScale));

    // Bind data to lines
    const lines = svg.selectAll(".line")
      .data(filteredData, d => d.district);

    // Enter new lines
    lines.enter()
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", d => colorScale(d.district))
      .merge(lines)
      .attr("d", d => line(d.values))
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
          .html(`District: ${d.district}<br>Year: ${d.values[0].Year}<br>Value: ${d.values[0].Value}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mousemove", event => {
        tooltip.style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });

    // Exit old lines
    lines.exit().remove();
  }

  // Initial render
  updateChart(currentVariable);
});
