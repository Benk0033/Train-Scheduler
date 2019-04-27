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

    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        var trainName = $("#train-name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var firstTrainTime = moment($("#time-input").val().trim(), "HH:mm").format("HH:mm");
        var trainFrequency = $("#frequency-input").val().trim();

        var newTrain = {
            name: trainName,
            destination: trainDestination,
            trainTime: firstTrainTime,
            frequency: trainFrequency
        };

        database.ref().push(newTrain);

        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.trainTime);
        console.log(newTrain.frequency);

        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");
    });

    database.ref().on("child_added", function (snapshot) {

        var sv = snapshot.val();

        console.log(sv);

        var trainName = sv.name;
        var trainDestination = sv.destination;
        var firstTrainTime = sv.trainTime;
        var trainFrequency = sv.frequency;

        console.log(trainName);
        console.log(trainDestination);
        console.log(firstTrainTime);
        console.log(trainFrequency);

        var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        console.log(firstTrainTimeConverted);

        var currentTime = moment();

        var diffTime = currentTime.diff(firstTrainTimeConverted, "minutes");
        console.log(diffTime);

        var tRemainder = diffTime % trainFrequency;
        console.log(tRemainder);

        var minutesAway = trainFrequency - tRemainder;
        console.log(minutesAway);

        var nextArrival = currentTime.add(minutesAway, "minutes");
        console.log(nextArrival);

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDestination),
            $("<td>").text(trainFrequency),
            $("<td>").text(nextArrival.format("hh:mm a")),
            $("<td>").text(minutesAway)
        );

        $("#train-table").append(newRow);

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});