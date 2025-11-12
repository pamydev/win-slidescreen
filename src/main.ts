type Device = "desktop" | "mobile";
type EasingFunction = (
  x: number | null,
  t: number,
  b: number,
  c: number,
  d: number
) => number;
type ScreenMap = { [key: string]: number };

class SlideScreen {
  private device: Device;
  private globalScreens: ScreenMap = {};
  private activeScreen: number = 0;
  private scrolls: number[] = [];
  private globalSsOut: number = 0;
  private container: string = "";
  private ssConstructo: string = "";
  private easings: { [key: string]: EasingFunction } = {
    easeOutCubic: function (x, t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
  };

  constructor(device: Device = "desktop") {
    this.device = device;
  }

  make(slideScreenConstructo: string, documentContainerElement: string): void {
    this.container = documentContainerElement;
    this.ssConstructo = slideScreenConstructo;

    // Get container element
    const containerEl = document.getElementById(documentContainerElement);
    const constructoEl = document.getElementById(slideScreenConstructo);

    if (!containerEl || !constructoEl) {
      console.error("Container or constructo element not found");
      return;
    }

    // CSS transformations
    containerEl.style.overflowX = "hidden";
    constructoEl.style.display = "flex";

    if (this.device === "mobile") {
      const screens = document.querySelectorAll<HTMLElement>(".screen");
      screens.forEach(screen => {
        screen.style.overflowY = "scroll";
        screen.style.height = "100vh";
      });
    }

    this.globalSsOut = containerEl.offsetWidth;

    const screensTotal = constructoEl.childElementCount;
    const SSWidth = screensTotal * this.globalSsOut;

    const screens = document.querySelectorAll<HTMLElement>(".screen");
    screens.forEach(screen => {
      screen.style.width = `${this.globalSsOut}px`;
    });

    constructoEl.style.width = `${SSWidth}px`;

    for (let i = 0; i < screensTotal; i++) {
      const child = constructoEl.children[i] as HTMLElement;
      this.globalScreens[child.id] = i;
    }
  }

  scroll(
    toScreen: string | number,
    effect: "animate" | "direct" = "animate"
  ): void {
    const windowSize = this.globalSsOut;
    let toScreenGlobal: number;

    if (typeof toScreen === "string") {
      toScreenGlobal = this.globalScreens[toScreen];
    } else {
      toScreenGlobal = toScreen;
    }

    // Store scroll position if desktop
    if (this.device === "desktop") {
      this.scrolls[this.activeScreen] = window.scrollY;
    }

    const containerEl = document.getElementById(this.container);
    if (!containerEl) return;

    if (effect === "animate") {
      this.tween(
        containerEl.scrollLeft,
        toScreenGlobal * windowSize,
        500,
        this.easings["easeOutCubic"]
      );
    }

    if (effect === "direct") {
      containerEl.scrollLeft = toScreenGlobal * windowSize;

      const allScreenContent =
        document.querySelectorAll<HTMLElement>(".screenContent");
      allScreenContent.forEach(content => {
        content.style.display = "none";
      });

      const targetScreen = document.querySelector<HTMLElement>(
        `#${toScreen} .screenContent`
      );
      if (targetScreen) {
        targetScreen.style.display = "block";
      }
    }

    // Apply scroll if desktop
    if (this.device === "desktop") {
      window.scroll(0, this.scrolls[toScreenGlobal] || 0);
      this.activeScreen = toScreenGlobal;
    }
  }

  private tween(
    start: number,
    end: number,
    duration: number,
    easing: EasingFunction
  ): void {
    const delta = end - start;
    const el = document.getElementById(this.container);

    if (!el) return;

    let startTime: number;
    if (window.performance && typeof window.performance.now === "function") {
      startTime = performance.now();
    } else if (Date.now) {
      startTime = Date.now();
    } else {
      startTime = new Date().getTime();
    }

    const tweenLoop = (time?: number) => {
      const t = !time ? 0 : time - startTime;
      const factor = easing(null, t, 0, 1, duration);

      try {
        el.scrollLeft = start + delta * factor;
      } catch (e) {
        // Ignore scroll errors
      }

      if (t < duration && el.scrollLeft !== end) {
        requestAnimationFrame(tweenLoop);
      }
    };

    tweenLoop();
  }
}

export const slideScreen = new SlideScreen("desktop");
export const slideScreenMobile = new SlideScreen("mobile");

import { $screen, $slideScreen } from "./slideScreen.wcto";
export { $screen, $slideScreen };
