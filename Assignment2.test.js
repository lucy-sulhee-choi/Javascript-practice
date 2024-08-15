//Importing the functions and variables from the base file.
const {allData, distanceCal, foreignAirlines, tripsAirlines, flightsFrom, flightsByAircraft, findMostFlight}  = require('./Assignment2.js');

//distanceCal
test('Input of (-36, 142, -29, 138), output of 863.8077634311112.',() => {
    expect(distanceCal(-36, 142, -29, 138)).toBe(863.8077634311112)
});

test('Input of (-36, 142, -29, "138"), output of "Error - inputs must be number, undefined".',() => {
    expect(distanceCal(-36, 142, -29, "138")).toBe(undefined)
});

//foreignAirlines
test('Input of (allData), output of "Aero-Service" details.',() => {
    expect(foreignAirlines(allData)[0].airline).toEqual({code: 'BF', name: 'Aero-Service', country: 'Republic of the Congo'})
});

//tripsAirlines
test('Input of (allData, "Sharp Airline"), output of 10', () => {
    expect(tripsAirlines(allData, 'Sharp Airlines').length).toBe(10)
})

test('Input of (allData, "Random Airline"), output of There is no trip from Random Airlines', () => {
    expect(tripsAirlines(allData, 'Random Airlines')).toBe('There is no trip from Random Airlines')
})

//flightsFrom
test('Input of (allData, "Sharp Airline"), output of Sharp Airlines flies from Flinders Island to Launceston', () => {
    expect(flightsFrom(allData, 'Flinders Island')[0]).toBe('Sharp Airlines flies from Flinders Island to Launceston')
})

//flightsByAircraft
test('Input of (allData,  "test aircraft"), output of There is no aircraft model test aircraft', () =>{
    expect(flightsByAircraft(allData,"test aircraft" )).toEqual(['There is no aircraft model test aircraft'])
})

test('Input of (allData,  "Beechcraft 1900"), output of Cairns to Groote Eylandt by Aero-Service', () =>{
    expect(flightsByAircraft(allData,"Beechcraft 1900")[0]).toBe('Beechcraft 1900 is used from Cairns to Groote Eylandt by Aero-Service')
})

//findMostFlight
test('Input of (allData), output of {count: 9, flight: "Cairns International Airport - Brisbane International Airport"}', () =>{
    expect(findMostFlight(allData)).toEqual({count: 9, flight: 'Cairns International Airport - Brisbane International Airport'})
})
