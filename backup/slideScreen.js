import { Winnetou as W } from "../../winnetoujs/src/winnetou.js";

class slideScreen_ {
  constructor(device = "pc") {
    /**@type {string} */
    this.DEVICE = device;
    /**@type {array} */
    this.GLOBAL_SCREENS = [];
    /**@type {number} */
    this.ACTIVE_SCREEN = 0;
    /**@type {array} */
    this.SCROLLS = [];
    /**@type {number} */
    this.GLOBAL_SS_OUT;
    /**@type {string} */
    this.CONTAINER;
    /**@type {string} */
    this.SS_CONSTRUCTO;
    /**@types {object} */
    this.easings = {
      easeOutCubic: function (x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
      },
    };

    this.addFunctions();
  }

  make(slideScreen_Constructo, document_container_element) {
    //

    this.CONTAINER = document_container_element;
    this.SS_CONSTRUCTO = slideScreen_Constructo;

    // css transformations
    W.select(this.CONTAINER).css("overflowX", "hidden");
    W.select(slideScreen_Constructo).css("display", "flex");

    if (this.DEVICE === "mobile") {
      W.select(".screen")
        .css("overflowY", "scroll")
        .css("height", "100vh");
    }

    this.GLOBAL_SS_OUT = W.select(
      document_container_element
    ).getWidth();

    const screensTotal = document.getElementById(
      slideScreen_Constructo
    ).childElementCount;

    const SSWidth = screensTotal * this.GLOBAL_SS_OUT;

    W.select(".screen").css("width", this.GLOBAL_SS_OUT);
    W.select("#" + slideScreen_Constructo).css("width", SSWidth);

    for (let i = 0; i < screensTotal; i++) {
      //
      this.GLOBAL_SCREENS[
        document.getElementById(slideScreen_Constructo).children[i].id
      ] = i;
      //
    }
  }

  scroll(to_screen, efeito = "animate") {
    const windowSize = this.GLOBAL_SS_OUT;
    let to_screen_global;

    if (typeof to_screen == "string") {
      to_screen_global = this.GLOBAL_SCREENS[to_screen];
    } else {
      to_screen_global = to_screen;
    }

    // do scroll stuff if PC
    if (this.DEVICE === "pc") {
      // how to store the scroll of active screen?

      this.SCROLLS[this.ACTIVE_SCREEN] = window.scrollY;
    }

    if (efeito === "animate") {
      this.tween(
        this.sel(this.CONTAINER).scrollLeft,
        to_screen_global * windowSize,
        500,
        this.easings["easeOutCubic"]
      );
    }

    if (efeito == "direct") {
      this.sel(this.CONTAINER).scrollLeft =
        to_screen_global * windowSize;

      W.select(`.screenContent`).hide();

      W.select(`#${to_screen} .screenContent`).show();
    }

    // aplies the scroll if in pc
    if (this.DEVICE === "pc") {
      window.scroll(0, this.SCROLLS[to_screen_global] || 0);

      // define new active screen
      this.ACTIVE_SCREEN = to_screen_global;
    }
  }

  addFunctions() {
    var lastTime = 0;
    var vendors = ["ms", "moz", "webkit", "o"];
    for (
      var x = 0;
      x < vendors.length && !window.requestAnimationFrame;
      ++x
    ) {
      window.requestAnimationFrame =
        window[vendors[x] + "RequestAnimationFrame"];
      window.cancelAnimationFrame =
        window[vendors[x] + "CancelAnimationFrame"] ||
        window[vendors[x] + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
          callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
  }

  sel = function (id) {
    return document.getElementById(id);
  };

  tween = function (start, end, duration, easing) {
    var delta = end - start;
    var el = this.sel(this.CONTAINER);
    var startTime;
    if (window.performance && window.performance.now) {
      startTime = performance.now();
    } else if (Date.now) {
      startTime = Date.now();
    } else {
      startTime = new Date().getTime();
    }
    var tweenLoop = time => {
      var t = !time ? 0 : time - startTime;
      var factor = easing(null, t, 0, 1, duration);
      try {
        el.scrollLeft = start + delta * factor;
      } catch (e) {}
      if (t < duration && el.scrollLeft != end)
        requestAnimationFrame(tweenLoop);
    };
    tweenLoop();
  };
}

export const SlideScreen = new slideScreen_();
export const SlideScreenMobile = new slideScreen_("mobile");
