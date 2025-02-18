document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...

    // Line Chart Data
    const data = [
        { date: new Date(2023, 0, 1), value: 30 },
        { date: new Date(2023, 1, 1), value: 50 },
        { date: new Date(2023, 2, 1), value: 80 },
        { date: new Date(2023, 3, 1), value: 65 },
        { date: new Date(2023, 4, 1), value: 95 },
        { date: new Date(2023, 5, 1), value: 70 }
    ];

    // Set the dimensions and margins of the graph
    const container = document.querySelector('#lineChart');
    const margin = { top: 0, right: 30, bottom: 30, left: 30 };

    // Get initial dimensions
    const getContainerDimensions = () => ({
        width: container.clientWidth - margin.left - margin.right,
        height: container.clientHeight - margin.top - margin.bottom
    });

    let { width, height } = getContainerDimensions();

    // Append SVG object to the div with id 'lineChart'
    const svg = d3.select("#lineChart")
        .append("svg")
        .style("width", "100%")
        .style("height", "100%")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // Set the scales
    const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);

    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height, 0]);

    // Add minimal X axis (just a line)
    svg.append("path")
    .attr("d", `M0,${height}H${width}`)
    .attr("stroke", "#000")
    .attr("stroke-width", 0.5);

    // Add minimal Y axis (just a line)
    svg.append("path")
    .attr("d", `M0,0V${height}`)
    .attr("stroke", "#000")
    .attr("stroke-width", 0.5);

    // Add subtle grid lines if needed
    const yGridLines = y.ticks(5);
    svg.selectAll(".y-grid-line")
    .data(yGridLines)
    .enter()
    .append("line")
    .attr("class", "y-grid-line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", d => y(d))
    .attr("y2", d => y(d))
    .attr("stroke", "#eee")
    .attr("stroke-width", 0.5);

    // Add the line
    svg.append("path")
    .datum(data)
    .attr("class", "line-chart-path")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value))
    );

    // Add small data points
    svg.selectAll(".data-point")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "data-point")
    .attr("cx", d => x(d.date))
    .attr("cy", d => y(d.value))
    .attr("r", 2)
    .attr("fill", "#000");

    // Add minimal labels
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    svg.selectAll(".x-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "x-label")
    .attr("x", d => x(d.date))
    .attr("y", height + 15)
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .text((d, i) => months[i]);

    // Add y-axis values (only a few)
    svg.selectAll(".y-label")
    .data(y.ticks(5))
    .enter()
    .append("text")
    .attr("class", "y-label")
    .attr("x", -5)
    .attr("y", d => y(d))
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .attr("font-size", "10px")
    .text(d => d);
});

