import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { BrandColors } from '../constants/colors';
import { Stepper } from './ui/Stepper';
import type { CartItem } from '../types';

interface CartRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartRow: React.FC<CartRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.pic || 'https://placehold.co/80x80/f5f5f5/999?text=商品' }}
        style={styles.image}
      />
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        
        <View style={styles.tags}>
          {item.temperature && (
            <Text style={styles.tag}>{item.temperature}</Text>
          )}
          {item.sweetness && (
            <Text style={styles.tag}>{item.sweetness}</Text>
          )}
          {item.size && (
            <Text style={styles.tag}>{item.size}</Text>
          )}
        </View>
        
        <View style={styles.bottom}>
          <Text style={styles.price}>¥{Number(item.price).toFixed(2)}</Text>
          <Stepper
            value={item.quantity}
            min={1}
            onChange={onUpdateQuantity}
          />
        </View>
      </View>
      
      <TouchableOpacity style={styles.deleteButton} onPress={onRemove}>
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: BrandColors.backgroundSecondary,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 6,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    fontSize: 11,
    color: BrandColors.textSecondary,
    backgroundColor: BrandColors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 20,
    color: BrandColors.textSecondary,
  },
});
