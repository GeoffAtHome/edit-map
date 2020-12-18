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

import { LitElement, html, customElement, property, css, PropertyValues, internalProperty } from 'lit-element';
import load from './maploader'


let map: google.maps.Map;
/**
 * Interface onto the Google Maps API
 *
 */
@customElement('edit-map')
export class EditMap extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    #mapid {
      height: 100%;
    }
  `;

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
   * Polygon to edit
   * pc: string - index to polygon
   * state: boolean 
   * - true to edit
   * - false stop editing and fire modified polygon
   */
  @property({ type: Object })
  editPolygon: { pc: string; state: boolean } = { pc: '', state: false }

  /**
   * The polygons that have been drawn on the map so that these can be modified.
   */
  @internalProperty()
  private polygonsOnMap: PolygonsOnMap = {}

  render() {
    return html`
      <div id="mapid"></div>
    `;
  }

  protected firstUpdated() {
    this.addEventListener('MapsLoaded', e => this.initMap(e))
    load(this)
  }

  updated(changedProperties: PropertyValues) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${String(propName)} changed. oldValue: ${oldValue}`);
    });
    this.shadowRoot!.getElementById('b')?.focus();
    if (changedProperties.has('editPolygon')) {
      this.setPolygonEditMode(this.editPolygon)
    }

  }

  setPolygonEditMode(editPolygon: { pc: string; state: boolean }) {
    const polygon = this.polygonsOnMap[editPolygon.pc]
    if (polygon !== undefined) {
      polygon.setEditable(editPolygon.state)
      if (!editPolygon.state) {
        this.fireModifiedPolygon(editPolygon.pc)
      }
    }
  }

  /**
   * modified polygon event.
   *
   * @event edit-map#modifiedPolygon
   * @type {object}
   * @property {string} pc - id of polygon
   * @property {Polygon} path - polygon path
   */
  fireModifiedPolygon(pc: string) {
    const polygon = this.polygonsOnMap[pc]

    if (polygon !== undefined) {
      const event = new CustomEvent<{ pc: string; path: Polygon }>('modifiedPolygon', {
        detail: {
          pc: pc,
          path: getPathGooglePolygon(polygon)
        }
      })
      this.dispatchEvent(event)
    }
  }

  initMap(_e: Event): boolean {
    const mid = this.renderRoot.querySelector('#mapid')
    if (mid) {
      map = new google.maps.Map(
        mid, this.options
      );
    }
    if (this.polygonData) {
      for (const [pc, item] of Object.entries(this.polygonData)) {
        const options = item.options
        options.paths = getPath(item.paths)
        const newPolygon = new google.maps.Polygon(options)
        this.polygonsOnMap[pc] = newPolygon

        google.maps.event.addListener(newPolygon, "dblclick", (event) => { this.removeVertex(event, newPolygon) })
        google.maps.event.addListener(newPolygon, "click", (_event) => { this.clickedPolygon(pc, newPolygon) })
        newPolygon.setMap(map);
        this.setPolygonEditMode({ pc: pc, state: false })

      }
    }
    return true
  }

  removeVertex(event: { vertex: number | undefined }, polygon: google.maps.Polygon) {
    if (event.vertex !== undefined) {
      const path = polygon.getPath();
      path.removeAt(event.vertex);
    }
  }

  clickedPolygon(pc: string, polygon: google.maps.Polygon) {
    if (!polygon.getEditable()) {
      const event = new CustomEvent('clickedPolygon', {
        detail: pc
      })
      this.dispatchEvent(event)
    }
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


function getPathGooglePolygon(polygon: google.maps.Polygon): Polygon {
  const paths = polygon.getPaths().getArray()
  if (paths.length === 1) {
    const path = paths[0].getArray()
    return {
      type: 'Polygon',
      coordinates: [path.map((p) => [p.lng(), p.lat()])]
    }
  } else {
    console.log('Path has more than one polygon')
  }

  const p: Polygon = {
    type: 'Polygon',
    coordinates: []
  }
  return p
}
