 /* Simple JavaScript Inheritance with NFE's
 * MIT Licensed.
 */
// Inspired by base2 and Prototype and John Resig's class system
(function(){
	var initializing = false;

	// The base Class implementation (does nothing)
	this.Class = function(){};

	// Create a new Class that inherits from this class
	Class.extend = function extend(prop) {
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// if we're overwriting an existing function
			// set the base property
			var value = prop[name];
			if (typeof prop[name] == "function" && typeof _super[name] == "function"){
				value.base = _super[name];
			}
			prototype[name] = value;
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the init method
			if ( !initializing && this.init )
				this.init.apply(this, arguments);
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.prototype.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
})();

/*
//Example from the article:
var Human = Class.extend({
	init: function (height, weight){
		this.height = height;
		this.weight = weight;
	}
});
var Mutant = Human.extend({
	init: function init(height, weight, abilities){
		init.base.call(this, height, weight);
		this.abilities = abilities;
	}
});

var theWolverine = new Mutant('5ft 3in', 300, [
	'adamantium skeleton',
	'heals quickly',
	'claws'
]);    
*/