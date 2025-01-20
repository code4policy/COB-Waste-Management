// script.js

// Load the CSV file
async function loadCSV(filePath) {
    const response = await fetch(filePath);
    const data = await response.text();
    return parseCSV(data);
}

// Parse the CSV into an array of objects
function parseCSV(data) {
    const rows = data.split("\n").map(row => row.trim()).filter(row => row);
    const headers = rows[0].split(",");
    return rows.slice(1).map(row => {
        const values = row.split(",");
        return headers.reduce((obj, header, index) => {
            const value = values[index];
            obj[header.trim()] = isNaN(value) || value === "" ? value : +value;
            return obj;
        }, {});
    });
}

// Create the chart
async function createChart() {
    const data = await loadCSV("cleaned_diversion_data.csv");

    // Extract Year-Month and % Diversion data
    const labels = data.map(row => `${row.year}-${String(row.month).padStart(2, "0")}`);
    const diversionRates = data.map(row => row.diversion_rate);

    // Month names for formatting
    const monthNames = [
        "Jan.", "Feb.", "Mar.", "Apr.", "May", "June",
        "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
    ];

    // Chart.js configuration
    const ctx = document.getElementById("wasteChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels, // Year-Month on x-axis
            datasets: [
                {
                    label: "Monthly Diversion Rate (%)",
                    data: diversionRates, // Diversion rates on y-axis
                    borderColor: "#288BE4", // Line color
                    backgroundColor: "rgba(40, 139, 228, 0.2)", // Semi-transparent matching color for shading
                    pointBackgroundColor: "#288BE4", // Color for the dots
                    fill: true, // Enable shading under the curve
                    borderWidth: 2,
                    pointRadius: 4, // Size of the dots
                    tension: 0.3, // Smooth lines
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            return `${context.raw}%`;
                        },
                    },
                    bodyFont: {
                        size: 14,
                        family: "Montserrat", // Apply Montserrat font to tooltips
                    },
                    titleFont: {
                        size: 14,
                        family: "Montserrat", // Apply Montserrat font to tooltip titles
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Year and Month",
                        font: {
                            size: 14,
                            weight: "bold",
                            family: "Montserrat", // Apply Montserrat font to x-axis title
                        },
                        color: "#091F2F",
                    },
                    ticks: {
                        font: {
                            size: 12,
                            family: "Montserrat", // Apply Montserrat font to x-axis ticks
                        },
                        color: "#091F2F",
                        callback: function (value, index, ticks) {
                            const originalLabel = this.getLabelForValue(value); // Get the original label
                            const [year, month] = originalLabel.split("-");
                            return `${year}-${monthNames[parseInt(month, 10) - 1]}`; // Convert month to name
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Trash Diversion Rate (%)",
                        font: {
                            size: 14,
                            weight: "bold",
                            family: "Montserrat", // Apply Montserrat font to y-axis title
                        },
                        color: "#091F2F",
                    },
                    ticks: {
                        font: {
                            size: 12,
                            family: "Montserrat", // Apply Montserrat font to y-axis ticks
                        },
                        color: "#091F2F",
                        callback: value => `${value}%`, // Add % to y-axis ticks
                    },
                },
            },
        },
        plugins: [
            {
                id: "horizontalLine",
                beforeDraw(chart, args, options) {
                    const activeElement = chart.tooltip?.dataPoints?.[0];
                    if (activeElement) {
                        const ctx = chart.ctx;
                        const yAxis = chart.scales.y;
                        const yValue = activeElement.raw; // y value of the hovered point

                        // Calculate the y-coordinate of the line
                        const yCoord = yAxis.getPixelForValue(yValue);

                        // Draw the horizontal line
                        ctx.save();
                        ctx.strokeStyle = "#D22D23"; // Line color
                        ctx.lineWidth = 1;
                        ctx.setLineDash([5, 5]); // Dashed line
                        ctx.beginPath();
                        ctx.moveTo(chart.scales.x.left, yCoord); // Start of the line
                        ctx.lineTo(chart.scales.x.right, yCoord); // End of the line
                        ctx.stroke();
                        ctx.restore();
                    }
                },
            },
        ],
    });
}

// Load data and create the chart
createChart();
