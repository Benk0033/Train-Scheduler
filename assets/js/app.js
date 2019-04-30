$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBGhC0OA1aTzDENHsIRlCqILjoSLBuXLKc",
        authDomain: "ucla-coding-bootcamp-mar2019.firebaseapp.com",
        databaseURL: "https://ucla-coding-bootcamp-mar2019.firebaseio.com",
        projectId: "ucla-coding-bootcamp-mar2019",
        storageBucket: "ucla-coding-bootcamp-mar2019.appspot.com",
        messagingSenderId: "449657985836"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    // click event for adding trains when clicking the submit button
    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        // variables to store user inputs
        var trainName = $("#train-name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var firstTrainTime = moment($("#time-input").val().trim(), "HH:mm").format("HH:mm");
        var trainFrequency = $("#frequency-input").val().trim();

        // Creates local "temporary" object for holding train data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            trainTime: firstTrainTime,
            frequency: trainFrequency
        };

        // pushes train data to firebase
        database.ref().push(newTrain);

        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.trainTime);
        console.log(newTrain.frequency);

        // clears input boxes after submission
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");
    });

    // event listener that adds train data as a new row into html and new data into firebase when user submits new entry
    database.ref().on("child_added", function (snapshot) {

        var sv = snapshot.val();

        console.log(sv);

        // strores firebase values into vairables
        var trainName = sv.name;
        var trainDestination = sv.destination;
        var firstTrainTime = sv.trainTime;
        var trainFrequency = sv.frequency;

        console.log(trainName);
        console.log(trainDestination);
        console.log(firstTrainTime);
        console.log(trainFrequency);

        // ensures first train time is always behind current time by subtracting one year
        var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        console.log(firstTrainTimeConverted);

        // stores current time into a variable
        var currentTime = moment();

        // difference between current time and first train time
        var diffTime = currentTime.diff(firstTrainTimeConverted, "minutes");
        console.log(diffTime);

        // calculates time apart
        var tRemainder = diffTime % trainFrequency;
        console.log(tRemainder);

        // calculates minutes until train arrives
        var minutesAway = trainFrequency - tRemainder;
        console.log(minutesAway);

        // next arrival time
        var nextArrival = currentTime.add(minutesAway, "minutes");
        console.log(nextArrival);

        // creates new row
        var newRow = $("<tr>").append(
            $("<td>").html(trainName),
            $("<td>").html(trainDestination),
            $("<td>").html(trainFrequency),
            $("<td>").html(nextArrival.format("hh:mm a")),
            $("<td>").html(minutesAway)
        );

        // appends new row
        $("#train-table").append(newRow);

        // handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});