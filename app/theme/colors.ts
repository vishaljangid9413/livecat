// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral50: "#ffffff",
  neutral100: "#fcfcfc",
  neutral200: "#f5f5f5",
  neutral300: "#f0f0f0",
  neutral400: "#d9d9d9",
  neutral500: "#bfbfbf",
  neutral600: "#8c8c8c",
  neutral700: "#595959",
  neutral800: "#454545",
  neutral900: "#262626",
  neutral1000: "#1f1f1f",
  neutral1100: "#141414",
  
  primary50: "#e6e9f4",
  primary100: "#b0bbde",
  primary200: "#8a9ace",
  primary300: "#546cb8",
  primary400: "#334faa",
  primary500: "#002395",
  primary600: "#002088",
  primary700: "#00196a",
  primary800: "#001352",
  primary900: "#000f3f",
  
  accent100: "#C29B0E", //Pending
  accent200: "#0BA336", //Confirmation

  angry100: "#CB0707"
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
  * A helper for making something see-thru.
  */
  transparent: "rgba(0, 0, 0, 0)",
  /**
  * The default text color in many components.
  */
  text: palette.neutral300,
  // text: "FFFAF5",
  /**
  * Secondary text information.
  */
  textDim: palette.neutral700,
  // textDim: "A5A6A8",
  /**
  * The default color of the screen background.
  */
  background: palette.neutral50,
  // background: "0F1113",
  /**
  * The default border color.
  */
  border: palette.primary400,
  borderDim: palette.neutral700,
  // 2C3C53
  /**
  * The main tinting color.
  */
  tint: palette.primary900,
  // tint: "000030",
  /**
  * A subtle color used for lines.
  */
  separator: palette.neutral300,
  // separator: "DFDFDF",

  error: palette.angry100,
  focus: palette.primary400
}