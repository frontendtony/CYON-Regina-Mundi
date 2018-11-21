/* global $ */

$('.menu .item').tab();
$('select.dropdown').dropdown();

$('.ui.form').on('click', 'button', function(event){
    event.preventDefault();
    if(this.textContent === "Cancel"){
        this.parentNode.remove();
    } else {
        $(this).addClass('loading');
        let id = $(this).parent().parent().find('select').val();
        let pos = $(this).parent().parent().find('select').attr('name');
        let url = `/apis/updatePosition/${id}/${pos}`;
        console.log(url);
        $.getJSON(url)
        .then(data => {
            if(data.status){
                $('<div class="ui positive message container"><i class="close icon"></i>Position Updated</div>').insertAfter('nav');
                $('.ui.positive.message.container').fadeOut(3000);
                $('#button-div').remove();
            }
        })
    }
    
})

$('select').on('change',function(event){
    event.preventDefault();
    $('#button-div').remove();
    let buttons = $("<div id='button-div' class='five wide column'><button class='ui positive button'>Save</button><button class='ui negative button'>Cancel</button></div>");
    buttons.insertAfter(this.parentNode.parentNode);
    
})