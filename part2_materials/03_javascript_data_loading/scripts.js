document.addEventListener('DOMContentLoaded', function() {

    // Fix this code so it the map fits correctly in the dashboard card.

    /*
    In this section, we define a function using d3. We import the d3 library in the HTML file.
    The function plotGeoJSONPoints takes three arguments: data, divId, and width. The data argument is the GeoJSON data that we want to plot. 
    The divId argument is the ID of the div element where we want to plot the data. The width argument is the width of the SVG element that we want to create.
    The function first clears any existing content in the div element with the specified ID. It then creates a projection using d3.geoMercator() and fits the projection to the specified width and height.
    Next, it creates a path generator using d3.geoPath() and the projection. It then creates an SVG element with the specified width and height.
    The function then adds circles to the SVG element for each feature in the GeoJSON data. The cx and cy attributes of the circles are set using the projection, and the radius, fill color, stroke color, stroke width, and opacity of the circles are set.
    Finally, the function adds hover interactions to the circles. When a circle is hovered over, its radius and opacity are increased, and a tooltip is displayed with the properties of the feature.
    */
    function plotGeoJSONPoints(data, divId, width = 800, height = 600) {
        // Clear any existing content
        d3.select(`#${divId}`).html("");
        
        // Create projection - using Mercator but this could be changed
        const projection = d3.geoMercator()
            .fitSize([width, height], data);
        
        // Create path generator
        const path = d3.geoPath()
            .projection(projection);
        
        // Create SVG
        const svg = d3.select(`#${divId}`)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        // Add points
        svg.selectAll("circle")
            .data(data.features)
            .enter()
            .append("circle")
            .attr("cx", d => projection(d.geometry.coordinates)[0])
            .attr("cy", d => projection(d.geometry.coordinates)[1])
            .attr("r", 5)
            .attr("fill", "#3B82F6")
            .attr("stroke", "#2563EB")
            .attr("stroke-width", 1)
            .attr("opacity", 0.7);
            
        // Optional: Add hover interactions
        svg.selectAll("circle")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("r", 8)
                    .attr("opacity", 1);
                    
                // Add tooltip if properties exist
                if (d.properties) {
                    svg.append("text")
                        .attr("class", "tooltip")
                        .attr("x", projection(d.geometry.coordinates)[0] + 10)
                        .attr("y", projection(d.geometry.coordinates)[1] - 10)
                        .text(JSON.stringify(d.properties));
                }
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("r", 5)
                    .attr("opacity", 0.7);
                svg.selectAll(".tooltip").remove();
            });
    }

    /*
    In this section, we define a function getMinnesotaStations that fetches weather station data 
    from the National Weather Service API for the state of Minnesota. The function uses the fetch API
    to make a GET request to the NWS API endpoint for weather stations in Minnesota. The function
    includes a User-Agent header in the request as required by the NWS API. If the request is successful,
    the function parses the response as JSON and calls the plotGeoJSONPoints function to plot the weather
    station data on a map. The function then logs the weather station data to the console and returns it.
    If an error occurs during the fetch request, the function logs an error message to the console.

    The async keyword is used to define an asynchronous function, which allows the function to use the await keyword
    to wait for the fetch request to complete before continuing. The await keyword is used to wait for the fetch.

    The reason we put the mapping function inside this async function is because we want to make sure that the data
    is available before we try to map it. If we tried to map the data outside of the async function, it might not be
    available yet, and we would get an error.

    You could move the plotGeoJSONPoints function outside of the getMinnesotaStations function to see this is true.
    */

    async function getMinnesotaStations() {
        try {
          const response = await fetch('https://api.weather.gov/stations?state=MN', {
            headers: {
              'User-Agent': '(myweatherapp.com, contact@myweatherapp.com)'
              // NWS API requires a User-Agent header identifying your application
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          plotGeoJSONPoints(data, 'map');
          console.log('Minnesota Weather Stations:', data);
          return data;
        } catch (error) {
          console.error('Error fetching Minnesota stations:', error);
        }
      }



      // Call the function
      getMinnesotaStations();

      /* A good exercise is take 02_javascript_D3 and add the trend analysis chart back in */


});

