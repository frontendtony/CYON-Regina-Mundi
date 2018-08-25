/* global $ */

$('.ui.form.login')
  .form({
    fields: {
      password: {
        identifier: 'password',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a password'
          },
          {
            type   : 'minLength[6]',
            prompt : 'Your password must be at least {ruleValue} characters'
          }
        ]
      },
      confirmPassword: {
        identifier: 'confirmPassword',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please re-enter password'
          },
          {
            type   : 'match[password]',
            prompt : 'The passwords do not match'
          }
        ]
      }
    }
  })
;