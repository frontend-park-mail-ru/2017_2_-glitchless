/**
 * Registers necessary listeners on form.
 *
 * @param form {Node} DOM node of form
 */
function initForm(form) {
    for (let i = 0; i < form.elements.length; i++) {
        const node = form.elements.item(i);
        node.oninput = (event) => {
            event.target.setCustomValidity(''); 
        };
    }
}

/**
 * Shows server response-related errors on form.
 *
 * @param errorField {Node} DOM node of error field
 * @param error {Array} String, containing error description
 */
function displayServerError(errorField, error) {
    errorField.innerText = error;
    errorField.style.visibility = 'visible';
}

/**
 * Shows client-side/input-related errors on form.
 *
 * Spec of error object:
 * {
 *   field: {String}
 *   message: {String}
 * }
 *
 * @param form {Node} DOM node of form
 * @param errors {Array} Array of error objects
 */
function displayErrors(form, errors) {
    errors.forEach((error) => {
        form.elements[error.field].setCustomValidity(error.message);
    });
}

module.exports = {
    initForm,
    displayErrors,
    displayServerError
};