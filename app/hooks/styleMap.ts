import { colors, typography } from "app/theme";
import { $heading } from "app/theme/style";


export const shadowOffset = {
  shOffSetW0H0: { shadowOffset: { width: 0, height: 0 } },
  shOffSetW0H1: { shadowOffset: { width: 0, height: 1 } },
  shOffSetW0H2: { shadowOffset: { width: 0, height: 2 } },
  shOffSetW0H3: { shadowOffset: { width: 0, height: 3 } },
  shOffSetW0H4: { shadowOffset: { width: 0, height: 4 } },
  shOffSetW0H5: { shadowOffset: { width: 0, height: 5 } },
  shOffSetW0H6: { shadowOffset: { width: 0, height: 6 } },
  shOffSetW0H7: { shadowOffset: { width: 0, height: 7 } },
  shOffSetW0H8: { shadowOffset: { width: 0, height: 8 } },
  shOffSetW1H0: { shadowOffset: { width: 1, height: 0 } },
  shOffSetW1H1: { shadowOffset: { width: 1, height: 1 } },
  shOffSetW1H2: { shadowOffset: { width: 1, height: 2 } },
  shOffSetW1H3: { shadowOffset: { width: 1, height: 3 } },
  shOffSetW1H4: { shadowOffset: { width: 1, height: 4 } },
  shOffSetW1H5: { shadowOffset: { width: 1, height: 5 } },
  shOffSetW1H6: { shadowOffset: { width: 1, height: 6 } },
  shOffSetW1H7: { shadowOffset: { width: 1, height: 7 } },
  shOffSetW1H8: { shadowOffset: { width: 1, height: 8 } },
  shOffSetW2H0: { shadowOffset: { width: 2, height: 0 } },
  shOffSetW2H1: { shadowOffset: { width: 2, height: 1 } },
  shOffSetW2H2: { shadowOffset: { width: 2, height: 2 } },
  shOffSetW2H3: { shadowOffset: { width: 2, height: 3 } },
  shOffSetW2H4: { shadowOffset: { width: 2, height: 4 } },
  shOffSetW2H5: { shadowOffset: { width: 2, height: 5 } },
  shOffSetW2H6: { shadowOffset: { width: 2, height: 6 } },
  shOffSetW2H7: { shadowOffset: { width: 2, height: 7 } },
  shOffSetW2H8: { shadowOffset: { width: 2, height: 8 } },
  shOffSetW3H0: { shadowOffset: { width: 3, height: 0 } },
  shOffSetW3H1: { shadowOffset: { width: 3, height: 1 } },
  shOffSetW3H2: { shadowOffset: { width: 3, height: 2 } },
  shOffSetW3H3: { shadowOffset: { width: 3, height: 3 } },
  shOffSetW3H4: { shadowOffset: { width: 3, height: 4 } },
  shOffSetW3H5: { shadowOffset: { width: 3, height: 5 } },
  shOffSetW3H6: { shadowOffset: { width: 3, height: 6 } },
  shOffSetW3H7: { shadowOffset: { width: 3, height: 7 } },
  shOffSetW3H8: { shadowOffset: { width: 3, height: 8 } },
  shOffSetW4H0: { shadowOffset: { width: 4, height: 0 } },
  shOffSetW4H1: { shadowOffset: { width: 4, height: 1 } },
  shOffSetW4H2: { shadowOffset: { width: 4, height: 2 } },
  shOffSetW4H3: { shadowOffset: { width: 4, height: 3 } },
  shOffSetW4H4: { shadowOffset: { width: 4, height: 4 } },
  shOffSetW4H5: { shadowOffset: { width: 4, height: 5 } },
  shOffSetW4H6: { shadowOffset: { width: 4, height: 6 } },
  shOffSetW4H7: { shadowOffset: { width: 4, height: 7 } },
  shOffSetW4H8: { shadowOffset: { width: 4, height: 8 } },
} as const;


export const preDefinedStyleMap = {
  h1: $heading.h1,
  h2: $heading.h2,
  h3: $heading.h3,
  h4: $heading.h4,
  h5: $heading.h5,
  h6: $heading.h6,
  body: $heading.Body,
  body1: $heading.Body1,
  body2: $heading.Body2,
  body3: $heading.Body3,
  btn: $heading.btn,

  'wh100%': {
    width: "100%",
    height: "100%"
  },

  row: {
    display: "flex",
    flexDirection: "row",
  },
  // Row with Centered Alignment
  rowAlign: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  // Row with Items Spaced Between
  rowItemBetween: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  // Row with Items Centered Horizontally
  rowItemCenter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  // Row with Items Spaced Around
  rowItemAround: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  // Row with Items Spaced Evenly
  rowItemEvenly: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  // Row with Items Spaced Between
  rowItemAlignBetween: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Row with Items Centered Horizontally
  rowItemAlignCenter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

  },
  // Row with Items Spaced Around
  rowItemAlignAround: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

  },
  // Row with Items Spaced Evenly
  rowItemAlignEvenly: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  // Center Item Both Horizontally and Vertically
  centerItem: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
  },
  // Basic Column Layout
  column: {
    display: "flex",
    flexDirection: "column",
  },
  // Column with Centered Items Vertically
  columnAlign: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  // Column with Items Spaced Between Vertically
  columnItemBetween: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  // Column with Items Centered Horizontally
  columnItemCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  // Column with Items Spaced Around Vertically
  columnItemAround: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  // Column with Items Spaced Evenly Vertically
  columnItemEvenly: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  // Center Item Horizontally and Vertically in Column Layout
  centerColumnItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  // Column with Items Spaced Between Vertically
  columnItemAlignBetween: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Column with Items Centered Horizontally
  columnItemAlignCenter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  // Column with Items Spaced Around Vertically
  columnItemAlignAround: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",

  },
  // Column with Items Spaced Evenly Vertically
  columnItemAlignEvenly: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  // Fill Entire Available Space in Flex Container
  fillSpace: {
    flex: 1,
  },
  // Row with Wrapping Items
  rowWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  // Row with No Wrapping
  noWrap: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  // Align Item at Flex Start (Top/Left)
  alignStart: {
    display: "flex",
    alignItems: "flex-start",
  },
  // Align Item at Flex End (Bottom/Right)
  alignEnd: {
    display: "flex",
    alignItems: "flex-end",
  },
  // Stretch Items to Fill Height
  stretchItems: {
    display: "flex",
    alignItems: "stretch",
  },
  relative: { position: "relative" },
  absolute: { position: "absolute" },

  // IOS SHADOW PROPERTY 
  ...shadowOffset,


  poppins1: typography.fonts.poppins.normal,
  poppins2: typography.fonts.poppins.medium,
  poppins3: typography.fonts.poppins.semiBold,

  ffLight: { fontFamily: typography.primary.light },
  ffNormal: { fontFamily: typography.primary.normal },
  ffMedium: { fontFamily: typography.primary.medium },
  ffSemiBold: { fontFamily: typography.primary.semiBold },
  ffBold: { fontFamily: typography.primary.bold },
} as const;


export const colorMap = {
  n50: colors.palette.neutral50,
  n100: colors.palette.neutral100,
  n200: colors.palette.neutral200,
  n300: colors.palette.neutral300,
  n400: colors.palette.neutral400,
  n500: colors.palette.neutral500,
  n600: colors.palette.neutral600,
  n700: colors.palette.neutral700,
  n800: colors.palette.neutral800,
  n900: colors.palette.neutral900,
  n1000: colors.palette.neutral1000,
  n1100: colors.palette.neutral1100,

  p50: colors.palette.primary50,
  p100: colors.palette.primary100,
  p200: colors.palette.primary200,
  p300: colors.palette.primary300,
  p400: colors.palette.primary400,
  p500: colors.palette.primary500,
  p600: colors.palette.primary600,
  p700: colors.palette.primary700,
  p800: colors.palette.primary800,
  p900: colors.palette.primary900,

  unverified: "pink",  // progress
  processing: colors.palette.accent100,  // progress
  shipped: colors.palette.primary500,  // booked
  delivered: colors.palette.accent200,  // Confirmation
  cancelled: colors.palette.angry100,  // Angry color
  trnspt: colors.transparent,  //transparent

  Poppins1: typography.fonts.poppins.normal,
  Poppins2: typography.fonts.poppins.medium,
  Poppins3: typography.fonts.poppins.semiBold,

  primary1: typography.primary.light,
  primary2: typography.primary.normal,
  primary3: typography.primary.medium,
  primary4: typography.primary.semiBold,
  primary5: typography.primary.bold,
} as const;


export const styleMap = {
  // Layout Properties
  f: 'flex',               // flex
  fd: 'flexDirection',      // flexDirection
  jc: 'justifyContent',     // justifyContent
  ai: 'alignItems',         // alignItems
  as: 'alignSelf',          // alignSelf
  fWrap: 'flexWrap',        // flexWrap
  fGrow: 'flexGrow',        // flexGrow
  fShrink: 'flexShrink',    // flexShrink
  fBasis: 'flexBasis',      // flexBasis
  g: 'gap',
  // Positioning
  pos: 'position',          // position (relative/absolute)
  top: 'top',               // top
  right: 'right',           // right
  bottom: 'bottom',         // bottom
  left: 'left',             // left
  z: 'zIndex',              // zIndex

  // Dimension Properties
  w: 'width',               // width
  h: 'height',              // height
  minW: 'minWidth',         // minWidth
  minH: 'minHeight',        // minHeight
  maxW: 'maxWidth',         // maxWidth
  maxH: 'maxHeight',        // maxHeight

  // Margin and Padding
  m: 'margin',              // margin
  mt: 'marginTop',          // marginTop
  mb: 'marginBottom',       // marginBottom
  ml: 'marginLeft',         // marginLeft
  mr: 'marginRight',        // marginRight
  mv: 'marginVertical',     // marginVertical
  mh: 'marginHorizontal',   // marginHorizontal
  p: 'padding',             // padding
  pt: 'paddingTop',         // paddingTop
  pb: 'paddingBottom',      // paddingBottom
  pl: 'paddingLeft',        // paddingLeft
  pr: 'paddingRight',       // paddingRight
  pv: 'paddingVertical',    // paddingVertical
  ph: 'paddingHorizontal',  // paddingHorizontal

  // Background Properties
  bg: 'backgroundColor',    // backgroundColor
  op: 'opacity',            // opacity
  of: 'overflow',

  // Border Properties
  br: 'borderRadius',       // borderRadius
  bw: 'borderWidth',        // borderWidth
  bc: 'borderColor',        // borderColor
  btc: 'borderTopColor',        // borderColor
  bbc: 'borderBottomColor',        // borderColor
  blc: 'borderLeftColor',        // borderColor
  brc: 'borderRightColor',        // borderColor
  bt: 'borderTopWidth',     // borderTopWidth
  bb: 'borderBottomWidth',  // borderBottomWidth
  bl: 'borderLeftWidth',    // borderLeftWidth
  brw: 'borderRightWidth',  // borderRightWidth
  btlr: 'borderTopLeftRadius',  // borderTopLeftRadius
  btrr: 'borderTopRightRadius',  // borderTopRightRadius
  bbrr: 'borderBottomRightRadius',  // borderBottomRightRadius
  bblr: 'borderBottomLeftRadius',  // borderBottomLeftRadius

  // Text Properties
  fs: 'fontSize',           // fontSize
  fw: 'fontWeight',         // fontWeight
  fc: 'color',             // text color
  lh: 'lineHeight',         // lineHeight
  ta: 'textAlign',          // textAlign
  tt: 'textTransform',      // textTransform (uppercase, lowercase)
  ls: 'letterSpacing',      // letterSpacing
  ff: 'fontFamily',         // fontFamily

  // Miscellaneous Properties
  sc: 'shadowColor',        // shadowColor
  sos: 'shadowOffset',       // shadowOffset
  sr: 'shadowRadius',       // shadowRadius
  so: 'shadowOpacity',      // shadowOpacity
  el: 'elevation',          // elevation (for Android shadows)
  d: "display",
} as const;


export type preDefinedStyleMapKeys = Extract<keyof typeof preDefinedStyleMap, string>;
export type colorMapKeys = Extract<keyof typeof colorMap, string>;
export type styleMapKeys = Extract<keyof typeof styleMap, string>;


export type StyleArrayDataType = 
  | `${styleMapKeys}-`[]   
  | preDefinedStyleMapKeys[]   
  | colorMapKeys[]   
  | string[];           

