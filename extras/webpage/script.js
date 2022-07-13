let magicNumber = Math.ceil(((Math.random() * 10))%5);
console.log("Magic number is: " + magicNumber);
playTheGame = function(guess) {
	let response = "Nope. It's not " + guess;
	if (guess > magicNumber)
		response = response + ". Guess Lower!"
	if (guess < magicNumber)
		response = response + ". Guess Higher!"
	if (guess == magicNumber) {
		response = " Correct. The number was " + magicNumber + "."
		magicNumber = Math.ceil(((Math.random() * 10))%5);
		console.log("New magic number is: " + magicNumber);
	}
	document.getElementById('results').innerHTML = response;
} // end the method