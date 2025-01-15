// Load the CSV file
d3.csv("./data_analysis/waste_per_capita.csv").then(data => {
    // Parse data and convert Year and relative_change to numbers
    data.forEach(d => {
        d.Year = +d.Year;
        d.relative_change = +d.relative_change;  // Ensure relative_change is a number
    });

    // Sort data to get the most recent year
    const mostRecentData = data.sort((a, b) => b.Year - a.Year)[0];

    // Get the relative change and calculate the percentage
    const relativeChange = mostRecentData.relative_change;
    const percentageChange = Math.abs(relativeChange).toFixed(2); // Format to 2 decimal places

    // Construct the message based on the change
    const message = `Waste per capita in the City of Boston has ${relativeChange >= 0 ? "increased" : "decreased"} by ${percentageChange}% from 2015.`;

    // Select the .chart-text div and insert the message
    const chartText = d3.select(".chart-text");
    chartText.html(message);

    // Add appropriate class for styling (red for increased, green for decreased)
    chartText.attr("class", relativeChange >= 0 ? "chart-text increased" : "chart-text decreased");
});
