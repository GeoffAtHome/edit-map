/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import { LitElement, html, customElement, property, css } from 'lit-element';
import load from './maploader'
const defaultApiKey = 'AIzaSyAgV7gRtp8kIpEb17-ukuHMw7lte494nw8'
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }

    #mapid {
      height: 400px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0;

  @property({ type: String })
  apikey = '';


  render() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <button @click=${this._onClick} part="button">
        Click XCount: ${this.count}
      </button>
      <slot></slot>
      <div id="mapid"></div>
    `;
  }

  protected firstUpdated() {
    if (this.apikey === '') {
      this.apikey = defaultApiKey
    }
    this.addEventListener('MapsLoaded', e => this.initMap(e))
    load(this.apikey, this)
  }

  initMap(e: Event): boolean {
    console.log('Loaded:', e)
    const mid = this.renderRoot.querySelector('#mapid')
    if (mid) {
      const map = new google.maps.Map(
        mid,
        {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
        }
      );
    }

    return true
  }

  private _onClick() {
    this.count++;
  }

  foo(): string {
    return 'foo';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}


