import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BrandColors } from '../constants/colors';
import type { Store } from '../types';

interface AddressRowProps {
  store: Store;
  onPress: () => void;
}

export const AddressRow: React.FC<AddressRowProps> = ({
  store,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📍</Text>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name}>{store.name}</Text>
        <Text style={styles.address} numberOfLines={1}>{store.address}</Text>
        <Text style={styles.hours}>营业时间: {store.businessHours}</Text>
      </View>
      
      <View style={styles.right}>
        <Text style={styles.distance}>{store.distanceText || '未知'}</Text>
      </View>
    </TouchableOpacity>
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
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BrandColors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    marginBottom: 2,
  },
  hours: {
    fontSize: 12,
    color: BrandColors.textSecondary,
  },
  right: {
    justifyContent: 'center',
  },
  distance: {
    fontSize: 13,
    color: BrandColors.primary,
    fontWeight: '600',
  },
});
