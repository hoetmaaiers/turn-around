(function() {
  var SpeedCalculator, pad;

  window.TurnAround = (function() {

    function TurnAround(settings) {
      var _this = this;
      this.settings = settings;
      this.options = {
        startFrame: this.settings.startFrame || 1,
        divId: this.settings.divId || "turn_around",
        imageName: this.settings.imageName || "turn_around",
        imageCount: this.settings.imageCount || 180,
        imageType: this.settings.imageType || "jpg",
        imageDelimiter: this.settings.imageDelimiter || "_",
        frameSpeed: this.settings.frameSpeed || 5
      };
      this.annotations = [];
      this.loadImages();
      $$("#" + this.options.divId + " img").invoke('addClassName', 'hide');
      $$("#" + this.options.divId + " [data-frame = " + this.options.startFrame + "]").invoke('toggleClassName', 'hide');
      this.currentFrame = this.options.startFrame;
      $(this.options.divId).observe("mousedown", this.move.bind(this));
      $(this.options.divId).observe('mouseup', this.stopMoving.bind(this));
      $(this.options.divId).observe("touchstart", this.move.bind(this));
      $(this.options.divId).observe("touchend", this.stopMoving.bind(this));
      console.log("ready to turn around");
      this.loopAnnotations();
      setInterval(function() {
        return $('debug').update(_this.currentFrame);
      }, 10);
    }

    TurnAround.prototype.loadImages = function() {
      var _this = this;
      console.log("" + this.options.imageCount + " images loaded");
      this.options.imageCount.times(function(time) {
        return $(_this.options.divId).insert(new Element("img", {
          src: "" + (_this.options.imageName + _this.options.imageDelimiter + pad(time + 1, 3)) + "." + _this.options.imageType,
          id: "" + _this.options.imageName + "-" + (time + 1),
          'data-frame': time + 1
        }, _this));
      });
      return $(this.options.divId).ondragstart = function() {
        return false;
      };
    };

    TurnAround.prototype.next = function(frames) {
      if ((this.currentFrame + frames) > this.options.imageCount) {
        return this.goToFrame(frames);
      } else {
        return this.goToFrame(this.currentFrame + frames);
      }
    };

    TurnAround.prototype.previous = function(frames) {
      if ((this.currentFrame - frames) < 1) {
        return this.goToFrame(this.options.imageCount - frames + 1);
      } else {
        return this.goToFrame(this.currentFrame - frames);
      }
    };

    TurnAround.prototype.goToFrame = function(frame) {
      $$("#" + this.options.divId + " [data-frame=" + this.currentFrame + "]").invoke('toggleClassName', 'hide');
      $$("#" + this.options.divId + " [data-frame=" + frame + "]").invoke('toggleClassName', 'hide');
      return this.currentFrame = frame;
    };

    TurnAround.prototype.move = function(event) {
      event.preventDefault();
      this.speedCalculator = new SpeedCalculator;
      this.pointerStartX = event.pageX;
      $(this.options.divId).observe("touchmove", this.slide.bind(this));
      return $(this.options.divId).observe("mousemove", this.slide.bind(this));
    };

    TurnAround.prototype.slide = function(e) {
      var pointerDistance, pointerEndX;
      pointerEndX = e.pageX;
      pointerDistance = pointerEndX - this.pointerStartX;
      if (Math.abs(pointerDistance) > 10) {
        if (pointerDistance > 0) {
          this.previous(this.options.frameSpeed);
          this.speedCalculator.framesPassBy(this.options.frameSpeed);
          this.direction = "previous";
          console.log("" + this.options.frameSpeed + " to previous");
        } else {
          this.next(this.options.frameSpeed);
          this.speedCalculator.framesPassBy(this.options.frameSpeed);
          this.direction = "next";
          console.log("" + this.options.frameSpeed + " to next");
        }
        return this.pointerStartX = e.pageX;
      }
    };

    TurnAround.prototype.stopMoving = function() {
      var duration, ease, interval, speed, speedEachSecond, speedResult, start,
        _this = this;
      $(this.options.divId).stopObserving('mousemove');
      $(this.options.divId).stopObserving('touchmove', function() {});
      speedResult = this.speedCalculator.result();
      speedEachSecond = this.speedCalculator.resultEachSecond();
      start = new Date;
      duration = 1300;
      interval = 30;
      speed = Math.floor(speedResult * (interval / 1000));
      ease = setInterval(function() {
        var frames, progress, timePassed;
        timePassed = new Date - start;
        progress = timePassed / duration;
        if (progress >= 1) progress = 1;
        speed = Math.floor(speedResult * (interval / 1000));
        frames = Math.floor(speed - (speed * progress));
        if (_this.direction === "next") {
          _this.next(frames);
        } else {
          _this.previous(frames);
        }
        if (progress === 1) return clearInterval(ease);
      }, interval);
      return console.log("currentFrame = " + this.currentFrame);
    };

    TurnAround.prototype.rotate = function(direction, frameSpeed) {
      var _this = this;
      this.speed = 0;
      this.previousSpeed = 0;
      this.rotator = setInterval(function() {
        switch (direction) {
          case "next":
            _this.next(frameSpeed);
            break;
          case "previous":
            _this.previous(frameSpeed);
        }
        return _this.speed++;
      }, 25);
      return this.calculator = setInterval(function() {
        $('speed').update("" + (_this.speed - _this.previousSpeed) + " / 0.100 (second)");
        return _this.previousSpeed = _this.speed;
      }, 25);
    };

    TurnAround.prototype.rotateStop = function() {
      console.log('stop rotating');
      clearInterval(this.rotator);
      return clearInterval(this.calculator);
    };

    TurnAround.prototype.slideToFrame = function(frame) {
      var slideInterval,
        _this = this;
      console.log("slide from " + this.currentFrame + "to " + frame);
      if (frame < this.currentFrame) {
        if (Math.round(this.options.imageCount / 2) < (this.currentFrame - frame)) {
          this.rotate("previous", 1);
        } else {
          this.rotate("next", 1);
        }
      }
      if (frame > this.currentFrame) {
        if (Math.round(this.options.imageCount / 2) > (this.currentFrame - frame)) {
          this.rotate("next", 1);
        } else {
          this.rotate("previous", 1);
        }
      }
      return slideInterval = setInterval(function() {
        if (_this.currentFrame === frame) {
          _this.rotateStop();
          clearInterval(slideInterval);
          return console.log("currentFrame = " + _this.currentFrame);
        }
      }, 10);
    };

    TurnAround.prototype.annotateFrame = function(frame, settings) {
      this.a = new Annotate({
        el: settings.el || "turn_around",
        body: settings.body || "",
        x: settings.x || 0,
        y: settings.y || 0,
        frame: frame
      });
      return this.annotations.push(this.a);
    };

    TurnAround.prototype.loopAnnotations = function() {
      var _this = this;
      return setInterval(function() {
        return _this.annotations.each(function(value) {
          if (value.getFrame() === _this.currentFrame) {
            return $(value.getId()).appear({
              to: 0.7,
              duration: 0.2
            });
          } else if (value.getFrame() !== _this.currentFrame) {
            return $(value.getId()).hide({
              duration: 1.0
            });
          }
        });
      }, 200);
    };

    return TurnAround;

  })();

  SpeedCalculator = (function() {

    function SpeedCalculator() {
      this.startTime = new Date();
      this.frames = 0;
      this.totalFrames = 0;
      this.tick = 0;
      this.speedEachSecond = new Array;
      console.log("keeping by speed");
    }

    SpeedCalculator.prototype.framesPassBy = function(i) {
      this.totalFrames += i;
      return this.frames += i;
    };

    SpeedCalculator.prototype.result = function() {
      var seconds, speed;
      this.endTime = new Date();
      seconds = (this.endTime.getTime() - this.startTime.getTime()) / 1000;
      speed = this.frames / seconds;
      console.log("passed " + this.frames + " frames in " + seconds + " seconden, gemiddeld " + (Math.round(speed)) + " frames / sec");
      return speed;
    };

    SpeedCalculator.prototype.resultEachSecond = function() {
      return this.speedEachSecond;
    };

    return SpeedCalculator;

  })();

  pad = function(number, length) {
    var str;
    str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  };

}).call(this);
