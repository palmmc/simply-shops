import { StringEnum, TargetEnum, World } from "@serenityjs/core";
import { Shop } from "../Classes/Shop";
import { ShopEnum } from "./Enums/shop";

class ShopCommand {
  private static name: string = "simpleshops";

  private static description: string = "Opens a shop menu for a player.";

  private static permissions: string[] = [
    "simplyshops.openshop",
    "serenity.operator",
  ];

  public static register(world: World) {
    world.commandPalette.register(
      this.name,
      this.description,
      (registry) => {
        registry.permissions = this.permissions;
        registry.overload(
          {
            target: [TargetEnum, false],
            shop: [ShopEnum, false],
          },
          ({ target, shop }) => {
            if (!target.result) {
              throw new Error("Invalid argument argument for value: selector.");
            }
            if (!shop.result) {
              throw new Error("Invalid argument for value: shop.");
            }
            if (target.result.length === 0) {
              return { message: "No targets matched selector" };
            }
            const shopInstance = Shop.get(shop.result as string);
            if (!shopInstance) {
              throw new Error("Shop is not initialized or does not exist.");
            }
            for (let player of target.result) {
              if (!player.isPlayer()) {
                throw new Error("Invalid argument: Target must be a player.");
              }
              shopInstance.show(player);
            }
            return {
              message: `§aSuccessfully displayed §e${shop.result} §afor §c${target.result?.length} §atarget(s).`,
            };
          }
        );
      },
      () => {}
    );
  }
}

export { ShopCommand };
