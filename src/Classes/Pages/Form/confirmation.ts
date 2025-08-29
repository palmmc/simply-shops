import { MessageForm, Player } from "@serenityjs/core";
import { Shop } from "../../Shop";
import { ShopPage } from "../page";
import { ShopItem } from "../../../Types/shop";
import { formatIdentifier } from "../../../Utils/formatItemName";

class ShopConfirmationPage {
  private form: MessageForm;

  public constructor(
    item: ShopItem,
    shop: Shop,
    amount: number,
    totalPrice: number
  ) {
    this.form = new MessageForm("Confirm Purchase");
    this.form.content = `Are you sure you want to purchase this item?\n${(
      shop.data.info.onItemConfirmationDisplay ?? formatItemConfirmationDisplay
    )(item, shop, amount, totalPrice)}`;
    this.form.button1 = "Confirm";
    this.form.button2 = "Cancel";
  }

  public show(player: Player) {
    return this.form.show(player);
  }
}

function formatItemConfirmationDisplay(
  item: ShopItem,
  shop: Shop,
  amount: number,
  totalPrice: number
) {
  let display = `Item Name: ${
    item.display.name ?? formatIdentifier(item.id)
  }\nItem Amount: ${amount}\nPrice: ${
    item.currency?.prefix ?? shop.data.info.currency.prefix ?? ""
  }${totalPrice} ${
    item.currency?.suffix ?? shop.data.info.currency.suffix ?? ""
  }`;
  return display;
}

export { ShopConfirmationPage };
