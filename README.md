# win-slidescreen

A WinnetouJs plugin that creates beautiful horizontal slide screens for your web applications. Perfect for creating modern, mobile-friendly interfaces with smooth page transitions.

> **⚠️ Important:** This package is designed for **WinnetouJs version 3 and higher**. It will not work with older versions.

## What is win-slidescreen?

win-slidescreen transforms your web app into a horizontal scrolling experience, similar to modern mobile apps. It automatically adapts to desktop and mobile devices:

- **Desktop**: Horizontal scrolling with instant screen switching
- **Mobile**: Animated transitions with vertical scrolling within each screen

## Installation

```bash
npm install win-slidescreen
```

## Quick Start

Here's a simple example to get you started:

```javascript
import { SlideScreen, $screen, $slideContainer } from "win-slidescreen";

// Create the container
const container = new $slideContainer().create("#app");

// Create your screens
const homePage = new $screen().create(container.ids.slideContainer);
const aboutPage = new $screen().create(container.ids.slideContainer);

// Initialize the slide screen system
SlideScreen.make(container.ids.slideContainer, "app");

// Add content to your screens (always use .ids.content!)
new MyContent({ title: "Home" }).create(homePage.ids.content);
new MyContent({ title: "About" }).create(aboutPage.ids.content);

// Navigate between screens
SlideScreen.scroll(homePage.ids.screen); // Go to home
SlideScreen.scroll(aboutPage.ids.screen); // Go to about
```

## Mobile vs Desktop

The plugin automatically detects the device type, but you can also manually choose which version to use:

```javascript
import { SlideScreen, SlideScreenMobile } from "win-slidescreen";

// Detect device
const isMobile = window.innerWidth <= 768;
const Slider = isMobile ? SlideScreenMobile : SlideScreen;

// Use appropriate animation
const animation = isMobile ? "animate" : "direct";

Slider.make(container.ids.slideContainer, "app");
Slider.scroll(somePage.ids.screen, animation);
```

## Important Rules

### ✅ Always add content to `ids.content`

When adding content to screens, **always use `ids.content`**, not `ids.screen`:

```javascript
// ✅ Correct
new MyComponent().create(homePage.ids.content);

// ❌ Wrong - don't do this!
new MyComponent().create(homePage.ids.screen);
```

### 🎯 Use `ids.screen` only for navigation

The `ids.screen` should only be used when navigating:

```javascript
// ✅ Correct - use ids.screen for navigation
SlideScreen.scroll(homePage.ids.screen);
```

## Integration with WinnetouJs Router

For a complete single-page application experience, integrate with WinnetouJs Router:

```javascript
import { Router } from "winnetoujs/modules/router";
import { SlideScreen, $screen, $slideContainer } from "win-slidescreen";

class AppRouter {
  private routes = {};
  private SlideScreen;
  private homeScreen;
  private aboutScreen;

  constructor(homeScreen, aboutScreen, SlideScreen) {
    this.homeScreen = homeScreen;
    this.aboutScreen = aboutScreen;
    this.SlideScreen = SlideScreen;
    this.createRoutes();
  }

  public methods = {
    home: {
      go: () => Router.navigate("/home"),
      set: () => {
        this.routes["/home"] = () => {
          this.SlideScreen.scroll(this.homeScreen, "direct");
        };
      },
    },
    about: {
      go: () => Router.navigate("/about"),
      set: () => {
        this.routes["/about"] = () => {
          this.SlideScreen.scroll(this.aboutScreen, "direct");
        };
      },
    },
  };

  private createRoutes() {
    Object.keys(this.methods).forEach(key => {
      this.methods[key].set();
    });
    Router.createRoutes(this.routes);
  }
}

// Use it
const router = new AppRouter(
  homeScreen.ids.screen,
  aboutScreen.ids.screen,
  SlideScreen
);

router.methods.home.go(); // Navigate to home
```

## API Reference

### Constructos

#### `$slideContainer`

Creates the main container that holds all screens.

```javascript
const container = new $slideContainer().create("#app");
// Returns: { ids: { slideContainer: string } }
```

#### `$screen`

Creates an individual screen within the container.

```javascript
const screen = new $screen().create(container.ids.slideContainer);
// Returns: { ids: { screen: string, content: string } }
```

### SlideScreen / SlideScreenMobile

Both classes share the same API:

#### `make(containerID, parentID)`

Initializes the slide screen system. Call this after creating all your screens.

```javascript
SlideScreen.make(container.ids.slideContainer, "app");
```

- **containerID**: The ID from `$slideContainer`
- **parentID**: The ID of the parent element (usually "app")

#### `scroll(target, effect?)`

Navigates to a specific screen.

```javascript
SlideScreen.scroll(screenID, "animate");
SlideScreen.scroll(0, "direct"); // You can also use screen index
```

- **target**: Screen ID (string) or screen index (number, 0-based)
- **effect**: Optional animation type
  - `"animate"` - Smooth animated transition (recommended for mobile)
  - `"direct"` - Instant jump (recommended for desktop)

## Required Styles

Make sure your CSS includes these basic styles:

```css
.slideContainer {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.screen {
  width: 100%;
  height: 100%;
}

.screen .screenContent {
  height: 100%;
}
```

## Complete Example

Here's a full working example:

```javascript
import { Winnetou } from "winnetoujs";
import {
  SlideScreen,
  SlideScreenMobile,
  $screen,
  $slideContainer,
} from "win-slidescreen";
import { Router } from "winnetoujs/modules/router";

// Detect device type
const isMobile = window.innerWidth <= 768;
const Slider = isMobile ? SlideScreenMobile : SlideScreen;
const animation = isMobile ? "animate" : "direct";

// Create container and screens
const container = new $slideContainer().create("#app");
const homeScreen = new $screen().create(container.ids.slideContainer);
const profileScreen = new $screen().create(container.ids.slideContainer);
const settingsScreen = new $screen().create(container.ids.slideContainer);

// Initialize
Slider.make(container.ids.slideContainer, "app");

// Add content (use ids.content!)
new HomeContent().create(homeScreen.ids.content);
new ProfileContent().create(profileScreen.ids.content);
new SettingsContent().create(settingsScreen.ids.content);

// Add navigation buttons
new NavButton({
  text: "Go to Profile",
  onclick: Winnetou.fx(() => {
    Slider.scroll(profileScreen.ids.screen, animation);
  }),
}).create(homeScreen.ids.content);

// Start on home screen
Slider.scroll(homeScreen.ids.screen, "direct");
```

## Tips and Best Practices

1. **Always initialize after creating screens**: Call `make()` only after all screens are created
2. **Use the right animation**: "direct" for desktop, "animate" for mobile
3. **Respect the content rule**: Always add content to `ids.content`, not `ids.screen`
4. **Mobile-first approach**: Design your content to work vertically on mobile within each screen
5. **Router integration**: Use WinnetouJs Router for better navigation management

## Version Compatibility

- **win-slidescreen 4.x**: Requires WinnetouJs 3.x or higher
- **win-slidescreen 3.x and below**: For older WinnetouJs versions

## License

MIT

## Author

Pamela Sedrez - [GitHub](https://github.com/pamydev)

## Support

- [GitHub Issues](https://github.com/pamydev/win-slidescreen/issues)
- [WinnetouJs Documentation](https://winnetoujs.org)

---

Made with ❤️ for WinnetouJs
