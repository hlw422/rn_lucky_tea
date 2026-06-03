import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BrandColors, StatusColors } from '../constants/colors';
import type { Order } from '../types';

interface OrderListRowProps {
  order: Order;
  onPress: () => void;
}

const statusTextMap: Record<string, string> = {
  pending: '待完成',
  completed: '已完成',
  cancelled: '已取消',
};

export const OrderListRow: React.FC<OrderListRowProps> = ({
  order,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.orderNum}>订单号: {order.orderNum}</Text>
        <View style={[styles.statusBadge, { backgroundColor: StatusColors[order.status] + '20' }]}>
          <Text style={[styles.statusText, { color: StatusColors[order.status] }]}>
            {statusTextMap[order.status]}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.goodsName} numberOfLines={1}>
          {order.goodsName}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {order.address}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.time}>{order.time}</Text>
        <Text style={styles.price}>¥{Number(order.price).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNum: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    marginBottom: 12,
  },
  goodsName: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 4,
  },
  address: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
    paddingTop: 12,
  },
  time: {
    fontSize: 12,
    color: BrandColors.textSecondary,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.primary,
  },
});
