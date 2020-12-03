---
layout: page.11ty.cjs
title: <edit-map> ⌲ Home
---

# &lt;edit-map>

`<edit-map>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<edit-map>` is just an HTML element. You can it anywhere you can use HTML!

```html
<edit-map></edit-map>
```

  </div>
  <div>

<edit-map></edit-map>

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

<edit-map name="HTML"></edit-map>

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
<edit-map name="lit-html"></edit-map>

  </div>
</section>
