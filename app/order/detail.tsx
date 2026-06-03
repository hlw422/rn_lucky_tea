import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BrandColors, StatusColors } from '../../constants/colors';
import { useOrderStore } from '../../stores/order-store';
import { Button } from '../../components/ui/Button';

const statusTextMap: Record<string, string> = {
  pending: '待完成',
  completed: '已完成',
  cancelled: '已取消',
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useOrderStore();

  const order = orders.find(o => o.id === Number(id));

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>订单详情</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>订单不存在</Text>
        </View>
      </View>
    );
  }

  const handleEvaluate = () => {
    router.push(`/order/evaluate?orderId=${order.id}`);
  };

  const handleGetDiningCode = () => {
    router.push(`/dining-code?orderNum=${order.orderNum}`);
  };

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>订单详情</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* 订单状态 */}
        <View style={[styles.statusSection, { backgroundColor: StatusColors[order.status] }]}>
          <Text style={styles.statusText}>{statusTextMap[order.status]}</Text>
          <Text style={styles.statusDesc}>
            {order.status === 'pending' ? '请尽快到店取餐' : '感谢您的光临'}
          </Text>
        </View>

        {/* 订单信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>订单信息</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>订单号</Text>
            <Text style={styles.infoValue}>{order.orderNum}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>下单时间</Text>
            <Text style={styles.infoValue}>{order.time}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>商品</Text>
            <Text style={styles.infoValue}>{order.goodsName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>取餐地址</Text>
            <Text style={styles.infoValue}>{order.address}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>订单金额</Text>
            <Text style={styles.priceValue}>¥{Number(order.price).toFixed(2)}</Text>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          {order.status === 'pending' && (
            <Button
              title="查看取餐码"
              onPress={handleGetDiningCode}
              size="large"
              style={styles.actionButton}
            />
          )}
          
          {order.status === 'completed' && (
            <Button
              title="评价订单"
              onPress={handleEvaluate}
              type="outline"
              size="large"
              style={styles.actionButton}
            />
          )}
        </View>
      </ScrollView>
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: BrandColors.textSecondary,
  },
  statusSection: {
    padding: 30,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  statusDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: BrandColors.text,
    flex: 1,
    textAlign: 'right',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  actions: {
    padding: 20,
    gap: 15,
  },
  actionButton: {
    width: '100%',
  },
});
