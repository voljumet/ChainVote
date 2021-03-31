$(function () {

  // MENU
  $('.nav-link').on('click', function () {
    $('.navbar-collapse').collapse('hide');
  });

  // AOS ANIMATION
  AOS.init({
    disable: 'mobile',
    duration: 800,
    anchorPlacement: 'center-bottom',
  });

  // SMOOTH SCROLL
  $(function () {
    $('.nav-link').on('click', function (event) {
      var $anchor = $(this);
      $('html, body')
        .stop()
        .animate(
          {
            scrollTop: $($anchor.attr('href')).offset().top - 0,
          },
          1000
        );
      event.preventDefault();
    });
  });

  // PROJECT SLIDE
  $('#project-slide').owlCarousel({
    loop: true,
    center: true,
    autoplayHoverPause: false,
    autoplay: true,
    margin: 30,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
    },
  });

  
  

});



 $('#StartDate, #EndDate').datepicker();

 $('#EndDate').change(function () {
   var startDate = document.getElementById('StartDate').value;
   var endDate = document.getElementById('EndDate').value;

   if (Date.parse(endDate) <= Date.parse(startDate)) {
     alert('End date should be greater than Start date');
     document.getElementById('EndDate').value = '';
   }
 });