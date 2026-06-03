import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { useCartStore } from '../../stores/cart-store';
import { CartRow } from '../../components/CartRow';
import { Button } from '../../components/ui/Button';

export default function CartScreen() {
  const router = useRouter();
  const { items, loadCart, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      '提示',
      '确定要删除这个商品吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => removeItem(itemId) },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('提示', '购物车为空，请先添加商品');
      return;
    }
    router.push('/order/confirm');
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    
    Alert.alert(
      '提示',
      '确定要清空购物车吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => clearCart() },
      ]
    );
  };

  const totalPrice = getTotalPrice();

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>购物车</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>您的购物车有点寂寞</Text>
          <Button
            title="去喝一杯"
            onPress={() => router.push('/(tabs)/menu')}
            type="outline"
            size="medium"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>购物车</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>清空</Text>
        </TouchableOpacity>
      </View>

      {/* 购物车列表 */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartRow
            item={item}
            onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
            onRemove={() => handleRemoveItem(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* 底部结算栏 */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>应付合计</Text>
          <Text style={styles.totalPrice}>¥{totalPrice.toFixed(2)}</Text>
        </View>
        <Button
          title="去结算"
          onPress={handleCheckout}
          size="large"
          style={styles.checkoutButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.backgroundSecondary,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
  },
  clearText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: BrandColors.textSecondary,
    marginBottom: 30,
  },
  listContent: {
    paddingBottom: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.text,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  checkoutButton: {
    width: '100%',
  },
});
