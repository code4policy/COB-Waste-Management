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
});
