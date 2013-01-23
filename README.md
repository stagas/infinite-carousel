
# infinite-carousel

`component-install stagas/infinite-carousel`

## Usage

```html
<div id="my-carousel">
  <ul>
    <li>Item 1
    <li>Item 2
  </ul>
</div>
```

```js
var Carousel = require('infinite-carousel');

var el = document.getElementById('my-carousel');
var carousel = Carousel(el);
```

## API

### carousel.next()

Show next item.

### carousel.prev()

Show previous item.

## Protip

For a slide effect use this in your css:

```css
.carousel li {
  transition: .4s all ease;
  -webkit-transition: .4s all ease;
  -moz-transition: .4s all ease;
  -o-transition: .4s all ease;
}
```

## Credits

This is a modified version of [tomerdmnt/carousel](https://github.com/tomerdmnt/carousel) (MIT)

## Licence

MIT
