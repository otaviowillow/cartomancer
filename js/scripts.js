$('.tarot-cards li').each(function(index){
	$(this).children('img').attr('src', 'img/'+index+'.jpg');

  /* open tarot card */
  $(this).on('click', function() {
      $('body').css('overflow', 'hidden');
      $('li').removeClass('show');
      $(this).addClass('show');
  })

  /* close tarot card */
  $('h2').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $('body').css('overflow', 'auto');
    $('li').removeClass('show');
  })

  /* handle tables td */
  $('td').on('click', function() {
    $('table').removeClass('selected');
    $('td p').removeClass('selected');
    $(this).children('p').toggleClass('selected');
    $(this).parents('table').addClass('selected');
  })

  /* LInk Handler */
  $('a').on('click', function(e) {
    var effectType = $(this).attr('rel');
    var effectName = $(this).attr('href');

    e.preventDefault();
    $('ul.'+ effectType +' .'+ effectName +'').addClass('selected');  
  })

  /* flip handler */
  $('ul li button').on('click', function() {
    $(this).parent().addClass('flip');
    $(this).parent().siblings().removeClass('flip');
  })

  /* close effect */
  $('ul li h3').on('click', function() {
    $(this).parents('li').removeClass('selected');
  })
})

