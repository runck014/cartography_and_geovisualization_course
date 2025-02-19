document.addEventListener('DOMContentLoaded', function() {
  // Create the mapping function in D3

  function plotGeoJSONPoints(data, divId) {
    // Clear any existing content
    d3.select(`#${divId}`).html("");
 
    // Get container dimensions
    const container = document.getElementById(divId);
    const containerRect = container.getBoundingClientRect();
    
    // Create SVG that fills container and responds to resize
    const svg = d3.select(`#${divId}`)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${containerRect.width} ${containerRect.height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");
 
    // Create responsive projection
    const projection = d3.geoMercator()
        .fitSize([containerRect.width, containerRect.height], data);
 
    // Create path generator
    const path = d3.geoPath()
        .projection(projection);
 
    // Add points
    svg.selectAll("circle")
        .data(data.features)
        .enter()
        .append("circle")
        .attr("cx", d => projection(d.geometry.coordinates)[0])
        .attr("cy", d => projection(d.geometry.coordinates)[1])
        .attr("r", containerRect.width * 0.005) // Relative point size
        .attr("fill", "#3B82F6")
        .attr("stroke", "#2563EB")
        .attr("stroke-width", containerRect.width * 0.001)
        .attr("opacity", 0.7);
 
    // Add hover interactions with relative sizing
    svg.selectAll("circle")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("r", containerRect.width * 0.008)
                .attr("opacity", 1);
 
            if (d.properties) {
                const fontSize = containerRect.width * 0.012;
                svg.append("text")
                    .attr("class", "tooltip")
                    .attr("x", projection(d.geometry.coordinates)[0] + fontSize)
                    .attr("y", projection(d.geometry.coordinates)[1] - fontSize)
                    .style("font-size", `${fontSize}px`)
                    .text(JSON.stringify(d.properties));
            }
        })
        .on("mouseout", function() {
            d3.select(this)
                .attr("r", containerRect.width * 0.005)
                .attr("opacity", 0.7);
            svg.selectAll(".tooltip").remove();
        });
 
    // Handle window resize
    const resize = () => {
        const newRect = container.getBoundingClientRect();
        
        // Update projection
        projection.fitSize([newRect.width, newRect.height], data);
        
        // Update SVG viewBox
        svg.attr("viewBox", `0 0 ${newRect.width} ${newRect.height}`);
        
        // Update all points
        svg.selectAll("circle")
            .attr("cx", d => projection(d.geometry.coordinates)[0])
            .attr("cy", d => projection(d.geometry.coordinates)[1])
            .attr("r", newRect.width * 0.005)
            .attr("stroke-width", newRect.width * 0.001);
    };
 
    // Add resize listener
    window.addEventListener('resize', resize);
 
    // Return cleanup function
    return () => window.removeEventListener('resize', resize);
 }

  // Load the data from the API 
  // 
  // 
  // 
  // 
  // 
    d3.json("https://api.weather.gov/stations?state=MN").then(function(data) {

      
      // Data is loaded and parsed
      console.log(data);
      // Create a map using the plotGeoJSONPoints function
      plotGeoJSONPoints(data, "map");
    }
    );



  // and create a table
  /*
  d3.json("https://api.weather.gov/stations?state=MN").then(function(data) {
    // Data is loaded and parsed
    console.log(data);
    // Create a table targeting the map div
    var table = d3.select("#map").append("table");
    // Create a header row
    var header = table.append("thead").append("tr");
    // Create a body
    var tbody = table.append("tbody");
    // Create the header row
    header.selectAll("th")
      .data(["Station ID", "Name", "City", "State", "Latitude", "Longitude"])
      .enter()
      .append("th")
      .text(function(d) { return d; });
    // Create the body 
    var rows = tbody.selectAll("tr")
      .data(data.features)
      .enter()
      .append("tr");
    // Create the cells
    rows.selectAll("td")
      .data(function(d) {
        return [d.properties.stationIdentifier, d.properties.name, d.properties.city, d.properties.state, d.geometry.coordinates[1], d.geometry.coordinates[0]];
      })
      .enter()
      .append("td")
      .text(function(d) { return d; });
  });
  */


});

