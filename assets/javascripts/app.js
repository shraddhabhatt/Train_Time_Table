var config = {
    apiKey: "AIzaSyAz9sIj-AmLgyEtk43MCG55wtmrvuoL3Ns",
    authDomain: "my-inclass-project.firebaseapp.com",
    databaseURL: "https://my-inclass-project.firebaseio.com",
    projectId: "my-inclass-project",
    storageBucket: "my-inclass-project.appspot.com",
    messagingSenderId: "857221685359"
  };
    firebase.initializeApp(config);


// Create a variable to reference the database
var database = firebase.database();

$("#formaddtrain").validate({
	
	   rules: {
	      trainname: "required",
	      destination: "required",
	      starttime: "required",
	      frequency: {
	        required: true,
	        maxlength: 4
	      }
	    },
	    // Specify validation error messages
	    messages: {
	      trainname: "Train name is a required",
	      destination: "What's the last destination",
	      starttime: "Please enter the first train time",
	      frequency: "Please enter the difference of time in mins between two trains "
	    },
	    // Make sure the form is submitted to the destination defined
	    // in the "action" attribute of the form when valid
	    submitHandler: function(form) {
	    	addtrain();
	    }
  });

function addtrain(){

	var trainName = $("#trainName-input").val().trim();
	var trainDestination = $("#trainDestination-input").val().trim();
	var trainStartTime = $("#trainStartTime-input").val().trim();
	var trainFrequency = $("#trainFrequency-input").val().trim();

	// value fields for db
	
	var traindata = {
		TrainName: trainName,
		TrainDestination: trainDestination,
		TrainStartTime: trainStartTime,
		TrainFrequency: trainFrequency,
		r_createDate: firebase.database.ServerValue.TIMESTAMP
	}

	// upload input data into db

	database.ref().push(traindata);

	// Clears all of the text-boxes
	$("#trainName-input").val("");
	$("#trainDestination-input").val("");
	$("#trainStartTime-input").val("");
	$("#trainFrequency-input").val("");

	// Prevents moving to new page
	return false;
}


database.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().TrainName;
	var trainDestination = childSnapshot.val().TrainDestination;
	var trainStartTime = childSnapshot.val().TrainStartTime;
	var trainFrequency = childSnapshot.val().TrainFrequency;

	var firstTimeConverted = moment(trainStartTime, "hh:mm A");
    var currentTime = moment();
    
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    
    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
   
    if(diffTime >= 0)
    {
        // Minute Until Train
        var tMinutesTillTrain = trainFrequency - tRemainder;
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    }
    else
    {
        // Minute Until Train
        var tMinutesTillTrain = moment(firstTimeConverted).diff(moment(currentTime), "minutes");;
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    }
	//write fields to html

$("#TrainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + moment(nextTrain).format("hh:mm A") + "</td><td>" + tMinutesTillTrain + "</td></tr>");

});	