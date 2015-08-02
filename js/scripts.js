$('.tarot-cards li').each(function(index){
	$(this).children('img').attr('src', 'img/'+index+'.jpg');

  $(this).on('click', function() {
    $('li').removeClass('show');
    $(this).addClass('show');
  })

  $('h2').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $('li').removeClass('show')
  })

  $('td').on('click', function() {
    $('table').removeClass('selected');
    $('td p').removeClass('selected');
    $(this).children('p').toggleClass('selected');
    $(this).parents('table').addClass('selected');
  })
})