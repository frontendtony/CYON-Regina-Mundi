/* global $*/

const close = $('.close.icon');

close.on('click', () => {
  close.parent().remove();
});

$('select.dropdown')
  .dropdown()
;

$('.ui.radio.checkbox')
  .checkbox()
;