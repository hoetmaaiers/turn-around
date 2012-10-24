class window.Annotate
  constructor: (@settings) ->
    
    # Set options
    @options = {
      x:    @settings.x || 0
      y:    @settings.y || 0
      el:   @settings.el || "annotater"
      body: @settings.body || "lorem ipsum"
      id: "annotation_#{ Math.round(Math.random(10) * 1000)}"
      frame: @settings.frame || null
    }

    # create element
    @annotation = new Element("div", {
      class: "annotation"
      id: @options.id
    }).update(@options.body)
    
    $(@options.el).insert {
      top: @annotation
    }
    
    # Set style
    $(@options.id).setStyle({
      marginLeft: "#{@options.x}px"
      marginTop: "#{@options.y}px"
      display: "none"
    })
    
  getId: ->
    @options.id
    
  getFrame: ->
    @options.frame