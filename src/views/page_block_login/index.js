const LoginForm = require('../../models/LoginForm.js');
const displayErrorsUtils = require('../_form_utils/displayErrors.js');
const UserModel = require('../../models/UserModel.js');

function init(serviceLocator) {
    const loginForm = document.getElementById('login-form');

    displayErrorsUtils.initForm(loginForm);

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // const serverErrorField = loginForm.getElementById('login-form__server-errors');
        const model = new LoginForm(serviceLocator);
        model.login = loginForm.elements['login'].value;
        model.password = loginForm.elements['password'].value;

        const validationResult = model.validate();
        if (validationResult.ok === true) {
            model.send()
                .then((res) => res.json())
                .then((json) => json.message)
                .then((json) => {
                    console.log(json);
                    serviceLocator.user = UserModel.fromApiJson(json);
                    serviceLocator.user.saveInLocalStorage();
                    serviceLocator.eventBus.emitEvent("auth", serviceLocator.user);
                })
                .catch((res) => console.error(res));
            // TODO: сделать норм ответ
        } else {
            displayErrorsUtils.displayErrors(loginForm, validationResult.errors);
        }
    });
}

module.exports = init;
