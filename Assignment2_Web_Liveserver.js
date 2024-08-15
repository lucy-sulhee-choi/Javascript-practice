//fetching the combined data for flight search task.
fetch('Combined_Data.json')
    .then(response => response.json())
    .then(data => {
        newdata = data;
        sourceAirportOption();
        destinationAirportOption();
        airlineOption();
        aircraftOption();
        const aircraftSelect = document.getElementById("filterAircraftSelect");
        const sourceAirportSelect = document.getElementById("filterSourceAirportSelect");
        const destinationAirportSelect = document.getElementById("filterDestinationAirportSelect");
        const airlineSelect = document.getElementById("filterAirlineSelect");
        const searchFlightButton = document.getElementById("searchFlightButton");
        const table = document.getElementById("dataTable");

        searchFlightButton.addEventListener("click", filterFlights)
        //filtering flights according to the options selected by user and display the result in the table.
        function filterFlights(){
            //resetting the previous display
            noFlightResult.innerHTML = "";
            let tbody = document.getElementById("dataTable").firstElementChild;
            while (tbody.rows.length>1){
                tbody.deleteRow(1);
            };

            try {
                const selectedAircraft = aircraftSelect.value;
                const selectedSourceAirport = sourceAirportSelect.value;
                const selectedDestinationAirport = destinationAirportSelect.value;
                const selectedAirline = airlineSelect.value;
                
                const filteredFlights = newdata.filter(function(flight){
                    const aircraftMatch = selectedAircraft === "any" || flight.aircraft.includes(selectedAircraft);
                    const sourceAirportMatch = selectedSourceAirport === "any" || flight.source_airport.iata === selectedSourceAirport;
                    const destinationAirportMatch = selectedDestinationAirport === "any" || flight.destination_airport.iata === selectedDestinationAirport;
                    const airlineMatch = selectedAirline === "any" || flight.airline.code === selectedAirline;

                    return aircraftMatch && sourceAirportMatch && destinationAirportMatch && airlineMatch;
                });
                if (filteredFlights.length>0){
                    for (let i=0; i<filteredFlights.length; i++){
                        let newRow = table.insertRow();
                        let cell0 = newRow.insertCell();
                        let cell1 = newRow.insertCell();
                        let cell2 = newRow.insertCell();
                        let cell3 = newRow.insertCell();
                        let cell4 = newRow.insertCell();
                        let cell5 = newRow.insertCell();
                        let distance = distanceCal(
                            filteredFlights[i].source_airport.latitude, filteredFlights[i].source_airport.longitude, filteredFlights[i].destination_airport.latitude, filteredFlights[i].destination_airport.longitude);
                        cell0.innerHTML = "<td>" + (i+1) + "</td>";
                        cell1.innerHTML = "<td>" + filteredFlights[i].source_airport.name + "</td>";
                        cell2.innerHTML = "<td>" + filteredFlights[i].destination_airport.name + "</td>";
                        cell3.innerHTML = "<td>" + filteredFlights[i].airline.name + "</td>";
                        cell4.innerHTML = "<td>" + filteredFlights[i].aircraft + "</td>";
                        cell5.innerHTML = "<td>" + distance.toFixed(3) + "</td>";
                    };
                } else {noFlightResult.innerHTML = 'No Flight Found'};
            }
            catch(error){
            console.error(`Error filtering flights:`, error);
            };
        };
    })
    .catch(error => console.error(error));

//making alphabetically sorted airports/airline/aircraft list and make each airport/airline/aircraft as option
function sourceAirportOption(){
    const airports = [];
    newdata.forEach(function(flight) {
      if (flight.source_airport) {
        const label = `${flight.source_airport.name} (${flight.source_airport.iata})`;
        const airport = {value: flight.source_airport.iata, label: label};
        if (!airports.find(a => a.value === airport.value)){
          airports.push(airport);
        };
      }
    });
    airports.sort((a,b) => a.label.localeCompare(b.label));
    const select = document.getElementById("filterSourceAirportSelect");
  
    airports.forEach(function(airport){
      const option = document.createElement('option');
      option.value = airport.value;
      option.text = airport.label;
      select.appendChild(option);
    });
}

function destinationAirportOption(){
    const airports = [];
    newdata.forEach(function(flight) {
      if (flight.destination_airport.iata) {
        const label = `${flight.destination_airport.name} (${flight.destination_airport.iata})`;
        const airport = {value: flight.destination_airport.iata, label: label};
        if (!airports.find(a => a.value === airport.value)) {
          airports.push(airport);
        };
      }
    });
    airports.sort((a,b) => a.label.localeCompare(b.label));
    const select = document.getElementById("filterDestinationAirportSelect");
  
    airports.forEach(function(airport){
      const option = document.createElement('option');
      option.value = airport.value;
      option.text = airport.label;
      select.appendChild(option);
    });
}

function airlineOption(){
    const airlines = newdata.reduce(function(newList, flight){
        const airline =  { value: flight.airline.code, label: `${flight.airline.name} (${flight.airline.code})`};
        if (!newList.some(function(existing){return existing.value === airline.value})){
            newList.push(airline);
        };
        return newList;
    }, []).sort((a,b) => a.label.localeCompare(b.label));
    const select = document.getElementById("filterAirlineSelect");
    airlines.forEach(function(flight){
        const option = document.createElement("option");
        option.value = flight.value;
        option.text = flight.label;
        select.appendChild(option);
    });
};

function aircraftOption(){
    const aircrafts = newdata.reduce(function(newList, flight){
        flight.aircraft.forEach(function(aircraft){
            const aircraftinfo = { value: aircraft, label : aircraft};
            if (!newList.some(function(existing){return existing.value === aircraftinfo.value})){
                newList.push(aircraftinfo);
            };
        });
        return newList;
    }, []).sort((a,b)=> a.label.localeCompare(b.label));
    const select = document.getElementById("filterAircraftSelect");
    aircrafts.forEach(function(aircraft){
        const option = document.createElement("option");
        option.value = aircraft.value;
        option.text = aircraft.label;
        select.appendChild(option);
    });
}

//Calculating distance between 2 spots with their latitude and longitude.
function distanceCal(lat1, lon1, lat2, lon2){
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
};

//Fetching the airport data for airport search task.
fetch('A2_Airports.json')
    .then(response => response.json())
    .then(data => {
        airportdata = data;
        cityOption();
        const citySelect = document.getElementById("filterCitySelect");
        const searchTerm = document.getElementById("filterSearchTermInput");
        const searchAirportButton = document.getElementById("searchAirportButton");
        const table2 = document.getElementById("dataTable2");

        searchAirportButton.addEventListener("click", filterAirports);

        //making alphabetically sorted city list and make each city as option
        function cityOption(){
           const cities = airportdata.reduce(function(newList, airport){
               const city =  { value: airport.city, label: airport.city};
                if (!newList.some(function(existing){return existing.value === city.value}) && city.value !== ""){
                newList.push(city);
                };
                return newList;
            }, []).sort((a,b) => a.label.localeCompare(b.label));
            
            const select = document.getElementById("filterCitySelect");
            cities.forEach(function(airport){
                const option = document.createElement("option");
                option.value = airport.value;
                option.text = airport.label;
                select.appendChild(option);
            });
        };

        //filtering airports according to the city option selected by user and the search term from user input and displaying the result in the table.
        function filterAirports(){
            noResult2.innerHTML = "";
            inputWarning.innerHTML = "";
            //resetting the previous table
            let tbody2 = document.getElementById("dataTable2").firstElementChild;
            while (tbody2.rows.length>1){
                tbody2.deleteRow(1);
            };
            try{
                const selectedCity = citySelect.value;
                const selectedTerm = searchTerm.value;
                let regex = /[^a-zA-Z\s]/;
                if (regex.test(selectedTerm)){
                    inputWarning.innerHTML = 'User input contains a number or special character. Please try again.';
                } else {
                    const filteredAirports = airportdata.filter(function(airport){
                        inputMatch = selectedTerm === "" || airport.name.toLowerCase().includes(selectedTerm.toLowerCase());
                        cityMatch = selectedCity === "any" || airport.city === selectedCity;

                    return cityMatch && inputMatch;
                    });
            
                    if (filteredAirports.length>0){
                        for (let i=0; i<filteredAirports.length; i++){
                            let newRow = table2.insertRow();
                            let cell0 = newRow.insertCell();
                            let cell1 = newRow.insertCell();
                            let cell2 = newRow.insertCell();
                            let cell3 = newRow.insertCell();
                            let cell4 = newRow.insertCell();
                            let cell5 = newRow.insertCell();
                            let cell6 = newRow.insertCell();
                            let cell7 = newRow.insertCell();
                        
                            cell0.innerHTML = "<td>" + (i+1) + "</td>";
                            cell1.innerHTML = "<td>" + filteredAirports[i].iata + "</td>";
                            cell2.innerHTML = "<td>" + filteredAirports[i].name + "</td>";
                            cell3.innerHTML = "<td>" + filteredAirports[i].city+ "</td>";
                            cell4.innerHTML = "<td>" + filteredAirports[i].latitude.toFixed(3) + "</td>";
                            cell5.innerHTML = "<td>" + filteredAirports[i].longitude.toFixed(3) + "</td>";
                            cell6.innerHTML = "<td>" + filteredAirports[i].altitude.toFixed(3) + "</td>";
                            cell7.innerHTML = "<td>" + filteredAirports[i].timezone + "</td>";
                        };
                    }
                    else {noResult2.innerHTML = 'No Airport Found'};       
                };
            }
            catch(error){
                console.error(`Error filtering flights:`, error);
            };
        };
    });
    