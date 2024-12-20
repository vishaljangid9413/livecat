import { TextStyle } from "react-native"
import { colors } from "./colors"
import { typography } from "./typography"

export const $textAlign = {
  center: {
    textAlign: "center",
  } as TextStyle,
}

export const $heading = {
  title: {
    fontFamily: typography.primary.normal,
    fontWeight: "600",
    fontSize: 32,
    lineHeight: 32,
  } as TextStyle,
  h1: {
    fontFamily: typography.primary.normal,
    fontWeight: "600",
    fontSize: 24,
    lineHeight: 29,
  } as TextStyle,
  h2: {
    fontFamily: typography.primary.normal,
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 26,
  } as TextStyle,
  h3: {
    fontFamily: typography.primary.normal,
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 23.4,
  } as TextStyle,
  h4: {
    fontFamily: typography.primary.normal,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  h5: {
    fontFamily: typography.primary.normal,
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 21,
  } as TextStyle,
  h6: {
    fontFamily: typography.primary.normal,
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 18,
  } as TextStyle,
  Body: {
    fontFamily: typography.primary.normal,
    fontWeight:"600",
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  Body1: {
    fontFamily: typography.primary.normal,
    fontWeight:"600",
    fontSize: 14,
    lineHeight: 21,
  } as TextStyle,
  Body2: {
    fontFamily: typography.primary.normal,
    fontWeight:"600",
    fontSize: 12,
    lineHeight: 18,
  } as TextStyle,
  Body3: {
    fontFamily: typography.primary.normal,
    fontWeight:"600",
    fontSize: 10,
    lineHeight: 15,
  } as TextStyle,
  btn: {
    fontFamily: typography.primary.normal,
    fontWeight:"600",
    fontSize: 14,
    lineHeight: 21,
  } as TextStyle,
}

export const $secondaryText = {
  text1: {
    fontFamily: typography.primary.normal,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: 21,
    color: colors.palette.neutral600, //#8C8C8C
  } as TextStyle,
}

export const $focus = {
  color: {
    color: colors.palette.primary400
  },
  border: {
    borderColor: colors.palette.primary400
  }
}

export const $link = [
    $secondaryText.text1,
]
