# Overview of Key Concepts in CSS

## Box Model
1. Content
2. Padding
3. Boarder
4. Margin

See Dev Tools to dynamically inspect the boxes, and this [page](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model) for more details.

## Logic of CSS
- Inheritance >> selected container rules apply to children in the document object model
- Cascading >> rules stack in their application to a container / element
- Specificity >> the more specific selector will override a more general selector, e.g. if the parent class text is set to blue, but the child class is selected, and red text is applied, the text will be red.

## Preparing HTML for CSS
CSS can operate on HTML element types directly, such as `<h1></h1>` or `<p></p>` or `<body></body>`. Often though, we want to style groups of content. To learn more about structuring HTML content, see this [page](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Structuring_a_page_of_content).

A `<div></div>` is a general type of HTML container. Other more semantically rich HTML containers in `<group></group> This can be attributed two different ways so that CSS can select it.
1. With an `id` >> `<div id="example-id-that-css-can-select"></div>`.
2. With a `class` >> `<div class="example-class-that-could-apply-to-many-elements"></div>`

There are *many* different attributes, many specific to the unique type of element. See the MDN Web [docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes).

## Layout

### Standard Document Flow
Elements will be positioned in the order that they are presented in the HTML document. There are two types of HTML elements: block and inline. 
Block elements will create a new line for each new element and with span the entire width of the page. An example of this type are lists, .e.g. `<ol> <li> </ol>`. See here for more on [lists](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul).
Inline elements are elements that do not create a new row. These include `<span>`, `<img>`, `<button>`, and many others.

### Flexbox
Built in CSS property that manages space on the page via containers along one axis.
  ```
  flex-containers {
    display: flex; /* Enables Flexbox */
    flex-direction: row; /* Default is row; column option */
    flex-wrap: wrap; /* nowrap is default; wrap auto adds rows */
  }
  ```
See [here](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox) for more details.

### Grid
Built in CSS property for managing a grid of containers. Very useful for dashboards.
  ```
  .wrapper {
    display: grid;
    grid-template-columns: 200px 200px 200px; /* Creates three column grid, each 200px wide */
  }
  ```

See [here](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout) for more details.

### CSS Values and Units of Measure
There are many different units of measuring for controlling size and positioning. See this page [here](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units).
