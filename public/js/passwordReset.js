/* global $ */

$('.ui.form.login')
  .form({
    fields: {
      email: {
        identifier: 'email',
        rules: [
          {
            type   : 'email',
            prompt : 'Please enter a valid email'
          },
          {
            type   : 'empty',
            prompt : 'Email cannot be empty'
          }
        ]
      }
    }
  })
;