import { Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { MaterialIcons } from '@expo/vector-icons';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: string;
  size?: number;
  color: string;
  style?: any;
  weight?: string;
}) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        weight={weight}
        tintColor={color}
        resizeMode="scaleAspectFit"
        name={name as any}
        style={[
          {
            width: size,
            height: size,
          },
          style,
        ]}
      />
    );
  }

  // 映射 SF Symbols 到 Material Icons
  const iconMap: Record<string, string> = {
    'house.fill': 'home',
    'paperplane.fill': 'send',
    'chevron.left.forwardslash.chevron.right': 'code',
    'chevron.right': 'chevron-right',
    'menu': 'menu-book',
    'receipt': 'receipt',
    'cart': 'shopping-cart',
    'person': 'person',
  };

  const materialIconName = iconMap[name] || 'help-outline';

  return (
    <MaterialIcons
      name={materialIconName as any}
      size={size}
      color={color}
      style={style}
    />
  );
}
