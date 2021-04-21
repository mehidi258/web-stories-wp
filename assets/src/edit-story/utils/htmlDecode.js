/**
 * Decode html entities.
 *
 * @param {string} input Input
 *
 * @returns {string|string}
 */
function htmlDecode( input ) {
  const textArea = document.createElement( 'textarea' );
  textArea.innerHTML = input;

  return textArea.childNodes.length === 0 ? '' : textArea.childNodes[ 0 ].nodeValue;
}

export default htmlDecode;
