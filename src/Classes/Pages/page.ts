import { Player } from "@serenityjs/core";
import { Shop } from "../Shop";

class ShopPage {
  protected readonly shop: Shop;

  public constructor(shop: Shop) {
    this.shop = shop;
  }

  public show(_player: Player) {
    // Implemented by page.
  }
}

export { ShopPage };
