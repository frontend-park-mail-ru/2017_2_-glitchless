const SignupForm = require('../../models/SignupForm.js');
const displayErrorsUtils = require('../_form_utils/displayErrors.js');
const UserModel = require('../../models/UserModel.js');

function init(serviceLocator) {
    const signupForm = document.getElementById('signup-form');

    displayErrorsUtils.initForm(signupForm);

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const model = new SignupForm(serviceLocator);
        model.login = signupForm.elements['login'].value;
        model.email = signupForm.elements['email'].value;
        model.password = signupForm.elements['password'].value;
        model.passwordConfirmation = signupForm.elements['passwordConfirmation'].value;

        const validationResult = model.validate();
        if (validationResult.ok === true) {
            model.send()
                .then((res) => res.json())
                .then((json) => json.message)
                .then((json) => {
                    console.log(json);
                    serviceLocator.user = UserModel.fromApiJson(json);
                    serviceLocator.user.saveInLocalStorage();
                    serviceLocator.router.changePage('');
                    serviceLocator.eventBus.emitEvent("auth", serviceLocator.user);
                })
                .catch((res) => console.error(res));
            // TODO: сделать норм ответ
        } else {
            displayErrorsUtils.displayErrors(signupForm, validationResult.errors);
        }
    });
}

module.exports = init;
