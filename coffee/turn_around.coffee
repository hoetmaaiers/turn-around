class window.TurnAround
  constructor: (@settings) ->
    
    # Set options
    @options = {
      startFrame:   		    @settings.startFrame   		|| 1
      divId:        		    @settings.divId        		|| "turn_around"
      imageName:            @settings.imageName   		|| "turn_around"
      imageCount:  		      @settings.imageCount  		|| 180
      imageType:            @settings.imageType       || "jpg"
      imageDelimiter: 	    @settings.imageDelimiter  || "_"
      frameSpeed:           @settings.frameSpeed      || 5
    }
    
    @annotations = []
    
    @loadImages() # load all images
    
    # hide all images
    $$("##{@options.divId} img").invoke 'addClassName', 'hide'
    # initialize start frame
    $$("##{@options.divId} [data-frame = #{@options.startFrame}]").invoke 'toggleClassName', 'hide'
    @currentFrame = @options.startFrame

    # initialize mouse event
    $(@options.divId).observe "mousedown", @move.bind(this)
    $(@options.divId).observe 'mouseup', @stopMoving.bind(this)
  
    # initialize touch event
    $(@options.divId).observe "touchstart", @move.bind(this)
    $(@options.divId).observe "touchend", @stopMoving.bind(this)
      
    console.log "ready to turn around"
    
    @loopAnnotations()
    
    setInterval =>
      $('debug').update @currentFrame
    , 10
    

  loadImages: ->
    # load images
    console.log "#{@options.imageCount} images loaded"
 
    (@options.imageCount).times (time) =>
      $(@options.divId).insert new Element("img", {
        src:          "#{@options.imageName + @options.imageDelimiter + pad((time + 1), 3)}.#{@options.imageType}",
        id:           "#{@options.imageName}-#{time + 1}",
        'data-frame':   time + 1
      }, this) # add context
    
    # make images UNdraggable
    $(@options.divId).ondragstart = -> false


  next: (frames) ->
    if (@currentFrame + frames) > @options.imageCount
      @goToFrame(frames)
    else
      @goToFrame(this.currentFrame + frames)
    

  previous: (frames) ->
    if (@currentFrame - frames) < 1
      @goToFrame(@options.imageCount - frames + 1)
    else
      @goToFrame(@currentFrame - frames)


  goToFrame: (frame) ->
    # hide current frame
    $$("##{@options.divId} [data-frame=#{ @currentFrame }]").invoke 'toggleClassName', 'hide'
    # show next frame
    $$("##{@options.divId} [data-frame=#{ frame }]").invoke 'toggleClassName', 'hide'
  
    @currentFrame = frame
  

  move: (event) ->
    event.preventDefault()
    # new instance of speedCalculator
    @speedCalculator = new SpeedCalculator
    # get start X value
    @pointerStartX = event.pageX
  
    # observe mouse movement
    $(@options.divId).observe "touchmove", @slide.bind(this)
    $(@options.divId).observe "mousemove", @slide.bind(this)
    
  slide: (e) ->
    # calculate movement
    pointerEndX = e.pageX
    pointerDistance = pointerEndX - @pointerStartX
  
    # move every 10 pixels
    if Math.abs(pointerDistance) > 10
      # calculate direction
      if pointerDistance > 0        
        @previous @options.frameSpeed
        @speedCalculator.framesPassBy @options.frameSpeed
        @direction = "previous"
        console.log "#{@options.frameSpeed} to previous"
      else      
        @next @options.frameSpeed
        @speedCalculator.framesPassBy @options.frameSpeed
        @direction = "next"
        console.log "#{@options.frameSpeed} to next"
      
      @pointerStartX = e.pageX


  stopMoving: ->
    # stop mousemove observe
    $(@options.divId).stopObserving 'mousemove'
    $(@options.divId).stopObserving 'touchmove', ->
      
    # get speedresult
    speedResult = @speedCalculator.result()

    speedEachSecond = @speedCalculator.resultEachSecond()

    start = new Date  # The time of animation start
    duration = 1300 # duration in 
    interval = 30

    speed = Math.floor(speedResult * (interval / 1000 ))

    # EASE OUT
    ease = setInterval =>
      timePassed = new Date - start
      progress = timePassed / duration

      # number might be higher, so round now
      if progress >= 1 then progress = 1

      # calculate speed on current interval => frames/sec
      speed = Math.floor speedResult * (interval / 1000 )
      frames = Math.floor speed - (speed * progress)

      if @direction == "next" then @next frames else @previous frames

      # stop interval
      if progress == 1 then clearInterval(ease) 
    , interval
    
    console.log "currentFrame = #{@currentFrame}"

  rotate: (direction, frameSpeed) ->
    @speed = 0
    @previousSpeed = 0
  
    # rotate
    @rotator = setInterval =>
      switch direction
        when "next" then @next frameSpeed
        when "previous" then @previous frameSpeed
      @speed++
      # console.log @currentFrame
    , 25
  
    # calculate speed
    @calculator = setInterval =>
      $('speed').update "#{@speed - @previousSpeed} / 0.100 (second)"
      @previousSpeed = @speed
    , 25
  

  rotateStop: ->
    console.log 'stop rotating'
      
    clearInterval(@rotator)
    clearInterval(@calculator)


  slideToFrame: (frame) ->
    console.log "slide from #{ @currentFrame }to #{frame}"
    
    if frame < @currentFrame 
      if Math.round(@options.imageCount / 2) < (@currentFrame - frame)
        @rotate "previous", 1
      else
        @rotate "next", 1
        
    if frame > @currentFrame
      if Math.round(@options.imageCount / 2) > (@currentFrame - frame)
        @rotate "next", 1
      else
        @rotate "previous", 1
    
    
    # previousTraject = frame - @currentFrame
    # nextTraject = @currentFrame - frame
    # 
    # console.log "previousTraject = #{previousTraject} && nextTraject = #{nextTraject}}"
    # 
    # if Math.round nextTraject <=  Math.round previousTraject && @currentFrame != frame
    #   @rotate "next", 1
    # else
    #   @rotate "previous", 1

    slideInterval = setInterval =>
      if @currentFrame == frame
        @rotateStop()
        clearInterval(slideInterval)
        console.log "currentFrame = #{@currentFrame}"
    , 10
  
  
  annotateFrame: (frame, settings) ->
    @a = new Annotate({
      el: settings.el || "turn_around"
      body: settings.body || ""
      x: settings.x || 0
      y: settings.y || 0
      frame: frame
    })
    
    @annotations.push(@a)
    
    # annotateInterval = setInterval =>
    #   # console.log 'checking annotate'
    #   # console.log "#{@currentFrame} & frame = #{frame}"
    #   if @currentFrame == frame
    #     $(@a.getId()).appear({to: 0.7})
    #     clearInterval(annotateInterval)
    # , 25
      
  loopAnnotations: ->
    setInterval =>
      @annotations.each (value) =>
        
        if value.getFrame() == @currentFrame
          $(value.getId()).appear({to: 0.7, duration: 0.2})
        else if value.getFrame() !=  @currentFrame
          $(value.getId()).hide({duration: 1.0})
    , 200


class SpeedCalculator
  constructor: ->
    @startTime = new Date()
    @frames = 0
    @totalFrames = 0
    @tick = 0
    @speedEachSecond = new Array
  
    console.log "keeping by speed"    
  
  framesPassBy: (i) ->
    @totalFrames += i
    @frames += i
  
  result: ->
    @endTime = new Date()
    seconds = (@endTime.getTime() - @startTime.getTime()) / 1000

    speed = @frames / seconds
    console.log "passed #{@frames} frames in #{seconds} seconden, gemiddeld #{ Math.round(speed) } frames / sec"
    speed

  resultEachSecond: ->
    @speedEachSecond


# Custum functions
pad= (number, length) ->
  str = '' + number
  while str.length < length
      str = '0' + str
  return str
  
