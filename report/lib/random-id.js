const random = require('random-word');

var seed = new Date();

module.exports = function () {
	/*
	 * Generate a random class id
	 */
	var id = random ();
	seed++;

	return `${id}.${seed}`;
};
