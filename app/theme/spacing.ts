import { StyleProp, TextStyle, ViewStyle } from "react-native"

/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
export const spacing = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const

export type Spacing = keyof typeof spacing


export const gap = {
  normal: {gap: spacing.xs} as StyleProp<ViewStyle>,
  medium: {gap: spacing.xl} as StyleProp<ViewStyle>
}

export const borderRadius = {
  normal: {borderRadius: spacing.xs} as TextStyle,
  large: {borderRadius: 100} as TextStyle,
}