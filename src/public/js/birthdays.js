/* global $ */

$('select').on('change', () => {
  $(".loader").removeClass("disabled").addClass("active");
  let month = $('select').val();
  $.getJSON(`/api/birthdays/${month}`).done(data => {
    data.sort((a,b) => a.firstname - b.firstname);
    $('tbody').empty();
    data.forEach((elem) => {
      $('tbody').append(
        `<tr>
          <td>${elem.firstname} ${elem.lastname}</td>
          <td>${elem.gender}</td>
          <td>${elem.dateOfBirth.substring(8,10)}</td>
          <td>${elem.phone}</td>
          <td class="lowercase">${elem.email}</td>
        </tr>`
      )
    })
    $(".loader").removeClass("active").addClass("disabled");
  })
})