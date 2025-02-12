# Responsive Design
Because web browsers function across many types of devices (mobile phones, tablets, desktops, giant wall monitors), we want our geovisualizations to w
ork across each of these types as well. This is called responsive web design.

In order to create responsive designs, you in essence create a separate set of CSS rules for each size of screen. This is done with a media query:

```
/* CSS Media Query */
/* Base styles (no media query needed) - will apply to all sizes */
.container {
    padding: 1rem;
    margin: 0 auto;
}

/* Small devices (phones, 480px and down) */
@media (max-width: 30em) {  /* 30em = 480px */
    .container {
        padding: 0.5rem;
        font-size: 0.875rem;  /* 14px */
        width: 100%;
    }
}

/* Large devices (desktops, 1200px and up) */
@media (min-width: 75em) {  /* 75em = 1200px */
    .container {
        padding: 2rem;
        font-size: 1.125rem;  /* 18px */
        max-width: 1140px;
    }
}
```

Because CSS "cascades", you should place your media queries at the end of your files always otherwise, it won't overwrite the base styles.


## Breakpoints
In the above example, we mix `max-width` and `min-width`. Web designers use "mobile-first" to describe `min-width` as your starting point, whereas `tradition` or `desktop-first` uses `max-width`.


Some example breakpoints for media queries:
- Portrait smartphone -- 480px
- Portrait tablet -- 768px
- Notebook -- 1024px
- Desktop -- 1200px
- Large displays -- 1200px on up

## Use in Practice
1. Start with the main device your user will access the geovisualization from. Build that interface.
2. Then move onto the second most important device size. Build that interface.
3. And so on.



