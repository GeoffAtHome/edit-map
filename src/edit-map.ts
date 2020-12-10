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


let map: google.maps.Map;
/**
 * Interface onto the Google Maps API
 *
 * @apikey - This element has a slot
 * @csspart button - The button
 */
@customElement('edit-map')
export class EditMap extends LitElement {
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
   * The Google Maps API key
   */
  @property({ type: String })
  apikey = '';

  /**
   * The Google map options
   */
  @property({ type: Object })
  options = {};

  /**
   * The polygons to draw.
   * Each polygon has a key, path and options
   */
  @property({ type: Object })
  polygonData: PolygonData | undefined

  /**
   * The polygons that have been drawn on the map so that these can be modified.
   */
  polygonsOnMap: PolygonsOnMap = {}

  render() {
    return html`
      <div id="mapid"></div>
    `;
  }

  protected firstUpdated() {
    this.addEventListener('MapsLoaded', e => this.initMap(e))
    load(this.apikey, this)
  }

  initMap(e: Event): boolean {
    console.log('Loaded:', e)
    const mid = this.renderRoot.querySelector('#mapid')
    if (mid) {
      map = new google.maps.Map(
        mid, this.options
      );
    }
    if (this.polygonData) {
      for (const [postcode, item] of Object.entries(this.polygonData)) {
        const options = item.options
        options.paths = getPath(item.paths)
        const newPolygon = new google.maps.Polygon(options)
        this.polygonsOnMap[postcode] = newPolygon

        google.maps.event.addListener(newPolygon, "dblclick", function (event) {
          if (event.vertex !== undefined) {
            const path = newPolygon.getPath();
            path.removeAt(event.vertex);
          }
        });
        newPolygon.setMap(map);
      }
    }


    return true
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'edit-map': EditMap;
  }
}

interface Polygon {
  coordinates: Array<Array<[number, number]>>;
  type: string;
}

export interface PolygonDataItem {
  paths: Polygon;
  options: google.maps.PolygonOptions;
}

interface PolygonData {
  [index: string]: PolygonDataItem;
}

interface PolygonsOnMap {
  [index: string]: google.maps.Polygon;
}


function getPath(polygon: Polygon) {
  return polygon.coordinates[0].map(pair => { return { lat: pair[1], lng: pair[0] } })
}

