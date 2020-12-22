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

import { LitElement, html, customElement, property, css, PropertyValues, internalProperty, query, TemplateResult } from 'lit-element';
import load from './maploader'


let map: google.maps.Map;
/**
 * Interface onto the Google Maps API
 *
 * @fires modifiedPolygon -  Dispatched when editing selected polygon has finished.
 * @fires clickedPolygon -  Dispatched when a polygon has been 'clicked'
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

    #popup {
      display: none;
      position:absolute;
      background-color: blue;
      border-radius: 5px;
      box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
      padding: 10px;
    }

        #popup[data-active] {
      display: block;
      background-color: pink;
    }
  `;

  @query('#popup')
  private popup: HTMLElement | undefined

  /**
    * The Google map options
    * @type { google.maps.MapOptions }
    */
  @property({ attribute: true, type: Object })
  public options: google.maps.MapOptions = {};

  /**
   * The polygons to draw.
   * Each polygon has a key, path and options
   */
  @property({ type: Object })
  public polygonData: PolygonData | undefined

  /**
   * Polygon to edit
   * 
   * @type: {pc: string; state: boolean }
   */
  @property({ type: Object })
  public editPolygon: { pc: string; state: boolean } = { pc: '', state: false }

  /**
   * ShowPopup: show or hide
   */
  @internalProperty()
  private showPopup = ''

  /**
   * popupText: HTML to display
   */
  @internalProperty()
  private popupText: TemplateResult = html``

  /**
   * The polygons that have been drawn on the map so that these can be modified.
   */
  @internalProperty()
  private polygonsOnMap: PolygonsOnMap = {}

  render() {
    return html`
      <div id="mapid"></div>
      <span id="popup" data-active="${this.showPopup === 'show'}">${this.popupText}</span>
    `;
  }

  protected firstUpdated() {
    this.addEventListener('MapsLoaded', e => this.initMap(e))
    load(this)
  }

  updated(changedProperties: PropertyValues) {
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
        google.maps.event.addListener(newPolygon, "mouseover", (event) => { this.mouseoverPolygon(event.domEvent, pc) })
        google.maps.event.addListener(newPolygon, "mouseout", (_event) => { this.mouseoutPolygon() })
        newPolygon.setMap(map);
        this.setPolygonEditMode({ pc: pc, state: false })
      }
    }
    return true
  }

  mouseoverPolygon(event: MouseEvent, text: string) {
    if (this.popup) {
      this.showPopup = 'show'
      this.popupText = html`<h2>Hello</h2>${text}`
      this.popup.style.left = event.pageX.toString() + 'px'
      this.popup.style.top = event.pageY.toString() + 'px'
      console.log(this.popup.style.left)
    }
  }

  mouseoutPolygon() {
    this.showPopup = 'hide'
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
