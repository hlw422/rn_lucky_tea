import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { useOrderStore } from '../../stores/order-store';
import { useAuthStore } from '../../stores/auth-store';
import { OrderListRow } from '../../components/OrderListRow';

type OrderStatus = 'all' | 'pending' | 'completed';

export default function OrderScreen() {
  const router = useRouter();
  const { orders, isLoading, loadOrders } = useOrderStore();
  const { isLoggedIn } = useAuthStore();
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');

  useEffect(() => {
    if (isLoggedIn) {
      loadOrders();
    }
  }, [isLoggedIn]);

  const tabs: { key: OrderStatus; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '未完成' },
    { key: 'completed', label: '已完成' },
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const handleTabPress = (tab: OrderStatus) => {
    setActiveTab(tab);
    if (isLoggedIn) {
      loadOrders(tab === 'all' ? undefined : tab);
    }
  };

  const handleOrderPress = (orderId: number) => {
    router.push(`/order/detail?id=${orderId}`);
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>订单列表</Text>
        </View>
        <View style={styles.loginPrompt}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.loginText}>请先登录</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login/mail')}
          >
            <Text style={styles.loginButtonText}>去登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>订单列表</Text>
      </View>

      {/* Tab 切换 */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            onPress={() => handleTabPress(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 订单列表 */}
      {isLoading ? (
        <ActivityIndicator size="large" color={BrandColors.primary} style={styles.loading} />
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>暂无订单</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OrderListRow
              order={item}
              onPress={() => handleOrderPress(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: BrandColors.primary,
  },
  tabText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  tabTextActive: {
    color: BrandColors.primary,
    fontWeight: '600',
  },
  loading: {
    marginTop: 50,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: BrandColors.textSecondary,
  },
  listContent: {
    paddingVertical: 10,
  },
  loginPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  loginText: {
    fontSize: 16,
    color: BrandColors.textSecondary,
    marginBottom: 20,
  },
  loginButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: BrandColors.primary,
    borderRadius: 25,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
