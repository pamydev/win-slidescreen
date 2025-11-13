---
applyTo: "**"
---

# win-slidescreen Instructions

Use this guide to implement horizontal slide screen functionality in WinnetouJs applications.

## Package Overview

win-slidescreen is a WinnetouJs plugin that creates horizontal scrolling screens (slide screens) for web applications. It supports both desktop and mobile devices with different scrolling behaviors.

## Installation

```bash
npm i win-slidescreen
```

## Imports

```javascript
// Desktop version
import { SlideScreen, $screen, $slideContainer } from "win-slidescreen";

// Mobile version
import { SlideScreenMobile, $screen, $slideContainer } from "win-slidescreen";
```

## Core Concepts

### Device Detection

- **Desktop**: Uses `SlideScreen` with horizontal scrolling and direct screen switching
- **Mobile**: Uses `SlideScreenMobile` with animated transitions and vertical scrolling per screen

Detect device and choose appropriate instance:

```javascript
const device = window.innerWidth <= 768 ? "mobile" : "desktop";
const SlideScreenInstance =
  device === "mobile" ? SlideScreenMobile : SlideScreen;
const animationType = device === "mobile" ? "animate" : "direct";
```

## Basic Setup

### 1. Create Container and Screens

```javascript
import { $screen, $slideContainer, SlideScreen } from "win-slidescreen";

// Create the main container
const container = new $slideContainer().create("#app");

// Create individual screens inside the container
const mainPage = new $screen().create(container.ids.slideContainer);
const profilePage = new $screen().create(container.ids.slideContainer);
const menuPage = new $screen().create(container.ids.slideContainer);
```

### 2. Initialize SlideScreen

```javascript
// Initialize with container ID and parent element ID
SlideScreen.make(container.ids.slideContainer, "app");
```

### 3. Add Content to Screens

**Important**: Always use `ids.content` to insert content into screens, not `ids.screen`. This ensures proper scroll behavior in desktop mode.

```javascript
// Correct way - use ids.content
new $content({
  style: "height:100%; background-color:#ffffaa",
}).create(mainPage.ids.content);

// Wrong way - do not use ids.screen for content
// new $content({}).create(mainPage.ids.screen); // DON'T DO THIS
```

### 4. Navigate Between Screens

```javascript
// Using screen ID
SlideScreen.scroll(mainPage.ids.screen);

// Using screen index (0-based)
SlideScreen.scroll(0);

// With animation type
SlideScreen.scroll(profilePage.ids.screen, "animate");
SlideScreen.scroll(profilePage.ids.screen, "direct");
```

## Animation Types

- **`"animate"`**: Smooth animated transition (recommended for mobile)
- **`"direct"`**: Instant jump to screen (recommended for desktop)

## Integration with WinnetouJs Router

Create a router class to manage screen navigation:

```javascript
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
    this.mainPage = args.mainPage;
    this.profilePage = args.profilePage;
    this.menuPage = args.menuPage;
    this.SlideScreen = args.SlideScreen;
    this.animationType = args.animationType;
    this.createRoutes();
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
```

## Complete Example

```javascript
import { Winnetou } from "winnetoujs";
import {
  $screen,
  $slideContainer,
  SlideScreen,
  SlideScreenMobile,
} from "win-slidescreen";
import { $button, $content } from "./constructos/commons.wcto";
import { Router } from "winnetoujs/modules/router";

const renderApp = () => {
  // Detect device
  const device = window.innerWidth <= 768 ? "mobile" : "desktop";
  const SlideScreenInstance =
    device === "mobile" ? SlideScreenMobile : SlideScreen;
  const animationType = device === "mobile" ? "animate" : "direct";

  // Create container and screens
  const container = new $slideContainer().create("#app");
  const mainPage = new $screen().create(container.ids.slideContainer);
  const profilePage = new $screen().create(container.ids.slideContainer);
  const menuPage = new $screen().create(container.ids.slideContainer);

  // Initialize router
  const myRouter = new MyRouter({
    mainPage: mainPage.ids.screen,
    menuPage: menuPage.ids.screen,
    profilePage: profilePage.ids.screen,
    SlideScreen: SlideScreenInstance,
    animationType: animationType,
  });

  // Initialize SlideScreen
  SlideScreenInstance.make(container.ids.slideContainer, "app");

  // Add content to mainPage (use ids.content!)
  const mainPageContent = new $content({
    style: "height:100%; background-color:#ffffaa",
  }).create(mainPage.ids.content).ids.content;

  new $content({
    text: "Main Page Content",
    style: "height:200px",
  }).create(mainPageContent);

  new $button({
    text: "Go to Profile",
    onclick: Winnetou.fx(() => myRouter.methods.profile.go()),
  }).create(mainPageContent);

  // Add content to profilePage (use ids.content!)
  const profilePageContent = new $content({
    style: "height:100%; background-color:#ffaaaa",
  }).create(profilePage.ids.content).ids.content;

  new $content({
    text: "Profile Page Content",
    style: "height:200px",
  }).create(profilePageContent);

  new $button({
    text: "Go to Menu",
    onclick: Winnetou.fx(() => myRouter.methods.menu.go()),
  }).create(profilePageContent);

  // Add content to menuPage (use ids.content!)
  const menuPageContent = new $content({
    style: "height:100%; background-color:#aaaaff",
  }).create(menuPage.ids.content).ids.content;

  new $content({
    text: "Menu Page Content",
    style: "height:200px",
  }).create(menuPageContent);

  new $button({
    text: "Go to Main",
    onclick: Winnetou.fx(() => myRouter.methods.main.go()),
  }).create(menuPageContent);

  // Navigate to initial route
  myRouter.methods.main.go();
};

renderApp();
```

## Required CSS

```scss
.slideContainer {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.screen {
  width: 100%;
  height: 100%;

  .screenContent {
    height: 100%;
  }
}
```

## Best Practices

1. **Always use `ids.content`** for adding content to screens, not `ids.screen`
2. **Use `ids.screen`** only for scroll navigation
3. **Detect device type** and use appropriate SlideScreen instance
4. **Set animation type** based on device (animate for mobile, direct for desktop)
5. **Initialize SlideScreen** after creating all screens
6. **Use WinnetouJs Router** for proper navigation management
7. **Style screens** with `height: 100%` and `overflow` settings

## Scroll Restoration

If using custom scroll restoration logic, disable browser's automatic scroll restoration:

```javascript
history.scrollRestoration = "manual";
```

## API Reference

### SlideScreen / SlideScreenMobile

#### `make(containerID: string, parentElementID: string): void`

Initializes the slide screen system.

- **containerID**: The ID of the slideContainer constructo
- **parentElementID**: The ID of the parent element (usually "app")

#### `scroll(target: string | number, effect?: "animate" | "direct"): void`

Navigates to a specific screen.

- **target**: Screen ID string or screen index number (0-based)
- **effect**: Animation type (default: "animate")
  - `"animate"`: Smooth animated transition
  - `"direct"`: Instant jump to screen

### Constructos

#### `$slideContainer`

Creates the main container for slide screens.

**Returns**: `{ ids: { slideContainer: string } }`

#### `$screen`

Creates an individual screen within the container.

**Returns**: `{ ids: { screen: string, content: string } }`

- Use `ids.screen` for navigation
- Use `ids.content` for adding content

## Common Issues

### Content not displaying correctly in desktop mode

**Problem**: Content added directly to `ids.screen` doesn't hide properly in direct mode.

**Solution**: Always use `ids.content` for adding screen content:

```javascript
// Correct
new $content({}).create(mainPage.ids.content);

// Wrong
new $content({}).create(mainPage.ids.screen);
```

### Navigation not working

**Problem**: SlideScreen.scroll() doesn't navigate to screens.

**Solution**: Ensure you call `make()` after creating all screens and before attempting navigation:

```javascript
// 1. Create container and screens
const container = new $slideContainer().create("#app");
const screen1 = new $screen().create(container.ids.slideContainer);

// 2. Initialize SlideScreen
SlideScreen.make(container.ids.slideContainer, "app");

// 3. Now you can navigate
SlideScreen.scroll(screen1.ids.screen);
```

### Scroll restoration conflicts

**Problem**: Browser restores scroll position unexpectedly.

**Solution**: Disable browser scroll restoration:

```javascript
history.scrollRestoration = "manual";
```
