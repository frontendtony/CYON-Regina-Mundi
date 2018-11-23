/* global $, window */

$('.button').on('click', (e) => {
  const id = e.target.dataset.id;
  const path = e.target.id === 'admin' ? 'setadmin' : 'confirmuser';
  const url = `/api/${path}/${id}`;

  $.ajax({ url, method: 'PUT' })
    .done((data) => {
      if (data.status) {
        $(`<div class="ui positive message container">
            <i class="close icon"></i>
            Profile updated successfully
          </div>`).insertAfter('nav');
        $('.ui.positive.message.container').fadeOut(3000);
        window.setTimeout(() => window.location.reload(), 3000);
      }
    })
})