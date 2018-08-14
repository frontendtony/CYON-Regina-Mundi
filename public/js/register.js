$('.ui.form.register')
  .form({
    fields: {
      firstname: {
        identifier: 'firstname',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your first name'
          },
          {
            type   : 'minLength[2]',
            prompt : 'Your first name must have at least 2 characters'
          }
        ]
      },
      middlename: {
        identifier: 'middlename',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your middle name'
          },
          {
            type   : 'minLength[2]',
            prompt : 'Your middle name must have at least 2 characters'
          },
          {
            type   : 'different[firstname]',
            prompt : 'Your middle name should be different from your first name'
          },
          {
            type   : 'different[lastname]',
            prompt : 'Your middle name should be different from your last name'
          }
        ]
      },
      lastname: {
        identifier: 'lastname',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter your last name'
          },
          {
            type   : 'minLength[2]',
            prompt : 'Your last name must have at least 2 characters'
          },
          {
            type   : 'different[firstname]',
            prompt : 'Your last name should be different from your first name'
          }
        ]
      },
      gender: {
        identifier: 'gender',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select a gender'
          }
        ]
      },
      relationshipStatus: {
        identifier: 'relationshipStatus',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select your relationship status'
          }
        ]
      },
      date: {
        identifier: 'date',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select a date'
          }
        ]
      },
      month: {
        identifier: 'month',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select a month'
          }
        ]
      },
      year: {
        identifier: 'year',
        rules: [
          {
            type   : 'exactLength[4]',
            prompt : 'Please enter a 4-digit year'
          }
        ]
      },
      email: {
        identifier: 'email',
        rules: [
          {
            type   : 'email',
            prompt : 'Invalid email address'
          },
          {
            type   : 'empty',
            prompt : 'Please enter an email address'
          }
        ]
      },
      phone: {
        identifier: 'phone',
        rules: [
          {
            type   : 'exactLength[11]',
            prompt : 'Phone number must be 11 digits long'
          },
          {
            type   : 'empty',
            prompt : 'Please provide a phone number'
          }
        ]
      },
      
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
      },
      
    }
  })
;

$('select.dropdown')
  .dropdown()
;