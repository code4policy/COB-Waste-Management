// Fetch and load the CSV data
async function loadCSV(filePath) {
    const response = await fetch(filePath);
    const data = await response.text();
    return parseCSV(data);
}

// Parse CSV into an array of objects
function parseCSV(data) {
    const rows = data.split("\n").map(row => row.trim()).filter(row => row);
    const headers = rows[0].split(",");
    return rows.slice(1).map(row => {
        const values = row.split(",");
        return headers.reduce((obj, header, index) => {
            obj[header] = isNaN(values[index]) ? values[index] : +values[index];
            return obj;
        }, {});
    });
}



// Mapping of month names to numeric values
const monthsMapping = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12
};

// Populate year and month dropdowns dynamically
const populateDropdowns = () => {
    // Extract unique years from the dataset
    const years = Array.from(new Set(data.map(row => row.year)));

    // Get month names from the mapping
    const months = Object.keys(monthsMapping);

    // Populate year dropdowns
    years.forEach(year => {
        document.getElementById("year1").innerHTML += `<option value="${year}">${year}</option>`;
        document.getElementById("year2").innerHTML += `<option value="${year}">${year}</option>`;
    });

    // Populate month dropdowns
    months.forEach(month => {
        const monthValue = monthsMapping[month];
        document.getElementById("month1").innerHTML += `<option value="${monthValue}">${month}</option>`;
        document.getElementById("month2").innerHTML += `<option value="${monthValue}">${month}</option>`;
    });
};

// Calculate waste diversion for a given year and month
const calculateDiversion = (data, year, month) => {
    // Filter data for the selected year and month
    const filtered = data.filter(row => row.year === year && row.month === month);

    // Calculate volumes for trash, recycling, and compost
    const trash = filtered.filter(row => row.type === 1).reduce((sum, row) => sum + row.volume, 0);
    const recycling = filtered.filter(row => row.type === 2).reduce((sum, row) => sum + row.volume, 0);
    const compost = filtered.filter(row => row.type === 3).reduce((sum, row) => sum + row.volume, 0);

    // Calculate diversion rate
    const total = trash + recycling + compost;
    const diversion = total > 0 ? (recycling + compost) / total : 0;

    return { trash, recycling, compost, diversion };
};

// Handle the "Analyze" button click
document.getElementById("analyze-btn").addEventListener("click", () => {
    // Get selected years and months
    const year1 = parseInt(document.getElementById("year1").value);
    const month1 = parseInt(document.getElementById("month1").value);
    const year2 = parseInt(document.getElementById("year2").value);
    const month2 = parseInt(document.getElementById("month2").value);

    // Calculate diversion rates for both periods
    const period1 = calculateDiversion(data, year1, month1);
    const period2 = calculateDiversion(data, year2, month2);

    // Calculate change in diversion rate
    const change = ((period2.diversion - period1.diversion) * 100).toFixed(2);

    // Display results
    document.getElementById("result-text").innerHTML = `
        <strong>First Period:</strong> 
        Trash: ${period1.trash} tons, Recycling: ${period1.recycling} tons, Compost: ${period1.compost} tons, 
        Diversion: ${(period1.diversion * 100).toFixed(2)}%<br>
        <strong>Second Period:</strong> 
        Trash: ${period2.trash} tons, Recycling: ${period2.recycling} tons, Compost: ${period2.compost} tons, 
        Diversion: ${(period2.diversion * 100).toFixed(2)}%<br>
        <strong>Change in Diversion Rate:</strong> ${change}% ${change >= 0 ? "Increase" : "Decrease"}
    `;
});

// Initialize dropdowns on page load
populateDropdowns();