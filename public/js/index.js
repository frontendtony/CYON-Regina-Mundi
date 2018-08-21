const close = $('.close.icon');

close.on('click', (event) => {
    close.parent().remove();
})

$('select.dropdown')
  .dropdown()
;

$('.ui.radio.checkbox')
  .checkbox()
;