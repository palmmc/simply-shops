import { ShopData } from "../Types/shop";

const SHOP_TEMPLATE: ShopData = {
  info: {
    id: "example_shop",
    name: "Example Shop",
    currency: {
      type: "item",
      id: "minecraft:diamond",
      suffix: "Diamonds",
    },
  },
  categories: [
    {
      id: "blocks",
      items: [
        {
          id: "minecraft:diamond_sword",
          display: {
            description: "Lovely dirt.",
            lore: ["Lovely dirt.", "§oI'd keep it if I could.§r"],
            icon: { type: "path", data: "textures/blocks/dirt.png" },
          },
          price: 10,
          enchantments: [
            {
              id: "fortune",
              level: 1,
            },
          ],
        },
      ],
      display: {
        name: "Blocks",
        icon: {
          type: "url",
          data: "https://cdn.pixabay.com/photo/2021/12/31/11/34/minecraft-6905550_960_720.png",
        },
        description: "Building materials.",
        lore: ["Building materials.", "§oEverything you need, hopefully.§r"],
      },
    },
  ],
};

export { SHOP_TEMPLATE };
