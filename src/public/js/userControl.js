/* global $ */

$('.menu .item').tab();
$('select.dropdown').dropdown();

$('.ui.form').on('click', 'button', (event) => {
  event.preventDefault();
  const elem = event.target;
  if (elem.textContent === "Cancel") {
    elem.parentNode.remove();
  } else {
    $(elem).addClass('loading');
    let id = $(elem).parent().parent().find('select').val();
    let pos = $(elem).parent().parent().find('select').attr('name');
    let url = '/apis/updatePosition/' + String(id) + '/' + String(pos);
    $.getJSON(url).then(data => {
      if (data.status) {
        $(`<div class="ui positive message container">
          <i class="close icon"></i>
          Position Updated
        </div>`).insertAfter('nav');
        $('.ui.positive.message.container').fadeOut(3000);
        $('#button-div').remove();
      }
    });
  }
});

$('select').on('change', (event) => {
  const elem = event.target;
  event.preventDefault();
  $('#button-div').remove();
  let buttons = $(`<div id='button-div' class='five wide column'>
    <button class='ui positive button'>Save</button>
    <button class='ui negative button'>Cancel</button>
  </div>`);
  buttons.insertAfter(elem.parentNode.parentNode);
});