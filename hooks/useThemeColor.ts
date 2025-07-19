/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import Colors from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

type ColorProps = {
  light?: string | string[];
  dark?: string | string[];
};

type ColorKeys = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(
  props: ColorProps,
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
