import { Winnetou } from "winnetoujs";
import {
  $screen,
  $slideContainer,
  SlideScreen,
  SlideScreenMobile,
} from "../../dist/main.js";
import { $button, $content } from "./constructos/commons.wcto";
import { Router } from "winnetoujs/modules/router";

class MyRouter {
  private routes: Record<string, () => void> = {};
  private mainPage: string;
  private profilePage: string;
  private menuPage: string;
  private SlideScreen: typeof SlideScreen;
  private animationType: "animate" | "direct";

  constructor(args: {
    mainPage: string;
    profilePage: string;
    menuPage: string;
    SlideScreen: typeof SlideScreen;
    animationType: "animate" | "direct";
  }) {
    this.createRoutes();
    this.mainPage = args.mainPage;
    this.profilePage = args.profilePage;
    this.menuPage = args.menuPage;
    this.SlideScreen = args.SlideScreen;
    this.animationType = args.animationType;
  }

  public methods = {
    main: {
      go: () => Router.navigate("/main"),
      set: () => {
        this.routes["/main"] = () => {
          this.SlideScreen.scroll(this.mainPage, this.animationType);
        };
      },
    },
    profile: {
      go: () => Router.navigate("/profile"),
      set: () => {
        this.routes["/profile"] = () => {
          this.SlideScreen.scroll(this.profilePage, this.animationType);
        };
      },
    },
    menu: {
      go: () => Router.navigate("/menu"),
      set: () => {
        this.routes["/menu"] = () => {
          this.SlideScreen.scroll(this.menuPage, this.animationType);
        };
      },
    },
  };

  private createRoutes() {
    Object.keys(this.methods).forEach(key => {
      this.methods[key as keyof typeof this.methods].set();
    });
    Router.createRoutes(this.routes, {
      onGo(route) {
        console.log("onGo", route);
      },
      onBack(route) {
        console.log("onBack", route);
      },
    });
  }
}

// Navigate to home by default
// myRouter.methods.home.go();

const renderApp = () => {
  // define if it is mobile or desktop
  const device = window.innerWidth <= 768 ? "mobile" : "desktop";
  const SlideScreenInstance =
    device === "mobile" ? SlideScreenMobile : SlideScreen;
  const animationType = device === "mobile" ? "animate" : "direct";

  const container = new $slideContainer().create("#app");
  const mainPage = new $screen().create(container.ids.slideContainer);
  const profilePage = new $screen().create(container.ids.slideContainer);
  const menuPage = new $screen().create(container.ids.slideContainer);
  const myRouter = new MyRouter({
    mainPage: mainPage.ids.screen,
    menuPage: menuPage.ids.screen,
    profilePage: profilePage.ids.screen,
    SlideScreen: SlideScreenInstance,
    animationType: animationType,
  });

  SlideScreenInstance.make(container.ids.slideContainer, "app");

  // mainPage ===============================

  const mainPageContent = new $content({
    style: "height:100%; background-color:#ffffaa",
  }).create(mainPage.ids.content).ids.content;
  new $content({ text: "Main Page Content 2", style: "height:200px" }).create(
    mainPageContent
  );
  new $button({
    text: "Go to Profile",
    onclick: Winnetou.fx(() => myRouter.methods.profile.go()),
  }).create(mainPageContent);

  // profilePage ===============================

  const profilePageContent = new $content({
    style: "height:100%; background-color:#ffaaaa",
  }).create(profilePage.ids.content).ids.content;

  new $content({ text: "Profile Page Content", style: "height:200px" }).create(
    profilePageContent
  );
  new $button({
    text: "Go to Menu",
    onclick: Winnetou.fx(() => myRouter.methods.menu.go()),
  }).create(profilePageContent);

  // menuPage ===============================

  const menuPageContent = new $content({
    style: "height:100%; background-color:#aaaaff",
  }).create(menuPage.ids.content).ids.content;

  new $content({ text: "Menu Page Content", style: "height:200px" }).create(
    menuPageContent
  );
  new $button({
    text: "Go to Main",
    onclick: Winnetou.fx(() => myRouter.methods.main.go()),
  }).create(menuPageContent);

  // call initial route
  myRouter.methods.main.go();
};

renderApp();
