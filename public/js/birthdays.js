/* global $ */

$('select').on('change', (event) => {
    $(".loader").removeClass("disabled").addClass("active");
    let month = $('select').val();
    $.getJSON('/apis/birthdays/' + month)
    .then(data => {
        data.sort((a,b) => a.firstname - b.firstname);
        $('tbody').empty();
        data.forEach((elem, index, array) => {
            $('tbody').append(
                `<tr><td>${elem.firstname} ${elem.lastname}</td><td>${elem.gender}</td><td>${elem.dateOfBirth.substring(8,10)}</td><td>${elem.phone}</td><td>${elem.email}</td></tr>`
            )
        })
        $(".loader").removeClass("active").addClass("disabled");
        
    })
})