/**
 * Range
 * Copyright 2024 Abel Brencsan
 * Released under the MIT License
 */
const Range = function(options) {

	'use strict';

	// Test required options
	if (!(options.input instanceof HTMLInputElement)) {
		throw 'Range "input" must be an `HTMLInputElement`';
	}
	if (!(options.triggers instanceof Array)) {
		throw 'Range "triggers" must be an `Array`';
	}
	for (let i = 0; i < options.triggers.length; i++) {
		if (!(options.triggers[i].element instanceof HTMLButtonElement)) {
			throw 'Range trigger "element" must be an `HTMLButtonElement`';
		}
		if (typeof options.triggers[i].value !== 'number') {
			throw 'Range trigger "value" must be a number';
		}
	}

	// Default range instance options
	let defaults = {
		input: null,
		indicator: null,
		triggers: [],
		locale: 'en-US',
		indicatorFormatter: null,
		initCallback: null,
		stepCallback: null,
		valueIsChangedCallback: null,
		destroyCallback: null,
	};

	// Extend range instance options with defaults
	for (let key in defaults) {
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

	let range = {

		/**
		* Initialize range.
		* 
		* @public
		*/
		init: function() {
			if (this.isInitialized) return;
			this.handleEvent = function(event) {
				range.handleEvents.call(this, event);
			};
			this.input.addEventListener('input', this);
			for (let i = 0; i < this.triggers.length; i++) {
				this.triggers[i].element.addEventListener('click', this);
			}
			if (this.input.hasAttribute('step')) {
				let step = parseFloat(this.input.getAttribute('step'));
				if (!isNaN(step)) {
					this.step = step;
				}
			}
			if (this.input.hasAttribute('max')) {
				let max = Number(this.input.getAttribute('max'));
				if (!isNaN(max)) {
					this.max = max;
				}
			}
			if (this.input.hasAttribute('min')) {
				let min = Number(this.input.getAttribute('min'));
				if (!isNaN(min)) {
					this.min = min;
				}
			}
			range.updateIndicator.call(this);
			this.isInitialized = true;
			if (this.initCallback) this.initCallback.call(this);
		},

		/**
		* Increase or decrease range input by given value.
		* 
		* @public
		* @param {number} value
		*/
		stepByValue: function(value) {
			let currValue = range.getValue.call(this);
			let newValue = currValue + (value * this.step);
			range.setValue.call(this, newValue);
			if (this.stepCallback) this.stepCallback.call(this);
		},

		/**
		* Set given value for range input.
		* 
		* @public
		* @param {number} value
		*/
		setValue: function(value) {
			if (value > this.max) {
				this.input.value = this.max;
			}
			else if (value < this.min) {
				this.input.value = this.min;
			} else {
				this.input.value = value;
			}
			range.valueIsChanged.call(this);
		},

		/**
		* Get current value of range input.
		* 
		* @public
		*/
		getValue: function() {
			return Number(this.input.value);
		},

		/**
		* Update indicator by current range input value.
		* 
		* @public
		*/
		updateIndicator: function() {
			if (!this.indicator) return;
			let currValue = range.getValue.call(this);
			if (this.indicatorFormatter) {
				let formatted = this.indicatorFormatter.call(this, currValue);
				this.indicator.innerHTML = formatted;
			} else {
				let formatted = currValue.toLocaleString(this.locale);
				this.indicator.innerHTML = formatted;
			}
		},

		/**
		* Range input value is changed.
		* 
		* @private
		*/
		valueIsChanged: function() {
			range.updateIndicator.call(this);
			if (this.valueIsChangedCallback) this.valueIsChangedCallback.call(this);
		},

		/**
		* Handle events.
		* On trigger click: step range input by trigger's value.
		* On range input change: update indicator.
		* 
		* @public
		* @param event object
		*/
		handleEvents: function(event) {
			if (event.type == 'input') {
				if (event.target == this.input) {
					range.valueIsChanged.call(this);
				}
			}
			else if (event.type == 'click') {
				for (let i = 0; i < this.triggers.length; i++) {
					if (event.target == this.triggers[i].element) {
						range.stepByValue.call(this, this.triggers[i].value);
					}
				}
			}
		},

		/**
		* Destroy range.
		* 
		* @public
		*/
		destroy: function() {
			if (!this.isInitialized) return;
			this.input.removeEventListener('input', this);
			for (let i = 0; i < this.triggers.length; i++) {
				this.triggers[i].element.removeEventListener('click', this);
			}
			this.step = 1;
			this.min = 0;
			this.max = 100;
			this.isInitialized = false;
			if (this.destroyCallback) this.destroyCallback.call(this);
		}
	};

	return {
		init: range.init,
		updateIndicator: range.updateIndicator,
		stepByValue: range.stepByValue,
		setValue: range.setValue,
		getValue: range.getValue,
		destroy: range.destroy
	};

}();
