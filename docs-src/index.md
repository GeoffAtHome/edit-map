---
layout: page.11ty.cjs
title: <edit-map> ⌲ Home
---

# &lt;edit-map>

`<edit-map>` is an element that uses the Google Maps API. You need an API key to use this element.

## As easy as HTML

<section class="columns">
  <div>

`<edit-map>` is just an HTML element. You can it anywhere you can use HTML!

```html
<edit-map></edit-map>
```

  </div>
  <div>

<edit-map apikey = 'AIzaSyAgV7gRtp8kIpEb17-ukuHMw7lte494nw8' options= '{ "center": { "lat": 51.50053, "lng": -3.24153 },"zoom": 18 }'>
</edit-map>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<edit-map>` can be configured with attributed in plain HTML.

```html
<edit-map name="HTML"></edit-map>
```

  </div>
  <div>

<edit-map apikey = 'AIzaSyAgV7gRtp8kIpEb17-ukuHMw7lte494nw8' options= '{ "center": { "lat": 51.50053, "lng": -3.24153 },"zoom": 19 }'>
</edit-map>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<edit-map>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name="lit-html";

render(html`
  <h2>This is a &lt;edit-map&gt;</h2>
  <edit-map .name=${name}></edit-map>
`, document.body);
```

  </div>
  <div>

<h2>This is a &lt;edit-map&gt;</h2>
<edit-map apikey = 'AIzaSyAgV7gRtp8kIpEb17-ukuHMw7lte494nw8' options= '{ "center": { "lat": 51.50053, "lng": -3.24153 },"zoom": 20 }'>
</edit-map>

  </div>
</section>
