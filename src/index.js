/**
 * This is the entry file of the Direflow setup.
 *
 * You can add any additional functionality here.
 * For example, this is a good place to hook into your
 * Web Component once it's mounted on the DOM.
 *
 * !This file cannot be removed.
 * It can be left blank if not needed.
 */
import RiveComponent from './direflow-components/rive-component';

const script = document.createElement("script")
script.src = "https://unpkg.com/rive-canvas@0.6.5/rive.js";
document.head.appendChild(script);

RiveComponent.then((element) => {

  /**
   * Access DOM node when it's mounted
   */
  console.log('rive-component is mounted on the DOM', element);
});
