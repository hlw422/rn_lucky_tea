import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { useCartStore } from '../../stores/cart-store';
import { useOrderStore } from '../../stores/order-store';
import { Button } from '../../components/ui/Button';
import { Row } from '../../components/ui/Row';

export default function OrderConfirmScreen() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storeInfo = {
    name: '青年汇店(No.1795)',
    address: '北京市朝阳区青年路青年汇佳园底商',
  };

  const totalPrice = getTotalPrice();
  const deliveryFee = 0;
  const discount = 5;
  const finalPrice = totalPrice + deliveryFee - discount;

  const handleConfirm = async () => {
    if (items.length === 0) {
      Alert.alert('提示', '购物车为空');
      return;
    }

    setIsSubmitting(true);
    try {
      const goodsName = items.map(item => item.name).join('、');
      await createOrder({
        address: storeInfo.address,
        goodsName,
        price: finalPrice,
      });
      
      await clearCart();
      
      Alert.alert(
        '下单成功',
        '您的订单已提交',
        [
          { 
            text: '查看订单', 
            onPress: () => router.replace('/(tabs)/order') 
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '下单失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>确认订单</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* 门店信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>取餐门店</Text>
          <Row
            leftChild={<Text style={styles.storeIcon}>📍</Text>}
            centerChild={
              <View>
                <Text style={styles.storeName}>{storeInfo.name}</Text>
                <Text style={styles.storeAddress}>{storeInfo.address}</Text>
              </View>
            }
            rightChild={<Text style={styles.arrow}>›</Text>}
            onPress={() => router.push('/store')}
          />
        </View>

        {/* 取餐时间 */}
        <View style={styles.section}>
          <Row
            leftChild={<Text style={styles.timeIcon}>⏰</Text>}
            centerChild={
              <View>
                <Text style={styles.timeTitle}>取餐时间</Text>
                <Text style={styles.timeValue}>立即取餐 (约15分钟)</Text>
              </View>
            }
            rightChild={<Text style={styles.arrow}>›</Text>}
          />
        </View>

        {/* 商品列表 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>商品清单</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.goodsItem}>
              <Text style={styles.goodsName}>{item.name}</Text>
              <Text style={styles.goodsSpec}>
                {item.temperature} / {item.sweetness} / {item.size}
              </Text>
              <View style={styles.goodsBottom}>
                <Text style={styles.goodsPrice}>¥{Number(item.price).toFixed(2)}</Text>
                <Text style={styles.goodsQuantity}>x{item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 备注 */}
        <TouchableOpacity 
          style={styles.section}
          onPress={() => router.push('/order/remark')}
        >
          <Row
            centerChild={<Text style={styles.remarkText}>添加备注</Text>}
            rightChild={<Text style={styles.arrow}>›</Text>}
          />
        </TouchableOpacity>
      </ScrollView>

      {/* 底部结算 */}
      <View style={styles.footer}>
        <View style={styles.priceDetails}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>商品合计</Text>
            <Text style={styles.priceValue}>¥{totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>配送费</Text>
            <Text style={styles.priceValue}>¥{deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>优惠</Text>
            <Text style={styles.discountValue}>-¥{discount.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.bottomRow}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>应付</Text>
            <Text style={styles.totalPrice}>¥{finalPrice.toFixed(2)}</Text>
          </View>
          <Button
            title="提交订单"
            onPress={handleConfirm}
            loading={isSubmitting}
            size="large"
            style={styles.confirmButton}
          />
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    color: BrandColors.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 12,
  },
  storeIcon: {
    fontSize: 20,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  timeIcon: {
    fontSize: 20,
  },
  timeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 13,
    color: BrandColors.primary,
  },
  arrow: {
    fontSize: 20,
    color: BrandColors.textSecondary,
  },
  goodsItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  goodsName: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 4,
  },
  goodsSpec: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginBottom: 8,
  },
  goodsBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goodsPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  goodsQuantity: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  remarkText: {
    fontSize: 15,
    color: BrandColors.textSecondary,
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
  },
  priceDetails: {
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    color: BrandColors.text,
  },
  discountValue: {
    fontSize: 14,
    color: BrandColors.success,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: 16,
    color: BrandColors.text,
    marginRight: 8,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  confirmButton: {
    width: 150,
  },
});
