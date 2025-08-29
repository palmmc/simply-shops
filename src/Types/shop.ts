import { ActionFormImage, ItemStack, Player } from "@serenityjs/core";

/**
 * Shop information type.
 */
interface ShopInfo {
  id: string; // Shop identifier.
  name: string; // Shop display name.
  currency: ShopCurrency; // Default currency to use for buying/selling items.
  command?: ShopAlias; // Creates a new command alias that, when run, will open this shop. (e.g. 'shop' -> '/shop')
  exitOnClose?: boolean; // Whether or not to exit the entire shop when a page is closed instead of going to the previous page, defaults to false.
  onDescriptionDisplay?: (player: Player) => string; // Overrides the description of the main shop page.
  onNameDisplay?: (player: Player, category: ShopCategory) => string; // Overrides the naming scheme of shop category pages.
  onItemTransactionDisplay?: (item: ShopItem) => string; // Overrides the formatting function on the transaction screen.
  onItemConfirmationDisplay?: (item: ShopItem) => string; // Overrides the formatting function on the confirmation screen.
}

/**
 * Shop command alias type.
 */
interface ShopAlias {
  name: string;
  description: string;
  permissions: string[];
}

/**
 * Shop currency type.
 */
interface ShopCurrency {
  type: "item"; // Type of currency to use.
  id: string; // If currency is item type, this is the item id to use.
  prefix?: string; // Prefix to display before the currency amount (e.g. '$' = '$1')
  suffix?: string; // Suffix to display after the currency amount (e.g. 'Diamonds' = '1 Diamonds')
}

/**
 * Form display information for an entry.
 */
interface ShopDisplay {
  icon?: ActionFormImage | string; // If form-type, adds an icon image to the entry. If chest-type, overrides item texture.
  name?: string; // Overrides the item's name when displayed.
  description?: string; // Form-type only, displays under item name.
  lore?: string[]; // Chest-type only, displays under item name.
}

/**
 * Defines enchantments to be applied to item when purchased.
 */
interface ShopItemEnchantment {
  id: string; // Enchantment id.
  level: number; // Enchantment level.
}

/**
 * Defines a new price or multiplier for an item if before a certain date.
 */
interface ShopItemSale {
  type: "fixed" | "multiplier"; // Fixed will set a new price during the sale, multiplier will multiply the existing price.
  price: number; // Price value.
  expires?: string; // Date for the sale to expire on.
}

interface SliderOptions {
  step: number; // The increment of the amount slider, defaults to 1.
  max: number; // The maximum amount of the amount slider, defaults to 64.
}

/**
 * Shop category type.
 */
export interface ShopCategory {
  id: string; // Category identifier.
  items: ShopItem[]; // Items in this category.
  categories?: ShopCategory[]; // Category subcategories.
  display?: ShopDisplay; // Category display overrides.
  exitOnClose?: boolean; // Overrides the default for exiting when closed for this shop.
}

/**
 * Shop item type.
 */
export interface ShopItem {
  id: string; // ID of item to be given to the player.
  display: ShopDisplay; // Item display overrides.
  price: number; // Purchase price of this item entry.
  slider?: SliderOptions; // Amount slider options.
  currency?: ShopCurrency; // Overrides the default currency for this item entry.
  nbt?: string; // Raw NBT data as a string.
  enchantments?: ShopItemEnchantment[]; // Adds enchantments to the item when purchased.
  item?: ItemStack; // Overrides item-related fields, this ItemStack will be used for distribution.
  sales?: ShopItemSale[]; // Dynamically adjusts the item price before a given date.
  onPurchase?: string[] | ((player: Player, item: ShopItem) => void);
  // List of commands or function to execute when the item is purchased.
  // Valid command placeholders: {player}, {itemId}, {itemCount}
}

/**
 * Shop data type.
 */
interface ShopData {
  info: ShopInfo; // Shop information.
  categories?: ShopCategory[]; // Shop categories.
  items?: ShopItem[]; // Shop items.
}

export type { ShopData };
