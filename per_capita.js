d3.csv("./data_analysis/waste_per_capita.csv").then(data => {
    // Parse data
    data.forEach(d => {
        d.Year = +d.Year;
        // Convert relative_change to percentage by multiplying by 100
        d.relative_change = +d.relative_change * 100;
    });

    // Log to see how the data looks
    console.log(data);

    // Sort data to get the most recent year
    const mostRecentData = data.sort((a, b) => b.Year - a.Year)[0];

    // Get the relative change and calculate the percentage
    const relativeChange = mostRecentData.relative_change;
    const percentageChange = relativeChange.toFixed(1); // Format to 1 decimal place

    // Construct the message based on the change
    const message = `Waste per capita in the City of Boston has ${relativeChange >= 0 ? "increased" : "decreased"} by ${percentageChange}% from 2015.`;

    // Select the .chart-text div and insert the message
    const chartText = d3.select(".chart-text");
    chartText.html(message);

    // Add appropriate class for styling (red for increased, green for decreased)
    chartText.attr("class", relativeChange >= 0 ? "chart-text increased" : "chart-text decreased");
});
