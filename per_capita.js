// Load the CSV
d3.csv("./data_analysis/waste_per_capita.csv").then(data => {
    // Parse the data
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

    // Select the message box and append the text
    const messageBox = d3.select(".message-box");
    messageBox.html(message);

    // Add appropriate class for styling
    messageBox.attr("class", relativeChange >= 0 ? "message-box increased" : "message-box decreased");
});
