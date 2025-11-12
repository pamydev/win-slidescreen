class __SlideScreen {
  private device: "desktop" | "mobile";

  constructor(args: { device: "desktop" | "mobile" }) {
    this.device = args.device;
  }
}
