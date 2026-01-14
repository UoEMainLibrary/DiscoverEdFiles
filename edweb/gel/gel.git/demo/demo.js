function htmlEntities(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function load_complete() {
  $('body').addClass('s_0');
  $('.fullpage').addClass('show');

  $('.navbar').wrapInner('<ul></ul>');
  $('.sectionTitle').wrapInner('<li><a href="#"></a></li>');
  $('.navbar li').unwrap();

  $('.navbar li:first').addClass('active');
  var s_title = $('.navbar li.active').text();
  $('.sidenav > .section > h2').html(s_title);

  $('.navbar li').each(function(index) {
    $('a', this).on('click', function(e) {
      e.preventDefault();
      $('.navbar li').removeClass('active');
      $(this).parent().addClass('active');
      var s_title = $('.navbar li.active').text();
      $('.sidenav > .section > h2').html(s_title);

      $('body').removeClass('s_0 s_1 s_2 s_3 s_4 s_5 s_6 s_7 s_8 s_9 s_10 s_11 s_12 s_13 s_14 s_15 s_16 s_17 s_18 s_19 s_20 s_21');
      $('body').addClass('s_' + index);

      $('.sidenav .pages .p_' + index + ' > li:first > .title a').trigger('click');
    });
  });
}

function subnav_complete() {
  $('.sidenav .pages > ul').each(function(index) {
    $(this).addClass('p_' + index);
  });

  $('.sidenav .pages > ul > li > .title').each(function() {
    $(this).wrapInner('<a href="#"></a>');
    $('a', this).on('click', function(e) {
      e.preventDefault();
      $('.sidenav .pages > ul > li').removeClass('active');
      $(this).parent().parent().addClass('active');

      $(this).populate_page();
    });
  });

  $('.sidenav .pages > ul > li:first').addClass('active');
  $('.sidenav .pages > ul > li:first > .title a').populate_page();
}

function nav() {
  $('.navbar').load('src.htm #sections > li > .sectionTitle', null, load_complete);
  $('.sidenav .pages').load('src.htm #sections > li > ul', null, subnav_complete);
}

$.fn.populate_page = function() {
  var s_title = $('.navbar li.active').text();
  var c_title = $(this).text();
  var c_desc = $(this).parent().parent().find('.desc').html();
  var c_demo = $(this).parent().parent().find('.demo').html();
  if ($(this).parent().parent().find('.snippet').length == 0) {
    var c_snippet = htmlEntities(c_demo);
    var c_snippet = '<pre>' + c_snippet + '</pre>';
    var c_demo = '<div class="container content" style="padding-top: 3em;">'
        + c_demo + '</div>';
  }
  else {
    var c_snippet = $(this).parent().parent().find('.snippet').html();
  }
  $('.main .breadcrumb + h2').html(c_title);
  $('.main .breadcrumb + h2 + p').html(c_desc);
  $('.main .snippet').html(c_snippet);
  $('.main .breadcrumb .sectionTitle').html(s_title);

  function validateURL(textval) {
    var urlregex = new RegExp("^(http:|https:)");
    return urlregex.test(textval);
  }
  var c_url = validateURL(c_demo);

  if (c_url == true) {
    $('body').addClass('externalURL');

    $('.previews2 iframe').attr("src", "demo.htm");
    $('.modal2 iframe').attr("src", "demo.htm");
    $('.previews2 iframe').animate({opacity: 0}, 100, function() {
      $('.previews2 iframe').animate({opacity: 1}, 250, function() {
        $('.previews2 iframe').attr("src", c_demo);
        $('.modal2 iframe').attr("src", c_demo).load(function() {
          $(this).each(function(i) {
            console.log($(this)[i].contentWindow);
            $(this)[i].contentWindow.picturefill();
          });
          alert("LOAdED and picturefilled");
        });
      });
    });
  }
  else {
    $('body').removeClass('externalURL');
    $('.previews1 iframe').contents().find('#insert').html(c_demo);
    $('.modal1 iframe').contents().find('#insert').html(c_demo);
  }

  $('body').removeClass('notFullPage');
  $('.fullpage').empty();

  var c_fullpage = $(this).parent().parent().find('.textpage').html();

  $('.fullpage').html(c_fullpage);

  if ($(this).parent().parent().find('.textpage').length == 0) {
    $('body').addClass('notFullPage');
  }

};

// Prepare the preview areas.
function previews() {
  var a = $(window).width() - 291;
  var b = 1184 / a;
  var c = 1 / b;
  var b2 = 2368 / a;
  var c2 = 1 / b2;
  
  // Prepare the previews of code snippets.
  $('.previews1 > div').each(function() {
    var d = $(this).width();
    var e = d * c;
    $(this).css({
      'width' : e
    });
    $('iframe', this).css({
      'transform' : 'scale(' + c2 + ')'
    });

    $(this).on('click', function() {
      var cl = $(this).attr('class');
      $('.modal1').addClass(cl).on('click', function() {
        $('.modal1').removeClass('p_01 p_02 p_03');
      });
      $('.modal1 .close').on('click', function() {
        $('.modal1').removeClass('p_01 p_02 p_03');
      });
    });
  });

  // Prepare the previews of external page sources.
  $('.previews2 > div').each(function() {
    var d = $(this).width();
    var e = d * c;
    $(this).css({
      'width' : e
    });
    $('iframe', this).css({
      'transform' : 'scale(' + c2 + ')'
    });

    $(this).on('click', function() {
      var cl = $(this).attr('class');
      $('.modal2').addClass(cl).on('click', function() {
        $('.modal2').removeClass('p_01 p_02 p_03');
      });
      $('.modal2 .close').on('click', function() {
        $('.modal2').removeClass('p_01 p_02 p_03');
      });
    });

  });
}

function snippets() {
  $('.block').each(function() {
    // $('iframe',this).contents().find('head').append(head);
    var snippet = $('.snippet', this).html();
    $('iframe', this).contents().find('body').html(snippet);
    var frameHeight = $('iframe', this).contents().find('body').height() + 100;
    $('iframe', this).css({
      'min-height' : frameHeight
    });
  });
}


$(document).ready(function() {
  previews();
  nav();
});
