/* Imports */
import { Plugin, PluginEvents, PluginType } from "@serenityjs/plugins";
import type { SConfigPlugin } from "serenity-config";
import { Shop } from "./Classes/Shop";
//import { ChestFormPlugin } from "chest-form";
import { ShopCommand } from "./Commands/shop";
import { WorldEvent } from "@serenityjs/core";
import { PlayerInventory } from "./Classes/Inventory";
import { ShopPage } from "./Classes/Pages/page";
import { ShopFormPage } from "./Classes/Pages/Form/main";
import { ShopTransactionPage } from "./Classes/Pages/Form/transaction";
import { ShopConfirmationPage } from "./Classes/Pages/Form/confirmation";

/**
 * @Plugin
 */

const version = "0.1.0";

export class ShopPlugin extends Plugin implements PluginEvents {
  public readonly type = PluginType.Addon;

  // API types.
  public readonly Shop = Shop;
  public readonly PlayerInventory = PlayerInventory;
  public readonly ShopPage = ShopPage;
  public readonly ShopFormPage = ShopFormPage;
  public readonly ShopTransactionPage = ShopTransactionPage;
  public readonly ShopConfirmationPage = ShopConfirmationPage;

  public constructor() {
    super("simply-shops", version);
  }

  public onInitialize(): void {
    // SConfig dependency
    const { Properties, Storage, StorageType } =
      this.resolve<SConfigPlugin>("serenity-config")!;
    // Chest form dependency
    //const { ChestForm } = this.resolve<ChestFormPlugin>("chest-form")!;
    this.serenity.on(WorldEvent.WorldInitialize, ({ world }) => {
      Shop.constructAll(world);
      ShopCommand.register(world);
    });
  }

  public onStartUp(): void {
    this.logger.info("Loaded §bShop§r §8by §5palm1 §7- §8v" + version + "§r");
  }
}

export default new ShopPlugin();

export {
  Shop,
  PlayerInventory,
  ShopPage,
  ShopFormPage,
  ShopTransactionPage,
  ShopConfirmationPage,
};
