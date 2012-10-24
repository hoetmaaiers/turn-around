(function() {

  window.Annotate = (function() {

    function Annotate(settings) {
      this.settings = settings;
      this.options = {
        x: this.settings.x || 0,
        y: this.settings.y || 0,
        el: this.settings.el || "annotater",
        body: this.settings.body || "lorem ipsum",
        id: "annotation_" + (Math.round(Math.random(10) * 1000)),
        frame: this.settings.frame || null
      };
      this.annotation = new Element("div", {
        "class": "annotation",
        id: this.options.id
      }).update(this.options.body);
      $(this.options.el).insert({
        top: this.annotation
      });
      $(this.options.id).setStyle({
        marginLeft: "" + this.options.x + "px",
        marginTop: "" + this.options.y + "px",
        display: "none"
      });
    }

    Annotate.prototype.getId = function() {
      return this.options.id;
    };

    Annotate.prototype.getFrame = function() {
      return this.options.frame;
    };

    return Annotate;

  })();

}).call(this);
