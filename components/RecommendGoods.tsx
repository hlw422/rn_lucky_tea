import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BrandColors } from '../constants/colors';
import type { Goods } from '../types';

interface RecommendGoodsProps {
  goods: Goods;
  onPress: () => void;
}

export const RecommendGoods: React.FC<RecommendGoodsProps> = ({
  goods,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={{ uri: goods.pic || 'https://placehold.co/120x120/f5f5f5/999?text=咖啡' }}
        style={styles.image}
      />
      <Text style={styles.name} numberOfLines={2}>{goods.name}</Text>
      <Text style={styles.price}>¥{Number(goods.originalPrice).toFixed(2)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: BrandColors.backgroundSecondary,
    marginBottom: 8,
  },
  name: {
    fontSize: 13,
    color: BrandColors.text,
    textAlign: 'center',
    marginBottom: 4,
    height: 36,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: BrandColors.primary,
  },
});
