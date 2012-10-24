(function() {

  document.observe("dom:loaded", function() {
    var product_test;
    product_test = new TurnAround({
      divId: "vboard",
      imageName: "images/v-board_liggend_12FPS_CCW/V-bord-liggend",
      imageCount: 87,
      imageType: "png",
      imageDelimiter: "_",
      frameSpeed: 2,
      startFrame: 43
    });
    product_test.annotateFrame(43, {
      el: "vboard",
      body: "qsdfqsfd",
      x: 330,
      y: 250
    });
    product_test.annotateFrame(86, {
      el: "vboard",
      body: "voorkant",
      x: 335,
      y: 75
    });
    $('next').on('click', function() {
      return product_test.next(1);
    });
    $('previous').on('click', function() {
      return product_test.previous(1);
    });
    $('rotate_left').on('click', function() {
      product_test.rotate('next', 1);
      this.disable();
      return $('rotate_right').disable();
    });
    $('rotate_right').on('click', function() {
      product_test.rotate('previous', 1);
      this.disable();
      return $('rotate_left').disable();
    });
    $('stop_rotate').on('click', function() {
      product_test.rotateStop();
      $('rotate_left').enable();
      return $('rotate_right').enable();
    });
    $('goto_front').on('click', function(e) {
      e.preventDefault();
      return product_test.slideToFrame(86);
    });
    $('goto_back').on('click', function(e) {
      e.preventDefault();
      return product_test.slideToFrame(43);
    });
    Event.observe(document, 'keydown', function(e) {
      switch (e.keyCode) {
        case 37:
          return $('rotate_left').click();
        case 39:
          return $('rotate_right').click();
      }
    });
    return Event.observe(document, 'keyup', function(e) {
      switch (e.keyCode) {
        case 37:
          return $('stop_rotate').click();
        case 39:
          return $('stop_rotate').click();
      }
    });
  });

}).call(this);
