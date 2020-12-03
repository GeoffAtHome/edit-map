import {EditMap} from '../edit-map.js';
import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('edit-map', () => {
  test('is defined', () => {
    const el = document.createElement('edit-map');
    assert.instanceOf(el, EditMap);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<edit-map></edit-map>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('renders with a set name', async () => {
    const el = await fixture(html`<edit-map name="Test"></edit-map>`);
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, Test!</h1>
      <button part="button">Click Count: 0</button>
      <slot></slot>
    `
    );
  });

  test('handles a click', async () => {
    const el = (await fixture(html`<edit-map></edit-map>`)) as EditMap;
    const button = el.shadowRoot!.querySelector('button')!;
    button.click();
    await el.updateComplete;
    assert.shadowDom.equal(
      el,
      `
      <h1>Hello, World!</h1>
      <button part="button">Click Count: 1</button>
      <slot></slot>
    `
    );
  });
});
