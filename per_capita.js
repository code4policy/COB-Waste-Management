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


// Create the bar chart for relative_change across all years
    const svg = d3.select("#barChart");
    const margin = {top: 20, right: 30, bottom: 40, left: 40};
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    // Create a group element to hold the chart
    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set the x scale for the years
    const x = d3.scaleBand()
        .domain(data.map(d => d.Year))
        .rangeRound([0, width])
        .padding(0.1);

    // Set the y scale for the relative_change
    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.relative_change), d3.max(data, d => d.relative_change)])
        .nice()
        .rangeRound([height, 0]);

    // Add x-axis
    g.append("g")
        .selectAll(".x-axis")
        .data(data)
        .enter().append("text")
        .attr("class", "x-axis")
        .attr("x", d => x(d.Year) + x.bandwidth() / 2)
        .attr("y", height + 20)
        .attr("text-anchor", "middle")
        .text(d => d.Year);

    // Add y-axis
    g.append("g")
        .selectAll(".y-axis")
        .data(data)
        .enter().append("text")
        .attr("class", "y-axis")
        .attr("x", -30)
        .attr("y", d => y(d.relative_change))
        .text(d => d.relative_change);

    // Add the bars
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Year))
        .attr("y", d => y(d.relative_change))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.relative_change))
        .attr("fill", d => d.relative_change >= 0 ? "red" : "green");
});