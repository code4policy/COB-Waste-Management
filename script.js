const margin = { top: 30, right: 30, bottom: 60, left: 70 }; // Adjusted margins for spacing
const width = 500 - margin.left - margin.right; // Updated width
const height = 300 - margin.top - margin.bottom; // Updated height

// Append the SVG object to the div with id 'graph_diversion'
const svg = d3.select("#graph_diversion")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load the CSV file
d3.csv("data_analysis/diversion.csv").then(data => {
    // Parse the data
    data.forEach(d => {
        d.Year = d.Year; // Year stays as a string
        d["Diversion Rate"] = +d["Diversion Rate"]; // Convert rate to a number
    });

    // Set up the x and y scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.Year))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Diversion Rate"])])
        .range([height, 0]);

    // Add the x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10, 10)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "12px") // Increased font size
        .style("font-weight", "bold"); // Bold labels

    // Add the y-axis
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .selectAll("text")
        .style("font-size", "12px") // Increased font size
        .style("font-weight", "bold"); // Bold labels

    // Add bars
    svg.selectAll("bars")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.Year))
        .attr("y", d => y(d["Diversion Rate"]))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d["Diversion Rate"]))
        .attr("fill", "#0e1123");

    // Add percentages on top of bars
    svg.selectAll("text.bar-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.Year) + x.bandwidth() / 2) // Center text horizontally on the bar
        .attr("y", d => y(d["Diversion Rate"]) - 5) // Position above the bar
        .attr("text-anchor", "middle") // Align text to center
        .style("font-size", "14px") // Increased font size
        .style("font-weight", "bold") // Bold text
        .style("fill", "#000") // Set text color
        .text(d => `${d["Diversion Rate"]}%`); // Display the diversion rate

    // Add the trend line
    const line = d3.line()
        .x(d => x(d.Year) + x.bandwidth() / 2) // Align with bar centers
        .y(d => y(d["Diversion Rate"]));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#FB4D42")
        .attr("stroke-width", 3) // Thicker trend line
        .attr("d", line);

    // Add dots for the trend line
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.Year) + x.bandwidth() / 2)
        .attr("cy", d => y(d["Diversion Rate"]))
        .attr("r", 4) // Increased dot radius
        .attr("fill", "#FB4D42");

    // Add X-axis label
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 2)
        .style("font-size", "14px") // Increased font size
        .style("font-weight", "bold") // Bold text
        .text("Year");

    // Add Y-axis label
    svg.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -(height / 2))
        .attr("y", -margin.left + 20)
        .attr("transform", "rotate(-90)")
        .style("font-size", "14px") // Increased font size
        .style("font-weight", "bold") // Bold text
        .text("Diversion Rate (%)");
}).catch(error => {
    console.error("Error loading the CSV file:", error);
});

// Dynamically load the navbar
fetch('navigation-bar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navigation-bar').innerHTML = data;
    })
    .catch(error => console.error('Error loading navigation-bar:', error));


// Function to show the corresponding graph when a tab is clicked
function showGraph(event, graphId) {
// Hide all graphs
const graphs = document.querySelectorAll('.graph.tracker');
graphs.forEach(graph => graph.classList.remove('active'));

// Remove 'active' class from all tabs
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => tab.classList.remove('active'));

// Show the selected graph and activate the corresponding tab
document.getElementById(graphId).classList.add('active');
event.currentTarget.classList.add('active');
}

!function(){"use strict";window.addEventListener("message",(function(a){
    if(void 0!==a.data["datawrapper-height"]){
        var e=document.querySelectorAll("iframe");for(var t in a.data["datawrapper-height"])
        for(var r=0;r<e.length;r++)
            if(e[r].contentWindow===a.source){
                var i=a.data["datawrapper-height"][t]+"px";
                e[r].style.height=i
            }
        }
    }))
}();

    function showGraph(graphId) {
      // Hide all graphs
      document.querySelectorAll('.graph').forEach(graph => graph.classList.remove('active'));

      // Show the selected graph
      const selectedGraph = document.getElementById(graphId);
      if (selectedGraph) {
        selectedGraph.classList.add('active');
      } else {
        console.error(`Graph with ID '${graphId}' not found.`);
      }
    }
