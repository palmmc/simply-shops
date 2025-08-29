import { ActionForm, ActionFormImage, Player } from "@serenityjs/core";
import { Shop } from "../../Shop";
import { ShopPage } from "../page";
import { ShopCategory, ShopItem } from "../../../Types/shop";
import { DataFormButton } from "../../../Types/dataFormButton";
import { formatIdentifier } from "../../../Utils/formatItemName";
import { ShopTransactionPage } from "./transaction";

class ShopFormPage extends ShopPage {
  private form: ActionForm;
  private category?: ShopCategory;
  private categories: [ShopCategory, DataFormButton][] = [];
  private items: [ShopItem, DataFormButton][] = [];

  public constructor(shop: Shop, category?: ShopCategory) {
    super(shop);
    this.category = category;
    const info = this.shop.data.info,
      categories = category ? category.categories : this.shop.data.categories,
      items = category ? category.items : this.shop.data.items;
    this.form = new ActionForm(info.name);
    if (categories) {
      for (let category of categories) {
        this.categories.push([
          category,
          [
            `${category.display?.name ?? formatIdentifier(category.id)}\n${
              category.display?.description ?? ""
            }`,
            category.display?.icon as ActionFormImage | undefined,
          ],
        ]);
      }
    }
    if (items) {
      for (let item of items) {
        this.items.push([
          item,
          [
            `${item.display?.name ?? formatIdentifier(item.id)}\n${
              item.display?.description ?? ""
            }`,
            item.display?.icon as ActionFormImage | undefined,
          ],
        ]);
      }
    }
    for (let category of this.categories) this.form.button(...category[1]);
    for (let item of this.items) this.form.button(...item[1]);
  }

  public show(player: Player, previousCategories?: ShopCategory[]) {
    // Title override hook.
    if (this.category && this.shop.data.info.onNameDisplay)
      this.form.title = this.shop.data.info.onNameDisplay(
        player,
        this.category
      );
    // Description override hook.
    this.form.content =
      this.shop.data.info.onDescriptionDisplay?.(player) ?? "";
    // Show form.
    this.form.show(player, (result) => {
      if (result === null) {
        if (!this.shop.data.info.exitOnClose) {
          const lastCategory = previousCategories?.pop();
          if (lastCategory) {
            this.shop.showPage(player, lastCategory, previousCategories);
          } else if (this.category) {
            this.shop.show(player);
          }
        }
        return;
      }
      if (result < this.categories.length) {
        const category = this.categories[result]?.[0];
        if (category) {
          if (this.category) previousCategories?.push(this.category);
          this.shop.showPage(player, category, previousCategories);
        }
      } else {
        result -= this.categories.length;
        const item = this.items[result]?.[0];
        if (item) {
          if (this.category) previousCategories?.push(this.category);
          new ShopTransactionPage(this.shop, item).show(player);
        }
      }
    });
  }
}

export { ShopFormPage };
