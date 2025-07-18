/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import Colors from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

type ColorKeys = Exclude<keyof typeof Colors.light, 'gray'>;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorKeys
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
