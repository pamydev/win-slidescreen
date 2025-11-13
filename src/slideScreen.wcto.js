import {
 Constructos
} from "winnetoujs/core/constructos";
export class $slideContainer extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {object} [options]
  * @param {string} [options.identifier]
  */
 constructor (elements, options) {
  super();
  /**@protected */
  this.identifier = this._getIdentifier(options ?
   options.identifier || "notSet" : "notSet");
  const digestedPropsToString = this
   ._mutableToString(elements);
  /**@protected */
  this.component = this.code(
   digestedPropsToString);
  this._saveUsingMutable(
   `slideContainer-win-${this.identifier}`,
   elements, options, $slideContainer);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <div class="slideContainer" id="slideContainer-win-${this.identifier}"></div>
`;
 }
 /**
  * Create Winnetou Constructo
  * @param  {object|string} output The node or list of nodes where the component will be created
  * @param  {object} [options] Options to control how the construct is inserted. Optional.
  * @param  {boolean} [options.clear] Clean the node before inserting the construct
  * @param  {boolean} [options.reverse] Place the construct in front of other constructs
  */
 create (output, options) {
  this.attachToDOM(this.component, output,
   options);
  return {
   ids: {
    slideContainer: `slideContainer-win-${this.identifier}`,
   },
  };
 }
 /**
  * Get the constructo as a string
  * @returns {string} The component HTML string
  */
 constructoString () {
  return this.component;
 }
}
export class $screen extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {object} [options]
  * @param {string} [options.identifier]
  */
 constructor (elements, options) {
  super();
  /**@protected */
  this.identifier = this._getIdentifier(options ?
   options.identifier || "notSet" : "notSet");
  const digestedPropsToString = this
   ._mutableToString(elements);
  /**@protected */
  this.component = this.code(
   digestedPropsToString);
  this._saveUsingMutable(
   `screen-win-${this.identifier}`, elements,
   options, $screen);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <div class="screen" id="screen-win-${this.identifier}" style="min-height: 1px">
    <div id="content-win-${this.identifier}" class="screenContent"></div>
  </div>
`;
 }
 /**
  * Create Winnetou Constructo
  * @param  {object|string} output The node or list of nodes where the component will be created
  * @param  {object} [options] Options to control how the construct is inserted. Optional.
  * @param  {boolean} [options.clear] Clean the node before inserting the construct
  * @param  {boolean} [options.reverse] Place the construct in front of other constructs
  */
 create (output, options) {
  this.attachToDOM(this.component, output,
   options);
  return {
   ids: {
    screen: `screen-win-${this.identifier}`,
    content: `content-win-${this.identifier}`,
   },
  };
 }
 /**
  * Get the constructo as a string
  * @returns {string} The component HTML string
  */
 constructoString () {
  return this.component;
 }
}
