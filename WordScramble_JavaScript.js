/*
Authors    : Jermaine Ramsay(2100471), Kimar Morgan(1403238), Mellicia Rowe(2101716), Zavier Jackson(2007906)
Source     : WordScramble_JavaScript.js
Description: Consists of functions to be called either when a HTML button element is clicked or from within another function
*/

var PlayersData     = [];
var question        = {};
const today         = new Date();
var timeLeft        = 10;
var displayedArrows;
var randomWord;
var gameTimer;
let arrowTimer      = setInterval(toggleArrows, 500);	// toggleArrows() function will be called every 1/2 second once page loads

setInterval(showfreq,5000);								// showfreq() function will be called every 5 seconds once page loads

// Author: Zavier Jackson
// Called by "Register" Button
function Register() {
	displayedArrows = 0;						// Number of arrow images that are visible on th page
	hideArrows();								// Hide all arrow images (also used to synch toggling)
	var firstName = document.getElementById("firstName").value;
	var lastName  = document.getElementById("lastName").value;
	var dob       = document.getElementById("dob").value;
	var gender    = document.getElementById("gender").value;
	var email     = document.getElementById("email").value.trim();

	if (firstName.length < 3) {
		alert("First name must be at least 3 characters long.");
		return;
	}
	if (lastName.length < 3) {
		alert("Last name must be at least 3 characters long.");
		return;
	}
	if (dob == "") {
		alert("Date of birth is required.");
		return;
	}

	var birthDate = new Date(dob);
	// The getFullYear() method returns a 4-digit number representing the full year of the specified date
	var age = today.getFullYear() - birthDate.getFullYear();	// Stores difference between current year and birth year
	// The getMonth() method for the Date object returns the month of a date as a zero-based index
	var m = today.getMonth() - birthDate.getMonth();			// Stores difference between current month and birth month (from a zero-based index)
	// If current month is before birth month OR (If birth month AND before birthday)
	// m < 0 -> If current month is before birth month
	// (m === 0 && today.getDate() < birthDate.getDate()) -> If current month is birth month but before birthday
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}

	document.getElementById("age").value = age;

	if (age < 8 || age > 12) {
		alert("Age must be between 8 and 12 inclusive.");
		return;
	}
	if(gender === ""){				// If player does not select any gender
		alert("Select appropriate gender");
		return;
	}
	if (email.indexOf("@gmail.com") == -1) {
		alert("Email address must end with '@gmail.com'.");
		return;
	}

	var player = {						// Player object that will be appended to global array PlayersData[]
		firstName       : firstName,
		lastName        : lastName,
		dob             : dob,
		age             : age,
		gender          : gender,
		email           : email,
		correctWords    : [],
		answers         : [],
		questions       : [],
		percentageScore : 0
	};
	PlayersData.push(player);
	alert("Player registered successfully!");

	// All the necessary fields and butttons in the Registration Area are disabled
	document.getElementById("firstName").disabled = true;
	document.getElementById("lastName").disabled = true;
	document.getElementById("dob").disabled = true;
	document.getElementById("age").disabled = true;
	document.getElementById("gender").disabled = true;
	document.getElementById("email").disabled = true;
	document.getElementById("registerButton").disabled = true;
	document.getElementById("endButton").disabled = false;		// "End" button is enabled
	document.getElementById("startButton").disabled = false;	// "Start" button is enabled
}

// Author: Mellicia Rowe
// Called by "Start" and "Next" Buttons
function PlayGame(){
	clearInterval(gameTimer);							// Stops game timer 
	// The following array is a list of words, one of which will be scrambled, and their definitions/hints that the player will use
	// in helping to unscramble the word
	let words = [
				{ word: "canvas",  hint: "Piece of fabric for oil painting"                                  },
				{ word: "number",  hint: "Math symbol used for counting"                                     },
				{ word: "garden",  hint: "Space for planting flower and plant"                               },
				{ word: "comfort", hint: "A pleasant feeling of relaxation"                                  },
				{ word: "tongue",  hint: "The muscular organ of mouth"                                       },
				{ word: "group",   hint: "A number of objects or persons"                                    },
				{ word: "taste",   hint: "Ability of tongue to detect flavour"                               },
				{ word: "store",   hint: "Large shop where goods are traded"                                 },
				{ word: "field",   hint: "Area of land for farming activities"                               },
				{ word: "friend",  hint: "Person other than a family member"                                 },
				{ word: "pocket",  hint: "A bag for carrying small items"                                    },
				{ word: "needle",  hint: "A thin and sharp metal pin"                                        },
				{ word: "expert",  hint: "Person with extensive knowledge"                                   },
				{ word: "second",  hint: "One-sixtieth of a minute"                                          },
				{ word: "book",    hint: "Bound pages with written or printed text"                          },
				{ word: "chair",   hint: "Furniture for sitting on"                                          },
				{ word: "clock",   hint: "Device for measuring time"                                         },
				{ word: "desk",    hint: "Furniture for writing or working on"                               },
				{ word: "door",    hint: "Entrance to a room or building"                                    },
				{ word: "floor",   hint: "Surface to walk on in a room or building"                          },
				{ word: "glass",   hint: "Transparent material for windows or containers"                    },
				{ word: "key",     hint: "Metal object for opening locks"                                    },
				{ word: "lamp",    hint: "Device for producing light"                                        },
				{ word: "mirror",  hint: "Reflective surface for seeing oneself"                             },
				{ word: "pen",     hint: "Writing instrument with ink"                                       },
				{ word: "phone",   hint: "Device for making calls or sending messages"                       },
				{ word: "photo",   hint: "Image captured by a camera"                                        },
				{ word: "pillow",  hint: "Soft cushion for resting one's head"                               },
				{ word: "plate",   hint: "Flat dish for serving food"                                        },
				{ word: "shoe",    hint:"Footwear with a sole and upper part"                                },
				{ word: "spoon",   hint:"Utensil with handle and bowl-shaped end for eating or serving food" },
				{ word: "table",   hint:"Furniture with a flat top and legs for eating or working on"        },
				{ word: "towel",   hint:"Piece of absorbent fabric for drying oneself after washing"         },
				{ word: "window",  hint:"Opening in a wall to let in light and air"                          }
	];

	document.getElementById("play-area").disabled = false;		// Play Area is enabled
	document.getElementById("results-area").disabled = false;	// Results Area is enabled
	document.getElementById("answer").disabled = false;			// Textfield to store player's answer is enabled
	document.getElementById("acceptButton").disabled = false;	// "Accept" button is enabled
	document.getElementById("nextButton").disabled = false;		// "Next" button is enabled

	var wordArray;

	while(true){
		randomWord = words[Math.floor(Math.random() * words.length)];	// Random array element is chosen from objects array words[]
		// Individual characters of array element's "word" property are split up as elements of a new array
		wordArray = randomWord.word.split("");
		for (let i = wordArray.length - 1; i > 0; i--) {					// Iterate through character elements
			let j = Math.floor(Math.random() * (i + 1));
			[wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];	// Randomize positions between two characters
		}
		// Stores 'true' or 'false' depending on if the "hint" property of the random word chosen
		// was previously recorded in a past question for the current player
		let isStringInQuestions = PlayersData[PlayersData.length-1].questions.some(questionObj => questionObj.hint === randomWord.hint);
		// Stores 'true' or 'false' depending on if scrambled word matches the random word chosen
		let isScrambled = (wordArray.join("") !== randomWord.word);
		if(!(isStringInQuestions) && isScrambled){						// If question was NOT already given AND If word of question is truly scrambled
			break;
		}
	}
	document.getElementById("scrambled-word").value = wordArray.join("");	// Scrambled word is assigned to "scrambled-word" textbox
	document.getElementById("hint").value = randomWord.hint;				// Hint of random word is assigned to "hint" textbox
	question = {scrambledWord: wordArray.join(""), hint: randomWord.hint};	// Object storing scrambled word and random word hint is assigned

	gameTimer = setInterval(StartTimer, 1000);								// StartTimer() function is set to be called per second

	if(displayedArrows === 0){												// If no arrows are currently being displayed
		// Increment to 1 to let the first arrow be displayed the next time the toggleArrows() function is called according to an interval
		displayedArrows++;													
	}
}

// Author: Jermaine Ramsay
// Called every 1/2 second
function toggleArrows() {
	// Initially, all arrow images are hidden (seen in index.html) but the variable "displayedArrows"
	// will be incremented repeatedly in some functions based on a button that is clicked and which
	// game area the player is currently at.
	for(let i=1; i<=displayedArrows; i++){
		const arrowId  = document.getElementById("arrow"+i);
		// The hidden attribute of an arrow image will be assigned the opposite value of what it currently is.
		// For instance, if it is currently storing 'true', then it will be assigned 'false' and vice versa
		arrowId.hidden = !(arrowId.hidden);		
	}
}
// Author: Jermaine Ramsay
// Called by various functions to synchronize toggling of arrow images since they will not all be initially displayed simultaneously
function hideArrows(){
	// assignment chaining
	document.getElementById("arrow1").hidden =
	document.getElementById("arrow2").hidden =
	document.getElementById("arrow3").hidden =
	document.getElementById("arrow4").hidden = true;
}
// Author: Mellicia Rowe
// Called by PlayGame() where it is set to be called every second
function StartTimer() {
	// Text representing seconds enclosed with HTML tags will be displayed to speciifc HTML element with the id stated
    document.getElementById("timer").innerHTML = "<h1>"+timeLeft+"</h1>";		
    if (timeLeft === 0) {
        document.getElementById("timer").innerHTML = "<h1>Time's up!</h1>";
        CheckAnswer();
    }
	timeLeft--;
}
// Author: Mellicia Rowe
// Called by "Accept" Button
function CheckAnswer(){
	var answerField = document.getElementById("answer").value;

	// If timeLeft !== 0 AND the player did not enter an answer then that indicates that the player
	// clicked the "Accept" button totally beforehand
	if (timeLeft !== 0 && answerField.trim() === "") {
		alert("Please enter an answer.");
		return;
	}

	clearInterval(gameTimer);										// Game timer is cleared
	document.getElementById("percentageButton").disabled = false;	// "Show Percentage" button is enabled
	timeLeft = 10;													// Reassigned for the next round

	if(displayedArrows === 1){	// If only one arrow image is being displayed/toggled
		displayedArrows += 2;	// Two arrows
		hideArrows();		    // To synchronize arrows the next time toggleArrows() is called
	}

	// "Accept" button is disabled to prevent player from attempting to provide multiple answers to the same
	// question
	document.getElementById("acceptButton").disabled = true;
	// Object "question" which was assigned the scrambled word and a hint in PlayGame() is appended to "questions" array of current player
	PlayersData[PlayersData.length-1].questions.push(question);
	// Object consisting of answer entered by player as well as a boolean value indicating if their answer is correct or not, is appended to
	// "answers" array of current player
	PlayersData[PlayersData.length-1].answers.push({answer: answerField, isCorrect: (String(randomWord.word).toLowerCase() === answerField.toLowerCase())});

	if(String(randomWord.word).toLowerCase() === answerField.toLowerCase()){
		alert("Awesome!! The word is correct");
	} else{
		alert("Sorry, the word is incorrect :(");
	}
	document.getElementById("answer").value = "";	// Resets answer field
	showAll();
}
// Author: Zavier Jackson
// Called by various functions
function calculateScore(Player){
	const numOfQuestions = Player.questions.length;
	const numOfCorrectAnswers = Player.answers.filter(answer => answer.isCorrect === true).length;
	Player.percentageScore = parseFloat(numOfCorrectAnswers/numOfQuestions*100).toFixed(2);
}
// Author: Kimar Morgan
// Called by "End" Button
function findPercentageScore(disableControls){
	if(disableControls){
		clearInterval(gameTimer);
		document.getElementById("overall-form").reset();
		//document.getElementById("play-area").reset();
		document.getElementById("play-area").disabled = true;
		// Get all the buttons on the page
		const buttons = document.querySelectorAll("button");
		// Loop through each button and disable all except for registerButton
		buttons.forEach((button) => {
			button.disabled = (button.id !== "registerButton" ? true : false);	//true/false
		});
		displayedArrows = 4;
		hideArrows();
	}
	const numOfQuestions = PlayersData[PlayersData.length-1].questions.length;
	const numOfCorrectAnswers = PlayersData[PlayersData.length-1].answers.filter(answer => answer.isCorrect === true).length;
	calculateScore(PlayersData[PlayersData.length-1]);

	var output = "";

	//var percentage = PlayersData[i].isCorrect ? 100 : 0;
	output =  "Player Name    : " + PlayersData[PlayersData.length-1].firstName + " " + PlayersData[PlayersData.length-1].lastName + "\n";
	output += "Date           : " + (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear() + "\n";
	output += "# of questions : " + numOfQuestions + "\n";
/*
This is a JavaScript arrow function that takes a parameter answer and checks if the isCorrect property of the answer object is equal to true. It returns true if the condition is satisfied, and false otherwise.
would return a new array containing only the 'answer' objects where 'isCorrect' is true
*/
	output += "# of correct answers: " + numOfCorrectAnswers + "\n";
	output += "Percentage Score    : " + PlayersData[PlayersData.length-1].percentageScore + "%\n";

	document.getElementById("showpercentage").value = output;

	const registrationArea = document.getElementById("registration-area");

	if(disableControls){
		const formControls = registrationArea.querySelectorAll("input, select, button");
		formControls.forEach((control) => {
			if (control.id !== "endButton" && control.id !== "startButton"){
				control.disabled = false;
			}
		});
	}
}
// Author: Zavier Jackson
// Called by CheckAnswer()
function showAll(){
	document.getElementById("showallplayers").value = "";
	var output = "";
	PlayersData.forEach((Player) => {
		calculateScore(Player);
		output +=  "Player Name         : " + Player.firstName + " " + Player.lastName + "\n";
		output += "Age                 : " + Player.age + "\n";
		output += "Questions\n----------\n";
		for(let i=0; i<Player.questions.length; i++){
			output += "#" + (i+1) + ". Scrambled word: " + Player.questions[i].scrambledWord + "\t" + "Hint: " + Player.questions[i].hint + "\n"
			output += "    Answer        : " + Player.answers[i].answer + "\t" + "Status: " + (Player.answers[i].isCorrect == true? "Correct" : "Incorrect") + "\n";
		}
		output += "Percentage Score    : " + Player.percentageScore + "%\n";
		output += ",,,,,,,,,,,,,,,,,,,,,,\n";
	});

	document.getElementById("showallplayers").value = output;
}
// Author: Jermaine Ramsay
// Called every 5 seconds
function showfreq() {
    let totalPlayers = PlayersData.length;
    let maleCount = 0;
    let femaleCount = 0;
    let scoreCounts = [0, 0, 0, 0, 0, 0, 0];

	if(totalPlayers !== 0){
		PlayersData.forEach((player) => {
			if (player.gender === "male") {
				maleCount++;
			} else if (player.gender === "female") {
				femaleCount++;
			}

			let score = player.percentageScore;
			if (score < 50) {
				scoreCounts[0]++;
			} else if (score >= 50 && score < 60) {
				scoreCounts[1]++;
			} else if (score >= 60 && score < 70) {
				scoreCounts[2]++;
			} else if (score >= 70 && score < 80) {
				scoreCounts[3]++;
			} else if (score >= 80 && score < 90) {
				scoreCounts[4]++;
			} else if (score >= 90 && score < 100) {
				scoreCounts[5]++;
			} else {
				scoreCounts[6]++;
			}
		});

		let genderTable = "<table class='bar_chart'><tr><th>Gender</th><th>Frequency</th></tr>";
		genderTable += "<tr><td>Male</td><td><img src='Assets/thin_bar.png' height='20px' width='" + (maleCount / totalPlayers * 100) + "'></td></tr>";
		genderTable += "<tr><td>Female</td><td><img src='Assets/thin_bar.png' height='20px' width='" + (femaleCount / totalPlayers * 100) + "'></td></tr>";
		// genderTable += "</table>";

		let scoreTable = "<tr><th>Score Range</th><th>Frequency</th></tr>";
		scoreTable += "<tr><td>&lt;50</td><td><img src='Assets/thin_bar.png' height='20px' width='" + (scoreCounts[0] / totalPlayers * 100) + "'></td></tr>";
		scoreTable += "<tr><td>50-59</td><td><img src='Assets/thin_bar.png' height='20px' width='" + (scoreCounts[1] / totalPlayers * 100) + "'></td></tr>";
		scoreTable += "<tr><td>60-69</td><td><img src='Assets/thin_bar.png' height='20px' width='" + (scoreCounts[2] / totalPlayers * 100) + "'></td></tr>";
		scoreTable += "<tr><td>70-79</td><td><img src='Assets/thin_bar.png' height='20px' width='" + (scoreCounts[3] / totalPlayers * 100) + "'></td></tr>";
		scoreTable += "<tr><td>80-89</td><td><img src='Assets/thin_bar.png' height='20px' width='" + (scoreCounts[4] / totalPlayers * 100) + "'></td></tr>";
		scoreTable += "<tr><td>90-99</td><td><img src='Assets/thin_bar.png' height='20px' width='" + (scoreCounts[5] / totalPlayers * 100) + "'></td></tr>";
		scoreTable += "<tr><td>100</td><td><img src='Assets/thin_bar.png' height='20px' width='" + (scoreCounts[6] / totalPlayers * 100) + "'></td></tr>";
		scoreTable += "</table>";

		document.getElementById("showcharts").innerHTML = genderTable + "<br>" + scoreTable;
	}
}
