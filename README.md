
# Boiled Page range script

A simple and lightweight range JavaScript module for Boiled Page frontend framework that can be used to increment or decrement range input values.

## Install

Place `range.js` to `/assets/js` directory and add its path to `scripts` variable in `gulpfile.js` to be combined with other scripts.

## Usage

To create a new range instance, call `Range` constructor the following way:

```js
// Create new range instance
var range = new Range(options);

// Initialize range instance
range.init();
```

## Options

Available options for range constructor:

Option| Type | Default | Required | Description
------|------|---------|----------|------------
`input` | Object | null | Yes | Range input element that's value is incremented or decremented on range trigger click. 
`triggers` | Array | [] | No | Array of range triggers. `element` and `value` properties must be defined for each trigger.
`indicator` | Object | null | No | Current range value is appended to indicator.
`locale` | String | null | No | Current range value is appended in given language-sensitive format.
`initCallback` | Function | null | No | Callback function after range is initialized.
`stepCallback` | Function | null | No | Callback function after range value is stepped.
`valueIsChangedCallback` | Function | null | No | Callback function after range value is changed.
`destroyCallback` | Function | null | No | Callback function after range is destroyed.

Available options for a range trigger object:

Option| Type | Default | Required | Description
------|------|---------|----------|------------
`element` | Object | null | Yes | Element that increments or decrements range input value on click.
`value` | Number | null | Yes | Range input value is incremented or decremented by given value multiplied by range input's `step` attribute.

## Methods

### Initialize range

`init()` - Initialize range. It gets minimum, maximum and step attributes of range input, creates events relevant to range.

### Update indicator

`updateIndicator()` - Update current range input value inside indicator. 

### Step range input by given value

`stepByValue(value)` - Increment or decrement range input by given value.

Parameter | Type | Required | Description
----------|------|----------|------------
`value` | Number | Yes | Value to be stepped by range input.

### Set input value

`setValue(value)` - Set range input to given value.

Parameter | Type | Required | Description
----------|------|----------|------------
`value` | Mixed | Yes | Set range input to given value.

### Get range input value

`getValue()` - Get current range input value.

### Destroy range

`destroy()` - Destroy range. It removes events relevant to range.

### Check range is initialized or not

`getIsInitialized()` - Check range is initialized or not. It returns `true` when it is already initialized, `false` if not.

## Examples

### Example 1

Te following example shows a range input element with two button. The first one increments, the second one decrements range input value by one. You will also need to add form and button components to make the following example works properly.

-   Form component: <https://www.github.com/abelbrencsan/boiled-page-form-component>
-   Button component: <https://www.github.com/abelbrencsan/boiled-page-button-component>

```html
<div class="grid grid--gutter grid--gutter--half">
  <div class="grid-col">
    <button id="priceSubstract" class="button" type="button">-1</button>
  </div>
  <div class="grid-col grid-col--fit">
    <div class="form-item">
      <label class="form-label is-visually-hidden" for="price">Price</label>
      <div aria-live="polite" aria-atomic="true">
        <span id="priceIndicator"></span> HUF
      </div>
      <input id="price" name="price" class="form-range" type="range" />
    </div>
  </div>
  <div class="grid-col">
    <button id="priceAdd" class="button" type="button">+1</button>
  </div>
</div>
```

Place the following code inside `assets/js/app.js` to initialize range.

```js
// Initialize range
app.priceRange = new Range({
  input: document.getElementById('price'),
  indicator: document.getElementById('priceIndicator'),
  triggers: [
    {
      element: document.getElementById('priceSubstract'),
      value: -1
    },
    {
      element: document.getElementById('priceAdd'),
      value: 1
    }
  ]
});
app.priceRange.init();
```
