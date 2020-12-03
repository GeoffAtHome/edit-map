---
layout: page.11ty.cjs
title: <edit-map> ⌲ Install
---

# Install

`<edit-map>` is distributed on npm, so you can install it locally or use it via npm CDNs like unpkg.com.

## Local Installation

```bash
npm i edit-map
```

## CDN

npm CDNs like [unpkg.com]() can directly serve files that have been published to npm. This works great for standard JavaScript modules that the browser can load natively.

For this element to work from unpkg.com specifically, you need to include the `?module` query parameter, which tells unpkg.com to rewrite "bare" module specificers to full URLs.

### HTML
```html
<script type="module" src="https://unpkg.com/edit-map?module"></script>
```

### JavaScript
```html
import {EditMap} from 'https://unpkg.com/edit-map?module';
```
