# Simply Shops
[![SConfig dependency badge](https://github.com/user-attachments/assets/cd1c569a-6256-40e3-b858-e24378d46ee6)](https://github.com/palmmc/sconfig/releases/latest)

Create your own server shops with ease for **[SerenityJS](https://github.com/SerenityJS/serenity)**!

> ### Heads Up
> This plugin is missing two features to be feature complete:
> - Built-in web editor.
> - Economy/virtual currency support.
> - Chest Form interface type.
> The features are planned and will be added in the near future before version release.

## What's this?
**Simply Shops** is a user-friendly plugin that empowers you to create your own shop interfaces for your server!
- Customize your shop with JSON properties or our [built-in web editor]().
- Choose from a form or chest based interface for your shop!
- Integrates with item or [missing] currencies!

## How do I start?
First, install the plugin by downloading the [latest release](https://github.com/palmmc/simply-shops/releases/latest) and dropping it into your server's `/plugins` folder!
#### Using the **Web Editor**:
  1. Start your server and look in the logs for the link to the web editor.
  2. Use the web editor to customize your own shop.
  3. Save your shop and restart the server. That's it!
#### Editing manually:
  1. Create a new JSON file in your `/plugindata/shop/` folder.
  2. Customize your shop using valid JSON elements (see the [source](https://github.com/palmmc/simply-shops/blob/main/src/Types/shop.ts) to explore your options).
  3. Save your shop and restart the server. That's it!

## In-Game Example
![](https://github.com/user-attachments/assets/76921e35-a08d-4f9a-a50b-8480b4fb725f)

## I'm a Developer
Ohh, so you think you're the bees knees, eh? The rat's cheddar? I get it, let's get a bit more advanced!
### Using the API
1. **Install the Plugin:** Install the **[latest version](https://github.com/palmmc/simply-shops/releases/latest)** to your SerenityJS server's `plugins` directory.
2. **Install the Typings:** Install the NPM package into your plugin project's folder.

    ```bash
    #npm
    npm install simply-shops
  
    #yarn
    yarn add simply-shops
    
    #bun
    bun add simply-shops
    ```
> [!NOTE]
> If you are having trouble with this step, try adding `--prefix <path/to/your/plugin/project>` at the end of the command.
3. **Import into your Plugin:** In your plugin's main file, import the `ShopPlugin` class.

    ```ts
    import type { ShopPlugin } from "simply-shops";
    ```
4. **Resolve the Plugin Instance:** Once your plugin is initialized, resolve the `ShopPlugin` instance that you have installed so you can use its features.
    ```ts
    import { Plugin } from "@serenityjs/plugins";
    
    import type { ShopPlugin } from "simply-shops";
    
    class ExamplePlugin extends Plugin {
      public onInitialize(): void {
        // The resolve method fetches the ShopPlugin instance from the plugin you installed.
        const { Shop } = this.resolve<ShopPlugin>("simply-shops")!; // Notice the use of `!` can be unsafe if the plugin is not loaded correctly.
      }
    }
    ```
### Usage
The `Shop` class is constructed using a string identifier and data implemented by the `ShopData` type; this data reflects the properties allowed by JSON customization, but also includes function hooks for override certain display functions for further customizability.

Alternatively, you can also extend the `Shop` and `ShopPage` class to create an interface entirely your own. The choice is yours!
