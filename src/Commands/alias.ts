import { Player, World } from "@serenityjs/core";
import { Shop } from "../Classes/Shop";

class ShopAliasCommand {
  private readonly shop: Shop;

  private readonly name: string;

  private readonly description: string;

  private readonly permissions: string[];

  constructor(
    shop: Shop,
    name: string,
    description: string,
    permissions: string[]
  ) {
    this.shop = shop;
    this.name = name;
    this.description = description;
    this.permissions = permissions;
  }

  public register(world: World) {
    world.commandPalette.register(
      this.name,
      this.description,
      (registry) => {
        registry.permissions = this.permissions;
        registry.overload({}, ({ origin }) => {
          if (!this.shop) {
            throw new Error("Shop is not initialized or does not exist.");
          }
          if (origin.identifier !== "minecraft:player") return;
          this.shop.show(origin as Player);
        });
      },
      () => {}
    );
  }
}

export { ShopAliasCommand };
