var orm = require("../config/orm.js");
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD5P270V7uwnYiTlKk4IxL7D7K5iW9ggUE",
    authDomain: "flight-tracker-1dc1d.firebaseapp.com",
    databaseURL: "https://flight-tracker-1dc1d.firebaseio.com",
    projectId: "flight-tracker-1dc1d",
    storageBucket: "flight-tracker-1dc1d.appspot.com",
    messagingSenderId: "443367424118"
  };


  firebase.initializeApp(config);

  var flightData = firebase.database();

  //Button for adding trains
  $("#add-flight-btn").on("click", function(){

    //grab user input
    var flightName = $("#flight-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstFlightUnix = moment($("#first-flight-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var frequency = $("#frequency-input").val().trim();


  // Creates local "temporary" object for holding flight data
    var newFlight = {

      name: flightName,
      destination: destination,
      firstFlight: firstFlightUnix,
      frequency: frequency
    };

    // Uploads flight data to the database
    flightData.ref().push(newFlight);


    // Logs everything to console
    console.log(newFlight.name);
    console.log(newFlight.destination);
    console.log(firstFlightUnix);
    console.log(newFlight.frequency);


    // Alert
    alert("Flight successfully added");


     // Clears all of the text-boxes
    $("#flight-name-input").val("");
    $("#destination-input").val("");
    $("#first-flight-input").val("");
    $("#frequency-input").val("");


    // Determine when the next flight arrives
    return false;
  });


  //Create Firebase event for adding flights to the database and a row in the html when a user adds an entry
  flightData.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var fName = childSnapshot.val().name;
  var fDestination = childSnapshot.val().destination;
  var fFrequency = childSnapshot.val().frequency;
  var fFirstFlight = childSnapshot.val().firstFlight;

  // Calculate the minutes until arrival using hardcore math
  // To calculate the minutes till arrival, take the current time in unix subtract the Firstflight time
  // and find the modulus between the difference and the frequency.
  var differenceTimes = moment().diff(moment.unix(fFirstFlight), "minutes");
  var fRemainder = moment().diff(moment.unix(fFirstFlight), "minutes") % fFrequency;
  var fMinutes = fFrequency - fRemainder;

  // To calculate the arrival time, add the fMinutes to the currrent time
  var fArrival = moment().add(fMinutes, "m").format("hh:mm A");

  console.log(fMinutes);
  console.log(fArrival);
  console.log(moment().format("hh:mm A"));
  console.log(fArrival);
  console.log(moment().format("X"));

  // Add each flight's data into the table
  $("#flight-table > tbody").append("<tr><td>" + fName + "</td><td>" + fDestination + "</td><td>"
  + fFrequency + "</td><td>" + fArrival + "</td><td>" + fMinutes + "</td></tr>");
});
