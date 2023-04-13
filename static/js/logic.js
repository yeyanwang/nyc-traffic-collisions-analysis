import {API_KEY} from './config.js'
// Two overlay groups
var collisionL = new L.layerGroup();
var boroughL = new L.LayerGroup();

var overlays = {
    Collisions: collisionL,
    Boroughs: boroughL
}

// Adding the base map tile layers
var defaultL = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'
})

var satelliteL = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "satellite-v9",
  accessToken: API_KEY
});

var navDayL = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "navigation-day-v1",
  accessToken: API_KEY
});

var navNightL = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "navigation-night-v1",
    accessToken: API_KEY
});

var baseLayers = {
    Normal: defaultL,
    Satellite: satelliteL,
    "Navigation (Day)": navDayL,
    "Navigation (Night)": navNightL
}

// Create our map
var myMap = L.map("map", {
    center: [40.730610, -73.935242],
    zoom: 10,
    layers: [defaultL, collisionL]
});

// Layer control
L.control.layers(baseLayers, overlays, {
    collapsed: true
}).addTo(myMap);

// Fetch from SQL database
d3.json('/data').then(function(data) {
    d3.json('/boroughs').then(function(boroughs){
   
        console.log(data);
        console.log(boroughs);

        // Create a layer for the boroughs polygons and add to the borough overlay
        let features = boroughs['features'];
        L.geoJSON(features, {
        'style': {'color': 'gold'}
        }).addTo(boroughL)
       
        boroughL.addTo(myMap);

        // Create a new marker cluster group and bind pop up for each marker
        let markerClusters = L.markerClusterGroup();
        data.forEach((collision) => {
            if (collision.latitude != null) {
                var markers = L.marker([collision.latitude, collision.longitude], {
                    draggable: false,
                });

                markers.bindPopup(`No. of Persons Injuried: ${collision.number_of_persons_injured} <br>
                                No. of Persons Killed: ${collision.number_of_persons_killed} <br>
                                Crash Date: ${moment(collision.crash_date).format("dddd, MMMM Do YYYY")} <br>
                                Crash Time: ${collision.crash_time}`)
                markerClusters.addLayer(markers)
            }
        })
        collisionL.addLayer(markerClusters);
        myMap.addLayer(collisionL)

        // Create bar chart
        let borough_names = ['STATEN ISLAND', 'BROOKLYN', 'QUEENS', 'BRONX', 'MANHATTAN'];

        function boroughCount(borough_name){
            let count = 0;

            data.forEach((collision) => {
                if (collision.borough == borough_name){
                    count += 1;
                };
            });
            return count;
        };
        
        var weekdays = {"Monday":0, "Tuesday":0, "Wednesday":0, "Thursday":0, "Friday":0, "Saturday":0, "Sunday":0};
        data.forEach((collision) => {
            if (moment(collision.crash_date).format("dddd") == "Monday") {
                weekdays["Monday"] += 1
            } else if (moment(collision.crash_date).format("dddd") == "Tuesday") {
                weekdays["Tuesday"] += 1
            } else if (moment(collision.crash_date).format("dddd") == "Wednesday") {
                weekdays["Wednesday"] += 1
            } else if (moment(collision.crash_date).format("dddd") == "Thursday") {
                weekdays["Thursday"] += 1
            } else if (moment(collision.crash_date).format("dddd") == "Friday") {
                weekdays["Friday"] += 1
            } else if (moment(collision.crash_date).format("dddd") == "Saturday") {
                weekdays["Saturday"] += 1
            } else if (moment(collision.crash_date).format("dddd") == "Sunday") {
                weekdays["Sunday"] += 1
            }
        });

        console.log(Object.keys(weekdays));
        console.log(Object.values(weekdays));

        var weekData = [{
            type: "bar", 
            x: Object.keys(weekdays), 
            y: Object.values(weekdays), 
        }];

        var layout = {
            title: "Collisions - Day of the Week", 
            yaxis: {title: "No. of Collisions", showgrid: false},
            font: {
                color: "white", 
                family: "'Courier New', Courier, monospace",
                size: 12
            },
            paper_bgcolor:'rgba(0,0,0,0)',
            plot_bgcolor:'rgba(0,0,0,0)'
        };

        Plotly.newPlot("bar1", weekData, layout);

        let countStaten = boroughCount("STATEN ISLAND");
        let countBrooklyn = boroughCount("BROOKLYN");
        let countQueens = boroughCount("QUEENS");
        let countBronx = boroughCount("BRONX");
        let countManhattan = boroughCount("MANHATTAN");

        let countArray = [countBrooklyn, countQueens, countBronx, countManhattan, countStaten]

        var barData = [{
            type: 'bar',
            y: borough_names,
            x: countArray,
            orientation: "h", 
            marker: {color: "rgb(80, 100, 172)"}
        }];
        var barLayout = {
            title: {text: "Collision per Borough"},
            yaxis: {automargin: true},
            xaxis: {title: "No. of Collisions", showgrid: false},
            font: {
                color: "white", 
                family: "'Courier New', Courier, monospace",
                size: 12
            },
            paper_bgcolor:'rgba(0,0,0,0)',
            plot_bgcolor:'rgba(0,0,0,0)'
        };
        Plotly.newPlot("bar", barData, barLayout);

        // Create line chart
        function injuryCount(data, hour) {
            var ppl_i = 0;
            var ppl_k = 0;
            for (var i = 0; i < data.length; i++) {
                var col = col;
                if (data[i].crash_time == hour) {
                    ppl_i += data[i].number_of_persons_injured;
                    ppl_k += data[i].number_of_persons_killed;
                }
            }
            return [ppl_i, ppl_k];
        };

        var sum_i = []
        var sum_k = []
        for (var i = 0; i < 24; i++) {
            sum_i[i] = injuryCount(data, i)[0];
            sum_k[i] =injuryCount(data, i)[1]
        }

        var trace_i = {
            x: [...Array(24).keys()],
            y: sum_i,
            type: 'line',
            name: 'Persons injured',
            marker: {
                color: "orange"
            }      
        }

        var trace_k = {
            x: [...Array(24).keys()],
            y: sum_k,
            type: 'line',
            name: 'Persons killed',
            marker: {
                color: "red"
            }
        }
        data = [trace_i, trace_k]

        var line_layout = {
            title: "Injuries/Kills - Hour of the Day",
            xaxis: {
                title: "Hour",
                range: [0, 24],
                showgrid: false,
                zeroline: false
            },
            yaxis: {
                title: "No. of Persons",
                autorange: true,
                showgrid: false
            },
            font: {
                color: "white",
                family: "'Courier New', Courier, monospace",
                size: 12
            },
            paper_bgcolor:'rgba(0,0,0,0)',
            plot_bgcolor:'rgba(0,0,0,0)'
        };
        // Use Plotly to plot the data in a bar chart
        Plotly.newPlot("line", data, line_layout);  


    });
});

function zoomMap(event, userInput) {
    console.log(userInput);
    // update map configuration object with new center and zoom values
    let latLng=userInput.split(', ')
    myMap.setView([parseFloat(latLng[0]), parseFloat(latLng[1])], 20);

    // toggle "active" class on element that triggered event
    event.currentTarget.classList.add("active");
}

function openChart(event, chartName) {
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "")
    }

    document.getElementById(chartName).style.display = "flex";
    event.currentTarget.className += " active";
}