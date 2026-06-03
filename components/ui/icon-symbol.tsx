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
  // 映射图标名称到 SF Symbols (iOS) 和 Material Icons (Android/Web)
  const sfSymbolMap: Record<string, string> = {
    'house.fill': 'house.fill',
    'menu-card': 'cup.and.saucer.fill',
    'receipt': 'receipt',
    'cart': 'cart',
    'person': 'person',
  };

  const materialIconMap: Record<string, string> = {
    'house.fill': 'home',
    'menu-card': 'local-cafe',
    'receipt': 'receipt',
    'cart': 'shopping-cart',
    'person': 'person',
  };

  if (Platform.OS === 'ios') {
    const sfSymbolName = sfSymbolMap[name] || name;
    return (
      <SymbolView
        weight={weight}
        tintColor={color}
        resizeMode="scaleAspectFit"
        name={sfSymbolName as any}
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

  const materialIconName = materialIconMap[name] || 'help-outline';

  return (
    <MaterialIcons
      name={materialIconName as any}
      size={size}
      color={color}
      style={style}
    />
  );
}
