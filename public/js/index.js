const close = $('.close.icon');

close.on('click', (event) => {
    close.parent().remove();
})