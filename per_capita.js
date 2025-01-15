d3.csv("./data_analysis/waste_per_capita.csv").then(data => {
    // Parse data
    data.forEach(d => {
        d.Year = +d.Year;
        // Convert relative_change to percentage by multiplying by 100
        d.relative_change = +d.relative_change * 100;
    });

    // Sort data to get the most recent year
    const mostRecentData = data.sort((a, b) => b.Year - a.Year)[0];

    // Get the relative change and calculate the percentage
    const relativeChange = mostRecentData.relative_change;
    const percentageChange = relativeChange.toFixed(1); // Format to 1 decimal place

    // Construct the message based on the change
    const changeText = relativeChange >= 0 ? 
        `<span class="increase">${percentageChange}%</span>` : 
        `<span class="decrease">${percentageChange}%</span>`;

    const dynamicMessage = `Waste per capita in the City of Boston has <span class="${relativeChange >= 0 ? "increase" : "decrease"}">${relativeChange >= 0 ? "increased" : "decreased"}</span> by ${changeText} from 2015.`;

    // Select the .chart-text div and insert both pieces of text
    const chartText = d3.select(".chart-text");
    chartText.html(`
        <p>${dynamicMessage}</p>
    `);


d3.csv("./data_analysis/waste_per_capita.csv").then(data => {
    // Parse data and filter out years with no relative_change value
    data = data.filter(d => !isNaN(d.relative_change) && d.relative_change !== "");
    data.forEach(d => {
        d.Year = +d.Year;
        d.relative_change = +d.relative_change * 100;
    });

    // Set up margins and dimensions for the bar chart
    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#barChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set the X and Y scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.Year))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.relative_change), d3.max(data, d => d.relative_change)]) // Handle both negative and positive values
        .nice()
        .range([height, 0]);

    // Append the bars to the SVG
    svg.append("g")
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Year))
        .attr("y", d => y(Math.max(0, d.relative_change)))  // Handle positive and negative correctly
        .attr("width", x.bandwidth())
        .attr("height", d => Math.abs(y(d.relative_change) - y(0))) // Ensure height is based on the magnitude
        .attr("fill", "#1871bd");  // Use single color

    // Add X axis with labels
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .selectAll("text")
        .style("fill", "#ffffff");  // White color for axis text

    // Add Y axis with one decimal point precision, jumps of 2
    svg.append("g")
        .call(d3.axisLeft(y).ticks(Math.ceil(d3.max(data, d => Math.abs(d.relative_change)) / 2)).tickFormat(d3.format(".0f"))) // Set ticks with jump of 2
        .selectAll("text")
        .style("fill", "#ffffff");  // White color for axis text
});
});