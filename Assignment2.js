//Loading JSON data
const fs = require('fs');
const airports_data = fs.readFileSync("A2_Airports.json", "utf8");
const flights_data = fs.readFileSync("A2_Flights.json", "utf8");

function parseData(jsonData){
    return JSON.parse(jsonData);
};

//combining flights data and aiports data.
function combineData(flights, airports){
    const new_data = parseData(flights).map(function(flight){
        parseData(airports).forEach(function(airport){
            if (airport.id === flight.source_airport_id){
                flight.source_airport = airport;
                delete flight.source_airport_id;
            }
            else if (airport.id === flight.destination_airport_id){
                flight.destination_airport = airport;
                delete flight.destination_airport_id;
            }
        })
        flight.airline = {code: flight.airline, name: flight.airline_name, country: flight.airline_country};
        delete flight.airline_name;
        delete flight.airline_country;
        return flight;
    });
    return new_data;
};

const allData = combineData(flights_data, airports_data);

//timestamp function
function timestamp(){
    let timestamp = new Date(Date.now()).toLocaleString();
    console.log(timestamp);
};
timestamp()

//Calculate the distance between two points
function distanceCal(lat1, lon1, lat2, lon2){
    try{
        if (typeof(lat1) !== 'number'|| typeof(lon1) !== 'number' || typeof(lat2) !== 'number' || typeof(lon2) !== 'number'){
            throw new Error('inputs must be number');
        };
        const radius = 6371;
        const dis_lat_rad = (lat2-lat1)* Math.PI/180;
        const dis_lon_rad = (lon2-lon1)* Math.PI/180;

        const chord_length_squre =
        Math.sin(dis_lat_rad / 2) * Math.sin(dis_lat_rad / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dis_lon_rad / 2) * Math.sin(dis_lon_rad / 2);

        const central_angle = 2 * Math.atan2(Math.sqrt(chord_length_squre), Math.sqrt(1 - chord_length_squre));
        const distance = radius * central_angle;

        return distance;
    }
    catch(err){
        console.error(err.message)
    };
};

//mapping function that modifies the dataset - adding flight distance
function addDistance(data){
    let newList = data.map(function(flight){
        return Object.assign({}, flight,{
            flight_distance : distanceCal(flight.source_airport.latitude,flight.source_airport.longitude, flight.destination_airport.latitude, flight.destination_airport.longitude)
        });
    });
    timestamp();
    return newList;
};

//Returning new array of flights only with Australian airlines
function ausAirlines(data){
    let newData = data.filter(function(flight){
        return flight.airline.country === 'Australia'
        });
    timestamp();
    return newData;
};

//Returning new array of flights only with foreign airlines
function foreignAirlines(data){
    let newData = data.filter(function(flight){
        return flight.airline.country !== 'Australia'
    });
    timestamp();
    return newData;
};

//Returning new array with all kind of airlines
function airlineList(data){
    let airlinelist = [];
    data.forEach(function(flight){
        if (airlinelist.indexOf(flight.airline.name) === -1){
            airlinelist.push(flight.airline.name);
        };
    });
    return airlinelist; 
};

//Returning new array with all the trips from a certain airline
function tripsAirlines(data, airline){
    let newlist = [];
    data.forEach(function(flight){
        if (flight.airline.name === airline){
            let trip = `${flight.source_airport.city} to ${flight.destination_airport.city}`;
            newlist.push(trip);
        };
    });
    if (newlist.length === 0){
        return (`There is no trip from ${airline}`)
    }
    return newlist;
    };

//displaying flight information
function displayflight(data){
        data.forEach(function(flight)
        {console.log(`${flight.airline.name}/${flight.airline.country} : ${flight.source_airport.city} to ${flight.destination_airport.city} / codeshare : ${flight.codeshare} / aircraft : ${flight.aircraft}`)});
};

//finding flights from / to a certain city.
function flightsFrom(data, city){
    let newList = [];
    data.forEach(function(flight){
        if (flight.source_airport.city === city){
            newList.push(flight.airline.name + " flies from " + flight.source_airport.city + " to " + flight.destination_airport.city);         
        };
    });
    if (newList.length === 0){newList.push(`There is no flight from ${city}`)};
    return newList;
};

function flightsTo(data, city){
    let newList = [];
    data.forEach(function(flight){
        if (flight.destination_airport.city === city){
            newList.push(`${flight.airline.name} flies from ${flight.source_airport.city} to ${city}`);
        };    
    });
    if (newList.length === 0){newList.push(`There is no flight to ${city}`)};
    return newList;
};

//finding flights using certain aircraft
function flightsByAircraft(data, model){
    let newList = [];
    data.forEach(function(flight){
       for (i=0; i<flight.aircraft.length; i++){
        if (flight.aircraft[i] === model){
            newList.push(`${model} is used from ${flight.source_airport.city} to ${flight.destination_airport.city} by ${flight.airline.name}`);
        };
       };
    });
    if (newList.length === 0){
        newList.push(`There is no aircraft model ${model}`);
    };
    return newList
};

//returning an object with each flight and its counter. ex) 'Brisbane - Sydney : 3'
function flightsCounter(data){
    let flight_obj = {};
    for (let i = 0; i < data.length; i++){
      let flight = data[i].source_airport.name + " - " + data[i].destination_airport.name;
      if (flight in flight_obj){
        flight_obj[flight] += 1;
      } else {
        flight_obj[flight] = 1;
      };
    };
    return flight_obj;
  };

  //taking flight_object from the previous function and finding/returning the most counted flight.
 function findMostFlight(data) {
    let flight_obj = flightsCounter(data);
    let maxCount = 0;
    let mostFlight = '';
    for (let [flight, count] of Object.entries(flight_obj)){
      if (count > maxCount){
        maxCount = count;
        mostFlight = flight;
      };
    };
    return {count: maxCount, flight: mostFlight};
  };

//returning new objects with flight route and aircraft used on that flight
 function flightsWithAircraft(data) {
    let aircraft_obj = {};
    for (let i = 0; i < data.length; i++){
        let flight = data[i].source_airport.name + " - " + data[i].destination_airport.name;
        if (flight in aircraft_obj){
            aircraft_obj[flight].count += 1;
        } else {
            aircraft_obj[flight] = {count: 1, aircraft: []};
        };
        
        data[i].aircraft.forEach(function(aircraft){
            if (!aircraft_obj[flight].aircraft.includes(aircraft)){
                aircraft_obj[flight].aircraft.push(aircraft);
            };
        });
    };
    Object.keys(aircraft_obj).forEach(function(flight) {
        aircraft_obj[flight].aircraft = aircraft_obj[flight].aircraft.sort();
    });
  return aircraft_obj;
}

//returning the flight route with the most aircraft used.
function findMostAircrafts(data){
    let maxAircraftCount = 0; 
    let maxAircraftRoute = ""; 

    for (let route in data){
        let aircraftCount = data[route].aircraft.length; 
        if (aircraftCount > maxAircraftCount){ 
            maxAircraftCount = aircraftCount; 
            maxAircraftRoute = route; 
        };
    };
    return(`The flight route with the most aircraft is "${maxAircraftRoute}" with ${maxAircraftCount} aircraft.`);
};

//calculating Avergae, minimum and maximum values of certain key in an array(from Assignment1)
function findAvgMinMax(list, key){
    let newVal = 0;
    let counter = 0;
    let allVal =[];
    for (let i=0; i<list.length; i++){
        if(list[i][key]){
            newVal = list[i][key] + newVal;
            counter = counter+1;
            allVal.push(list[i][key]);
        }
    }
    let average = (newVal / counter).toFixed(3);
    let minVal = Math.min(...allVal);
    let maxVal = Math.max(...allVal);
    return {property : key, average : average, minimum : minVal, maximum : maxVal};   
}

//Analysing data.
function analysingData(data){
    let analysingList = addDistance(data);
    let distanceInfo = (findAvgMinMax(analysingList, 'flight_distance'));
    console.log(`The average flight distance between two airports is ${distanceInfo.average}km\nThe minimum flight distance between two airports is ${distanceInfo.minimum}km\nThe maximum flight distance between two airports is ${distanceInfo.maximum}km\n`);
    let aircrafts = flightsWithAircraft(analysingList);
    let aircraftInfo = findMostAircrafts(aircrafts);
    console.log(aircraftInfo);
    console.log(`\nThere are total of ${foreignAirlines(analysingList).length} flights run by foreign airlines and ${ausAirlines(analysingList).length} flights run by Australian airlines.`);
};

analysingData(allData);


//for unit testing
module.exports = {allData, distanceCal, foreignAirlines, tripsAirlines, flightsFrom, flightsByAircraft, findMostFlight};
