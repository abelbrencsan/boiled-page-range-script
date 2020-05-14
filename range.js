/**
 * Range - v1.0.0
 * Copyright 2020 Abel Brencsan
 * Released under the MIT License
 */

var Range = function(options) {

	'use strict';

	// Test required options
	if (typeof options.input !== 'object') throw 'Range "input" option must be an object';
	if (typeof options.triggers == 'object') {
		for (var i = 0; i < options.triggers.length; i++) {
			if (typeof options.triggers[i].element !== 'object') throw 'Range trigger "element" option must be an object';
			if (typeof options.triggers[i].value !== 'number') throw 'Range trigger "value" option must be a number';
		}
	}

	// Default range instance options
	var defaults = {
		input: null,
		indicator: null,
		triggers: [],
		locale: 'en-US',
		initCallback: null,
		stepCallback: null,
		valueIsChangedCallback: null,
		destroyCallback: null
	};

	// Extend range instance options with defaults
	for (var key in defaults) {
		this[key] = (options.hasOwnProperty(key)) ? options[key] : defaults[key];
	}

	// Range instance variables
	this.isInitialized = false;
	this.step = 1;
	this.min = 0;
	this.max = 100;

};

Range.prototype = function () {

	'use strict';

	var range = {

		/**
		* Initialize range. It gets minimum, maximum and step attributes of range input, creates events relevant to range. (public)
		*/
		init: function() {
			if (this.isInitialized) return;
			var step, min, max;
			this.handleEvent = function(event) {
				range.handleEvents.call(this, event);
			};
			if (this.input.hasAttribute('step')) {
				step = parseFloat(this.input.getAttribute('step'));
				if (!isNaN(step)) {
					this.step = step;
				}
			}
			if (this.input.hasAttribute('max')) {
				max = Number(this.input.getAttribute('max'));
				if (!isNaN(max)) {
					this.max = max;
				}
			}
			if (this.input.hasAttribute('min')) {
				min = Number(this.input.getAttribute('min'));
				if (!isNaN(max)) {
					this.min = min;
				}
			}
			this.input.addEventListener('input', this);
			this.input.addEventListener('blur', this);
			for (var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].element.addEventListener('click', this);
			}
			range.updateIndicator.call(this);
			if (this.initCallback) this.initCallback.call(this);
			this.isInitialized = true;
		},

		/**
		* Update current range input value inside indicator. (public)
		*/
		updateIndicator: function() {
			if (this.indicator) {
				this.indicator.innerHTML = Number(this.input.value).toLocaleString(this.locale);
			}
		},

		/**
		* Increment or decrement range input by given value. (public)
		* @param value number
		*/
		stepByValue: function(value) {
			if (Number(this.input.value) + (value * this.step) > this.max) {
				range.setValue.call(this, this.max);
			}
			else if (Number(this.input.value) + (value * this.step) < this.min) {
				range.setValue.call(this, this.min);
			}
			else {
				this.input.stepUp(value);
				range.updateIndicator.call(this);
				if (this.valueIsChangedCallback) this.valueIsChangedCallback.call(this);
			}
			if (this.stepCallback) this.stepCallback.call(this);
		},

		/**
		* Set range input to given value. (public)
		* @param value number
		*/
		setValue: function(value) {
			this.input.value = value;
			range.updateIndicator.call(this);
			if (this.valueIsChangedCallback) this.valueIsChangedCallback.call(this);
		},

		/**
		* Get current range input value. (public)
		*/
		getValue: function() {
			return Number(this.input.value);
		},

		/**
		* Handle events. (private)
		* On trigger click: Step range input by trigger's value multiplied by input's `step` value.
		* On input or blur: Update indicator.
		* @param event object
		*/
		handleEvents: function(event) {
			if (event.type == 'input' || event.type == 'blur') {
				if (event.target == this.input) {
					range.updateIndicator.call(this);
					if (this.valueIsChangedCallback) this.valueIsChangedCallback.call(this);
				}
			}
			else if (event.type == 'click') {
				event.preventDefault();
				for (var i = 0; i < this.triggers.length; i++) {
					if (event.target == this.triggers[i].element) {
						range.stepByValue.call(this, this.triggers[i].value);
					}
				}
			}
		},

		/**
		* Destroy range. It removes events relevant to range. (public)
		*/
		destroy: function() {
			if (!this.isInitialized) return;
			this.input.removeEventListener('input', this);
			this.input.removeEventListener('blur', this);
			for (var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].element.removeEventListener('click', this);
			}
			this.isInitialized = false;
			if (this.destroyCallback) this.destroyCallback.call(this);
		},

		/**
		 * Get value of "isInitialized" to be abe to check range is initialized. (public)
		 */
		getIsInitialized: function() {
			return this.isInitialized;
		}
	};

	return {
		init: range.init,
		updateIndicator: range.updateIndicator,
		stepByValue: range.stepByValue,
		setValue: range.setValue,
		getValue: range.getValue,
		destroy: range.destroy,
		getIsInitialized: range.getIsInitialized
	};

}();
