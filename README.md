"# ce-hw" 

[Custom Elements v1](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) - "Hello World" demo

The code for [custom elements v1 vs js frameworks](https://ferdychristant.com/custom-elements-v1-vs-js-frameworks-e086638cd1a9#.csh0br49h) blog post by *Ferdy Christant*

## Browser support
- Chrome (56): 100%, native support
- Firefox (51): 100%, using polyfill
- Edge (14): 100%, using polyfill
- Opera (42): 100%, native support
- Chrome for Android (55): 100%, native support
- Mobile Safari 10 (iOS10.2): 100%, using polyfill (tested both on iPhone and iPad)
- Safari 10 on Mac: 100%, using polyfill

Reasonable native support that is soon to be improved (Safari’s latest version will deliver native support and is around the corner, Firefox and Edge are working on it)

## Install

`npm i` or `yarn install`

## Run

The `index.html` is hooked up and ready to go.

`open index.html`

## Scripts

See `gulpfile.js` or `package.json` `"scripts"` entry.

- `npm run watch` (or `gulp watch`)
- `npm run scripts` (or `gulp scripts`)

`scripts` is used to compile `/src/js` files to `/js` and enable live reload on change.

`watch` is used to watch `.js` files in `src/js` for changes and trigger the `scripts` script to compile and reload (on any such change).

## License

MIT
