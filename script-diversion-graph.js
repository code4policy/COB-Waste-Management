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
    const data = await loadCSV("data_analysis/cleaned_diversion_data.csv");

    // Extract Year-Month and % Diversion data
    const labels = data.map(row => `${row.year}-${String(row.month).padStart(2, "0")}`);
    const diversionRates = data.map(row => row.diversion_rate);

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
                    borderColor: "#288BE4", // Updated to match the requested color
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
                    display: false, // Hide the legend
                },
                tooltip: {
                    intersect: false, // Tooltip activates anywhere on the x-axis
                    callbacks: {
                        label: function (context) {
                            return `${context.raw}%`; // Show diversion rate with a % symbol
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Trash Diversion Rate (%)",
                    },
                    ticks: {
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
