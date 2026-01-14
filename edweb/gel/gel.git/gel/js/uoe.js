(function ($) {

// Once Images etc are loaded
$(window).load(function() {
  // Activate responsive left navigation panel
  $('.block-uoe-menu > .uoe-nav-trigger').prepend('<span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span><span class="sr-only">Toggle navigation menu</span> ');
  $('.block-uoe-menu > .uoe-nav-trigger').on('click', function() {
    $('.block-uoe-menu > .uoe-nav-trigger > span.glyphicon').toggleClass('open');
    $('.block-uoe-menu > .uoe-left-nav').toggleClass('open');
  });

  // Hide search form for small devices
  $('.jumbotron .brand').append('<span class="glyphicon glyphicon-search uoe-search-trigger" aria-hidden="true"></span><span class="sr-only">Show/hide site search</span> ');
  $('.uoe-search-trigger').on('click', function() {
    $('.jumbotron .form-search').slideToggle('400', function() {
    });
  });
});

$(window).ready(function() {
  // Undo the carousel animation blocking by bootstrap accessibility plugin.
  $('.carousel').attr({'data-interval': 5000, 'data-wrap': true, 'data-pause': 'hover'});
});

})(jQuery);
