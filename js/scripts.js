$('.tarot-cards li').each(function(index){
	$(this).css('background-image', 'url(img/'+index+'.jpg)');

  $(this).on('click', function() {
    $(this).addClass('show')
  })

  $('h2').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $('li').removeClass('show')
  })

  $('td').on('click', function() {
    $('td p').removeClass('selected');
    $(this).children('p').addClass('selected');
    $(this).parents('table').addClass('selected');
  })
})