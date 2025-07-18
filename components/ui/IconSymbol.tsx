// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = {
  [key: string]: ComponentProps<typeof MaterialIcons>['name'];
};

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'search': 'search',
  'hand.raised.fill': 'front-hand',
  'book.fill': 'book',
  'star.fill': 'star',
  'person.2.fill': 'people',
  'ear.fill': 'hearing',
  'questionmark.circle.fill': 'help',
  'clock.fill': 'history',
  'gear': 'settings',
  'info.circle.fill': 'info',
  'envelope.fill': 'email',
  'person.fill': 'person',
  'text.bubble.fill': 'chat',
  'arrow.triangle.2.circlepath': 'speed',
  'wifi.slash': 'wifi-off',
  'key.fill': 'key',
  'play.fill': 'play-arrow',
  'square.and.arrow.up': 'share',
  'trash.fill': 'delete',
  'exclamationmark.triangle.fill': 'warning',
  'arrow.counterclockwise': 'replay',
  'close': 'close',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name] || 'help'} style={style} />;
}
