
// Load the GeoJSON file 
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
    .then(response => response.json())
    .then(createMarkers)
    .catch(error => console.error('Error loading the GeoJSON file:', error));

    function createMap(earthquakes) {
        // Tile layer.
        let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
    
        // Streetmap Layer
        let baseMaps = {
            "Street Map": streetmap
        };
    
        // Earthquake Layer
        let overlayMaps = {
            "Earthquakes": earthquakes
        };
    
        // Create Map
        let map = L.map("map", {
            center: [0, 0],
            zoom: 2, 
            layers: [streetmap, earthquakes]
        });
    
        // Create layer control.
        L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
        }).addTo(map);
    
        // Create a legend
        let legend = L.control({ position: 'bottomright' });
    
        legend.onAdd = function (map) {
            let div = L.DomUtil.create('div', 'info legend');
            div.style.backgroundColor = 'white';
            div.style.padding = '10px'; 
            let depths = [0, 10, 30, 50, 70, 90];
            let colors = [
                "#A3F7A3",
                "#F06E4A",
                "#FFA500",
                "#c20000",
                "#8B0000",
                "#380114"
            ];
            for (let i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<span style="display: inline-block; width: 20px; height: 10px; background-color:' + colors[i] + '"></span> ' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
            }
            return div;
        };
    
        legend.addTo(map);
    }

    function createMarkers(response) {
        let earthquakes = response.features;
    
        // Initialize array to hold the earthquake markers.
        let earthquakeMarkers = [];
    
        // Loop through the earthquakes array.
        earthquakes.forEach(function (earthquake) {
            // Extract magnitude and depth
            let magnitude = earthquake.properties.mag;
            let depth = earthquake.geometry.coordinates[2];
    
            // Marker Size
            let markerSize = magnitude * 4;
    
            // Marker Color
            let markerColor = "";
            if (depth < 10) {
                markerColor = "#A3F7A3";
            } else if (depth < 30) {
                markerColor = "#F06E4A";
            } else if (depth < 50) {
                markerColor = "#FFA500";
            } else if (depth < 70) {
                markerColor = "#c20000";
            } else if (depth < 90) {
                markerColor = "#8B0000";
            } else {
                markerColor = "#380114"; 
            } 
    
            // Circle Marker with popup 
            let earthquakeMarker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
                radius: markerSize,
                fillColor: markerColor,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<h3>${earthquake.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth}</p>`);
    
            // Add the marker to the earthquakeMarkers array.
            earthquakeMarkers.push(earthquakeMarker);
        });
    
        // Create layer group.
        createMap(L.layerGroup(earthquakeMarkers));
    }