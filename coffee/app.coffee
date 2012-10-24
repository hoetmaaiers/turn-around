document.observe "dom:loaded", ->

  product_test = new TurnAround({
    divId: "vboard"
    imageName: "images/v-board_liggend_12FPS_CCW/V-bord-liggend"
    imageCount: 87
    imageType: "png"
    imageDelimiter: "_"
    frameSpeed: 2
    startFrame: 43
  })
  
  product_test.annotateFrame(43, {
    el: "vboard"
    body: "qsdfqsfd"
    x: 330
    y: 250
  })
  product_test.annotateFrame(86, {
    el: "vboard"
    body: "voorkant"
    x: 335
    y: 75
  })
  # NEXT & PREVIOUS
  $('next').on 'click', ->
    product_test.next 1

  $('previous').on 'click', ->
    product_test.previous 1

  # ROTATE
  $('rotate_left').on 'click', ->
    product_test.rotate 'next', 1
    this.disable()
    $('rotate_right').disable()

  $('rotate_right').on 'click', ->
    product_test.rotate 'previous', 1
    this.disable()
    $('rotate_left').disable()

  $('stop_rotate').on 'click', ->
    product_test.rotateStop()
    $('rotate_left').enable()
    $('rotate_right').enable()
  
  $('goto_front').on 'click', (e) ->
    e.preventDefault()
    product_test.slideToFrame(86)


  $('goto_back').on 'click', (e) ->
    e.preventDefault()
    product_test.slideToFrame(43)

  # # # # # # # # # # # # # # # # #
  # # Keystroke events
  
  Event.observe document, 'keydown', (e) ->
    switch e.keyCode
      when 37
        $('rotate_left').click()
      when 39
        $('rotate_right').click()

  Event.observe document, 'keyup', (e) ->
    switch e.keyCode
      when 37
        $('stop_rotate').click()
      when 39
        $('stop_rotate').click()
        