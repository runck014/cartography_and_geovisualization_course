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

In your CSS file, you can use the ID to select a specific HTML container like this:

```
/* CSS for Selecting by ID */
#example-id-that-css-can-select {
    background-color: blue;
}
```

Alternatively, if you have a bunch of items that require the same styling and you use the `class` tag, you can select and style those like this:

```
/* CSS for Selecting by Class */
.example-class-that-could-apply-to-many-elements {
    background-color: blue;
}
```

There are *many* different attributes, many specific to the unique type of element. See the MDN Web [docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes).

## Layout
CSS allows us to both style individual elements, groups of elements, and determine their layout on the page. There are three general approaches to be aware of: (1) standard document flow (e.g. the order of your HTML), (2) Flexbox (e.g. think of putting elements in a row or column with optional wrapping), and (3) Grid (e.g. when you want to divide a screen into a grid of boxes to place elements in. Demos of each are below.


## Standard Document Flow
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
There are many different units of measuring for controlling size and positioning. See this page [here](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units). Following is one categorization.

| Unit Type | Unit | Description | Common Uses |
|-----------|------|-------------|-------------|
| **Absolute** ||||
|| `px` | Fixed-size pixel unit. 1px = 1/96th of an inch on most screens | Borders, small fixed measurements, minimum/maximum constraints |
| **Relative** ||||
|| `rem` | Relative to root element's font size (default: 16px) | Font sizes, margins, paddings - ideal for consistent scaling |
|| `em` | Relative to parent element's font size | Component-level spacing, especially when text scaling is desired |
|| `%` | Relative to parent element's corresponding dimension | Fluid layouts, responsive widths/heights |
| **Viewport** ||||
|| `vw` | 1% of viewport width | Full-width elements, responsive typography |
|| `vh` | 1% of viewport height | Full-height layouts, hero sections |
|| `dvh` | Dynamic viewport height - adjusts for mobile browser chrome | Mobile-friendly full-height layouts |
|| `vmin` | 1% of smaller viewport dimension | Maintaining aspect ratios, responsive square elements |
|| `vmax` | 1% of larger viewport dimension | Background sizing, maximum content boundaries |
| **Typography** ||||
|| `ch` | Width of the "0" character in current font | Text container widths, especially for monospace fonts |
|| `ex` | Height of the font's x-character | Vertical alignment with typography |
|| `lh` | Value of the element's line-height | Vertical rhythm in typography |
| **Grid** ||||
|| `fr` | Fractional unit for distributing space in CSS Grid | Grid layouts with proportional columns/rows |


Because web browsers function across many types of devices (mobile phones, tablets, desktops, giant wall monitors), we want our geovisualizations to work across each of these types as well. This is called responsive web design. This is what we discuss briefly next.

