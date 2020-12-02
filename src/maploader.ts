/**
 * @param apiKey    API Key, or object with the URL parameters. For example
 *                  to use Google Maps Premium API, pass
 *                    `{ client: <YOUR-CLIENT-ID> }`.
 *                  You may pass the libraries and/or version (as `v`) parameter into
 *                  this parameter and skip the next two parameters
 * @param version   Google Maps version
 * @param libraries Libraries to load (@see
 *                  https://developers.google.com/maps/documentation/javascript/libraries)
 * @param loadCn    Boolean. If set to true, the map will be loaded from google maps China
 *                  (@see https://developers.google.com/maps/documentation/javascript/basics#GoogleMapsChina)
 *
 * Example:
 * ```
 *      import {load} from 'vue-google-maps'
 *
 *      load(<YOUR-API-KEY>)
 *
 *      load({
 *              key: <YOUR-API-KEY>,
 *      })
 *
 *      load({
 *              client: <YOUR-CLIENT-ID>,
 *              channel: <YOUR CHANNEL>
 *      })
 * ```
 */

import { elementUpdated } from "@open-wc/testing"

let googleMapsApiLoaded = false

export default (() => {
    let isApiSetUp = false

    return (apikey: string, element: Element) => {
        if (typeof document === 'undefined') {
            // Do nothing if run from server-side
            return
        }

        if (!isApiSetUp) {
            isApiSetUp = true

            window.mapApiIsLoaded = mapApiIsLoaded

            const googleMapScript = document.createElement('SCRIPT')
            const url = `https://maps.googleapis.com/maps/api/js?key=${apikey}&callback=mapApiIsLoaded&libraries=drawing&v=weekly`
            googleMapScript.setAttribute('src', url)
            googleMapScript.setAttribute('async', '')
            googleMapScript.setAttribute('defer', '')
            document.head.appendChild(googleMapScript)
            waitForMapsToLoaded(element)
        } else {
            waitForMapsToLoaded(element)
            throw new Error('You already started the loading of google maps')
        }
    }
})()

declare global {
    interface Window {
        mapApiIsLoaded: Function;
    }
}

function mapApiIsLoaded() {
    googleMapsApiLoaded = true
    console.log('Maps loaded')
}

function waitFor(conditionFunction: () => unknown) {

    const poll = (resolve: () => void) => {
        if (conditionFunction()) resolve();
        else setTimeout((_: unknown) => poll(resolve), 400);
    }

    return new Promise(poll);
}

function isGoogleMapsApiLoaded(): boolean {
    return googleMapsApiLoaded === true
}

async function waitForMapsToLoaded(element: Element) {
    await waitFor(isGoogleMapsApiLoaded);
    console.log('the wait is over!');
    const event = new CustomEvent('MapsLoaded')
    if (element) {
        element.dispatchEvent(event)
    }
}