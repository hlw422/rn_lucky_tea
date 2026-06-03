import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BrandColors } from '../constants/colors';
import type { Coupon } from '../types';

interface CouponCardProps {
  coupon: Coupon;
  isSaved: boolean;
  onSave: () => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  isSaved,
  onSave,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.discount}>¥{coupon.discount}</Text>
        <Text style={styles.category}>{coupon.category || '全场通用'}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.right}>
        <Text style={styles.name} numberOfLines={1}>{coupon.name}</Text>
        <Text style={styles.expire}>有效期至: {coupon.expireDate}</Text>
        
        <TouchableOpacity
          style={[styles.saveButton, isSaved && styles.saveButtonDisabled]}
          onPress={onSave}
          disabled={isSaved}
        >
          <Text style={[styles.saveText, isSaved && styles.saveTextDisabled]}>
            {isSaved ? '已领取' : '立即领取'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  left: {
    width: 100,
    backgroundColor: BrandColors.primary,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  category: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  divider: {
    width: 1,
    backgroundColor: BrandColors.borderLight,
    marginVertical: 10,
  },
  right: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 6,
  },
  expire: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginBottom: 10,
  },
  saveButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: BrandColors.primary,
    borderRadius: 15,
  },
  saveButtonDisabled: {
    backgroundColor: BrandColors.backgroundSecondary,
  },
  saveText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  saveTextDisabled: {
    color: BrandColors.disabled,
  },
});
