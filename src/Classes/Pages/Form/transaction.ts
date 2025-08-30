import {
  EntityInventoryTrait,
  ItemStack,
  ItemStackEnchantableTrait,
  ModalForm,
  Player,
} from "@serenityjs/core";
import { Shop } from "../../Shop";
import { ShopPage } from "../page";
import { ShopItem } from "../../../Types/shop";
import {
  formatIdentifier,
  toRomanNumeral,
} from "../../../Utils/formatItemName";
import { ShopConfirmationPage } from "./confirmation";
import { PlayerInventory } from "../../Inventory";
import { Enchantment } from "@serenityjs/protocol";

class ShopTransactionPage extends ShopPage {
  private form: ModalForm;
  private item: ShopItem;

  public constructor(shop: Shop, item: ShopItem) {
    super(shop);
    this.item = item;
    const data = this.shop.data;
    const info = data.info;
    this.form = new ModalForm(info.name);
    this.form.label(
      (info.onItemTransactionDisplay ?? formatItemTransactionDisplay)(
        item,
        shop
      )
    );
    this.form.slider(
      "Select an amount",
      1,
      item.slider?.max ?? 64,
      item.slider?.step ?? 1
    );
    this.form.input("Enter an amount:", "0");
  }

  public show(player: Player) {
    this.form.show(player, (result) => {
      if (result === null) {
        Shop.notify(player, `§cTransaction canceled successfully.`);
        return;
      }
      let amount = result[1] as number;
      if (!(amount > 0)) amount = result[0] as number;
      if (!(amount > 0)) this.show(player);

      // Sale functionality.
      let cprice = amount * this.item.price;
      if (this.item.sales)
        for (let sale of this.item.sales) {
          if (sale.expires && new Date(sale.expires) < new Date()) continue;
          if (sale.type === "fixed") {
            cprice = sale.price;
            break;
          } else if (sale.type === "multiplier") {
            cprice *= sale.price;
          }
        }

      const totalPrice = cprice;

      new ShopConfirmationPage(this.item, this.shop, amount, totalPrice)
        .show(player)
        .then((result) => {
          if (result) {
            // Take currency.
            const info = this.shop.data.info;
            const currency = this.item.currency ?? info.currency;
            const inventory = new PlayerInventory(player);
            if (currency.type === "item") {
              const playerTotal = inventory.getItemCount(currency.id);
              if (playerTotal < totalPrice) {
                Shop.error(player, `You cannot afford this purchase.`);
                return;
              }
              inventory.clearItem(currency.id, totalPrice);
            }
            // Construct item.
            let item: ItemStack;
            if (this.item.item) item = this.item.item;
            else {
              item = new ItemStack(this.item.id, { stackSize: amount });
              // Add NBT
              if (this.item.nbt) {
                try {
                  let nbt = JSON.parse(this.item.nbt);
                  for (let [key, value] of nbt) {
                    item.nbt.set(key, value);
                  }
                } catch (e) {}
              }
              // Add enchantments.
              const enchantable = item.addTrait(ItemStackEnchantableTrait);
              if (enchantable && this.item.enchantments) {
                for (let enchantment of this.item.enchantments) {
                  const enchantId =
                    Enchantment[enchantment.id as keyof typeof Enchantment];
                  if (enchantId)
                    enchantable.addEnchantment(enchantId, enchantment.level);
                }
              }
            }
            // Give item.
            inventory.giveItem(item, amount);
            // Purchase hook.
            if (this.item.onPurchase) {
              if (typeof this.item.onPurchase === "function") {
                this.item.onPurchase(player, this.item);
              } else {
                for (let command of this.item.onPurchase) {
                  player.executeCommand(
                    command
                      .replace("{player}", player.username)
                      .replace("{itemId}", this.item.id)
                      .replace("{itemCount}", amount.toString())
                  );
                }
              }
            }
            // Success!
            Shop.notify(
              player,
              `§aPurchased §e${
                this.item.display.name ?? formatIdentifier(this.item.id)
              } §7x§8${amount} §afor §c${
                this.item.currency?.prefix ??
                this.shop.data.info.currency.prefix ??
                ""
              }${totalPrice} ${
                this.item.currency?.suffix ??
                this.shop.data.info.currency.suffix ??
                ""
              }§a.`
            );
          }
        });
    });
  }
}

function formatItemTransactionDisplay(item: ShopItem, shop: Shop) {
  let display = `Item Name: ${
    item.display.name ?? formatIdentifier(item.id)
  }\nItem ID: ${item.id}\nPrice: ${
    item.currency?.prefix ?? shop.data.info.currency.prefix ?? ""
  }${item.price} ${
    item.currency?.suffix ?? shop.data.info.currency.suffix ?? ""
  }`;
  if (item.enchantments)
    display += `\nEnchantments: ${item.enchantments
      .map((x) => `${formatIdentifier(x.id)} ${toRomanNumeral(x.level)}`)
      .join(", ")}`;
  return display;
}

export { ShopTransactionPage };
