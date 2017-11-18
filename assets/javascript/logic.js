// Initialize Firebase connection

var config = {
    apiKey: "AIzaSyAIKU2H9inCbils_615Gd8kRIZXYFmXDaA",
    authDomain: "traintime-99a3f.firebaseapp.com",
    databaseURL: "https://traintime-99a3f.firebaseio.com",
    projectId: "traintime-99a3f",
    storageBucket: "traintime-99a3f.appspot.com",
    messagingSenderId: "669805588059"
};
firebase.initializeApp(config);


// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

// Flag to prevent the "on value" event from firing
var initialLoadComplete = false;


//  Actually adds new train
function addNewTrain(){
	console.log("submit button clicked!");

	// Assign to new Train
	var newTrainName = $("#trainNameText").val();
	var newDestination = $("#destinationText").val();
	var newFirstTrainTimeText = $("#firstTrainTimeText").val();
	var newTrainFrequencyText = $("#trainFrequencyText").val();

	console.log(newTrainName + " " + newDestination +" " + newFirstTrainTimeText + " " + newTrainFrequencyText);


	// Clear out the form text fields to be ready for next input.
	$("#trainNameText").val("");
	$("#destinationText").val("");
	$("#firstTrainTimeText").val("");
	$("#trainFrequencyText").val("");

	// create object to be pushed into firebase
	var newTrainObject = {
		trainName:newTrainName,
		destination:newDestination,
		firstTrainTime:newFirstTrainTimeText,
		trainFrequency:newTrainFrequencyText,
		dateAdded:firebase.database.ServerValue.TIMESTAMP
	}

	// Create new item in firebase
	database.ref().push(newTrainObject);
}




//Will perfrom the initial display of results with existing items in firebase database
database.ref().once("value", function(snapshot) {
//database.ref().orderByChild("dateAdded").on("child_added", function(snapshot){
	
	console.log("Initial load from firebase DB START!");

	snapshot.forEach(function(child){
		//createTable(child.val());

		

		//Fix Since done multiple times, make a function for displaying data
		//console.log(snapshot);
		var latestTrainName = child.val().trainName;
		var latestDestination = child.val().destination;
		var latestFirstTrainTime = child.val().firstTrainTime;
		var latesttrainFrequency = child.val().trainFrequency;
		var latestTrainDateAdded = child.val().dateAdded;


		console.log("New Child Method" + latestTrainName + " " + latestDestination +" " + latestFirstTrainTime + " " + latesttrainFrequency +  " " + latestTrainDateAdded);

		// Calculate train time!
		//---------------------------------------
		// Convert first train time to a moment
		var expectedStartTimeFormat = "HH:mm";
    	var convertedFirstTrainTime = moment(latestFirstTrainTime, expectedStartTimeFormat);
    	// Subtract a year to make sure it always is less than the current time?
    	//convertedFirstTrainTime = convertedFirstTrainTime.subtract(1, "years");
    	// Decrement start time by a day??
    	console.log("Start Time is " + convertedFirstTrainTime);

    	// Set curent time to a moment
    	var now = moment();

    	// Total number of mins between now and the start time
    	var minsDifference = now.diff(convertedFirstTrainTime, 'minutes');
    	console.log("Minutes from start time " + minsDifference);

    	// Remainder of mins until next train is minsDifference % latesttrainFrequency
    	var remainder = minsDifference % latesttrainFrequency;
    	console.log("Remainder is " + remainder);
    	var minsToNextTrain = latesttrainFrequency - remainder;
    	console.log("Remainder Minutes till next train  " + minsToNextTrain);

    	


    	var nextArrival = now.add(minsToNextTrain, "minutes");
    	
    	var nextArrivalConverted = moment(nextArrival).format("hh:mm");


    	// If time is negative, than the current time(now) is before Start Time
    	if(minsDifference <= 0){
    		//minsToNextTrain = "TOMORROW!";
    		// Next train is the start time of the train
    		nextArrivalConverted = latestFirstTrainTime;

    		// Time to next train is Train Start Time - now
    		minsToNextTrain = convertedFirstTrainTime.diff(now, 'minutes');
    		//minsToNextTrain = moment(latestFirstTrainTime,expectedStartTimeFormat).diff(now,'minutes');
    		console.log("Time to negative train time " + minsToNextTrain);


    	}

    	//--------------------------------------------------

		// Fix new row method below to use all jQuery
		var newRow = $("<tr>")
		newRow.append('<td>' + latestTrainName+ '</td>');
		newRow.append('<td>' + latestDestination+ '</td>');
		newRow.append('<td>' + latesttrainFrequency + '</td>');
		//Fix Calculate Next arrival
		newRow.append('<td>' + nextArrivalConverted + '</td>');
		//Fix Mins away
		newRow.append('<td>' + minsToNextTrain + '</td>');

		$("#displayCurrentTrains").append(newRow);

	});
	console.log("Initial load from firebase DB COMPLETE!");
	console.log("---------------------------------------");
	//Set initialLoadComplete flag to true
	initialLoadComplete = true;

});

// Display new train that was just added
database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){

	if(initialLoadComplete === true){
		console.log("CHILD Added BEGIN");

		//Fix Since done multiple times, make a function for displaying data
		//console.log(snapshot);
		var latestTrainName = snapshot.val().trainName;
		var latestDestination = snapshot.val().destination;
		var latestFirstTrainTime = snapshot.val().firstTrainTime;
		var latesttrainFrequency = snapshot.val().trainFrequency;
		var latestTrainDateAdded = snapshot.val().dateAdded;


		console.log("New Child Method" + latestTrainName + " " + latestDestination +" " + latestFirstTrainTime + " " + latesttrainFrequency +  " " + latestTrainDateAdded);

		// Calculate train time!
		//---------------------------------------
		// Convert first train time to a moment
		var expectedStartTimeFormat = "HH:mm";
    	var convertedFirstTrainTime = moment(latestFirstTrainTime, expectedStartTimeFormat);
    	// Decrement start time by a day??
    	console.log("Start Time - " + convertedFirstTrainTime);

    	// Set curent time to a moment
    	var now = moment();

    	// Total number of mins between now and the start time
    	var minsDifference = now.diff(convertedFirstTrainTime, 'minutes');
    	console.log("Minutes from start time " + minsDifference);

    	// Remainder of mins until next train is minsDifference % latesttrainFrequency
    	var remainder = minsDifference % latesttrainFrequency;
    	var minsToNextTrain = latesttrainFrequency - remainder;
    	console.log("Remainder Minutes till next train  " + minsToNextTrain);




    	var nextArrival = now.add(minsToNextTrain, "minutes");
    	
    	var nextArrivalConverted = moment(nextArrival).format("hh:mm");

    	//--------------------------------------------------

		// Fix new row method below to use all jQuery
		var newRow = $("<tr>")
		newRow.append('<td>' + latestTrainName+ '</td>');
		newRow.append('<td>' + latestDestination+ '</td>');
		newRow.append('<td>' + latesttrainFrequency + '</td>');
		//Fix Calculate Next arrival
		newRow.append('<td>' + nextArrivalConverted + '</td>');
		//Fix Mins away
		newRow.append('<td>' + minsToNextTrain + '</td>');

		$("#displayCurrentTrains").append(newRow);
		console.log("CHILD Added END");
	}

});



//When submit button is clicked, add new train
$("#submitBtn").on("click", addNewTrain);