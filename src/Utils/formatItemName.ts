function formatIdentifier(id: string) {
  return id
    .substring(id.lastIndexOf(":") + 1)
    .split("_")
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");
}

const numeralMap: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

function toRomanNumeral(x: number) {
  if (!Number.isInteger(x) || x < 1 || x > 3999) return null;
  let result = "";
  for (const [value, numeral] of numeralMap) {
    result += numeral.repeat(Math.floor(x / value));
    x %= value;
  }
  return result;
}

export { formatIdentifier, toRomanNumeral };
