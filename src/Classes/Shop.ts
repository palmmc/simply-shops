import { Storage, StorageType } from "serenity-config";
import { SHOP_TEMPLATE } from "../Templates/shop";
import { Logger, LoggerColors } from "@serenityjs/logger";
import { ShopCategory, ShopData, ShopItem } from "../Types/shop";
import { ItemStack, Player, World } from "@serenityjs/core";
import { ShopPage } from "./Pages/page";
import { ShopFormPage } from "./Pages/Form/main";
import { ShopEnum } from "../Commands/Enums/shop";
import { Enchantment } from "@serenityjs/protocol";
import { ShopAliasCommand } from "../Commands/alias";

class Shop {
  public static readonly logger = new Logger(
    "Shops",
    LoggerColors.MaterialDiamond
  );

  private static world: World;

  private static itemTypes: string[];

  public static readonly notify = (player: Player, message: string) => {
    player.sendMessage(`§f[§bShop§f] ${message}`);
    player.playSound("random.orb", { volume: 0.5 });
  };

  public static readonly error = (player: Player, message: string) => {
    player.sendMessage(`§f[§bShop§f] §c${message}`);
    player.playSound("note.bass", { volume: 0.5, pitch: 0.5 });
  };

  private static shops: Map<string, Shop> = new Map();

  public static constructAll(world: World) {
    this.world = world;
    this.itemTypes = world.itemPalette.getAllTypes().map((x) => x.identifier);
    const shopData = new Storage<ShopData>(
      StorageType.Server,
      "shops/example_shop.json",
      SHOP_TEMPLATE
    );
    const shop = new Shop(shopData.getValue("info").id, shopData.values);
    this.shops.set(shop.id, shop);
    // Add shop to command options.
    ShopEnum.options.push(shop.id);
    // Create shop alias if specified.
    const commandInfo = shop.data.info.command;
    if (commandInfo) {
      if (!this.world.commandPalette.get(commandInfo.name))
        new ShopAliasCommand(
          shop,
          commandInfo.name,
          commandInfo.description,
          commandInfo.permissions
        ).register(world);
    }
  }

  public static get(id: string) {
    return this.shops.get(id);
  }

  public id: string;

  public data: ShopData;

  public mainPage: ShopPage;

  public pages: Map<ShopCategory, ShopPage> = new Map();

  public constructor(id: string, data: ShopData) {
    this.id = id;
    this.data = data;
    this.mainPage = new ShopFormPage(this);
    try {
      if (!this.validateShop(data)) {
        throw new Error(`Failed to initialize shop '§e${this.id}§c'.`);
      }
      for (let category of data.categories ?? []) {
        this.pages.set(category, new ShopFormPage(this, category));
        this.setSubCategoryPages(category);
      }
      for (let item of data.items ?? []) {
        if (!this.validateItemEntry(item))
          throw new Error(`Failed to initialize shop '§e${this.id}§c'.`);
      }
    } catch (e) {
      Shop.logger.warn(`§c${e}`);
      return;
    }
    Shop.logger.info(`§aInitialized shop '§e${this.id}§a'.`);
  }

  private setSubCategoryPages(category: ShopCategory) {
    if (category.categories) {
      this.pages.set(category, new ShopFormPage(this, category));
      for (let subCategory of category.categories) {
        this.setSubCategoryPages(subCategory);
      }
    }
    for (let item of category.items) {
      if (!this.validateItemEntry(item))
        throw new Error(`Failed to initialize shop '§e${this.id}§c'.`);
    }
  }

  private validateShop(data: ShopData) {
    const info = data.info;
    if (info.currency.type === "item") {
      if (!Shop.itemTypes.some((x) => x === info.currency.id)) {
        Shop.logger.warn(
          `§6Currency item type '§e${info.currency.id}§6' is not registered to one or more worlds. This may cause issues.`
        );
      }
    }
    if (info.command) {
      if (Shop.world.commandPalette.get(info.command.name)) {
        Shop.logger.warn(
          `§6Command with name '§e${info.command.name}§6' already exists, and will not be loaded.`
        );
      }
    }
    return true;
  }

  private validateItemEntry(item: ShopItem) {
    if (!Shop.itemTypes.some((x) => x === item.id)) {
      Shop.logger.warn(
        `§6Item type '§e${item.id}§6' §6is not registered to one or more worlds. This may cause issues.`
      );
    }
    if (!(item.price > 0)) {
      Shop.logger.warn(
        `§cInvalid item price '§6${item.price}§c' for item: '§e${item.id}§c'.`
      );
      return false;
    }
    if (item.currency && item.currency.type === "item") {
      if (!Shop.itemTypes.some((x) => x === item.currency!.id)) {
        Shop.logger.warn(
          `§6Currency item type '§e${item.currency.id}§6' is not registered to one or more worlds. This may cause issues.`
        );
      }
    }
    if (item.nbt) {
      try {
        JSON.parse(item.nbt);
      } catch (e) {
        Shop.logger.warn(`§cInvalid NBT data for item: '§e${item.id}§c'.`);
      }
    }
    if (item.enchantments) {
      for (let enchantment of item.enchantments) {
        if (Object.keys(Enchantment).indexOf(enchantment.id) === -1) {
          Shop.logger.warn(
            `§cInvalid enchantment id '§e${enchantment.id}§c' for item: '§e${item.id}§c'.`
          );
          return false;
        }
      }
    }
    if (item.sales) {
      for (let sale of item.sales) {
        if (sale.expires) {
          if (!Date.parse(sale.expires)) {
            Shop.logger.warn(
              `§cInvalid sale end date for item: '§e${item.id}§c'.`
            );
            return false;
          } else if (new Date(sale.expires) < new Date()) {
            Shop.logger.warn(
              `§6An ongoing sale has already passed for item: '§e${item.id}§6'. Consider removing it.`
            );
          }
        }
      }
    }
    return true;
  }

  public showPage(
    player: Player,
    category: ShopCategory,
    previousCategories?: ShopCategory[]
  ) {
    if (!this.pages.has(category)) {
      throw new Error(`Page does not exist for shop '${this.id}'.`);
    }
    const page = this.pages.get(category);
    if (page instanceof ShopFormPage) {
      page.show(player, previousCategories);
    }
  }

  public show(player: Player) {
    this.mainPage.show(player);
  }
}

export { Shop };
