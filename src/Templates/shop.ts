import { ShopData } from "../Types/shop";

const SHOP_TEMPLATE: ShopData = {
  info: {
    id: "example",
    name: "Example Shop",
    currency: {
      type: "item",
      id: "minecraft:diamond",
      suffix: "Diamonds",
    },
    command: {
      name: "exampleshop",
      description: "Opens the example shop.",
      permissions: [],
    },
  },
  categories: [
    {
      id: "blocks",
      items: [
        {
          id: "minecraft:grass_block",
          display: {
            description: "Greener if you flip it over.",
            icon: {
              type: "path",
              data: "textures/blocks/grass_side_carried.png",
            },
          },
          price: 10,
        },
        {
          id: "minecraft:dirt",
          display: {
            description: "Lovely dirt.",
            icon: { type: "path", data: "textures/blocks/dirt.png" },
          },
          price: 20,
        },
        {
          id: "minecraft:sand",
          display: {
            description: "Smelt into glass!",
            icon: { type: "path", data: "textures/blocks/sand.png" },
          },
          price: 30,
        },
      ],
      display: {
        name: "Blocks",
        icon: {
          type: "url",
          data: "https://cdn.pixabay.com/photo/2021/12/31/11/34/minecraft-6905550_960_720.png",
        },
        description: "Building materials.",
      },
    },
    {
      id: "equipment",
      items: [
        {
          id: "minecraft:diamond_pickaxe",
          display: {
            description: "A shiny new pick!",
            icon: { type: "path", data: "textures/items/diamond_pickaxe.png" },
          },
          enchantments: [
            {
              id: "Efficiency",
              level: 3,
            },
          ],
          price: 50,
        },
      ],
      display: {
        name: "Equipment",
        icon: {
          type: "url",
          data: "https://freesvg.org/img/modern-15-sword.png",
        },
        description: "Gear up!",
      },
    },
  ],
};

export { SHOP_TEMPLATE };
