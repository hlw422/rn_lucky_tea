import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { Swiper } from '../../components/ui/Swiper';
import { Row } from '../../components/ui/Row';
import { TakeOutToggle } from '../../components/TakeOutToggle';
import { useStoreStore } from '../../stores/store-store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const bannerImages = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
];

const quickActions = [
  { icon: '🛍️', title: '现在下单', desc: 'ORDER NOW', route: '/(tabs)/menu' },
  { icon: '☕', title: '咖啡钱包', desc: 'COFFEE WALLET' },
  { icon: '🎁', title: '送Ta咖啡', desc: 'SEND COFFEE' },
  { icon: '🏢', title: '企业账号', desc: 'ENTERPRISE ACCOUNT' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const { stores, fetchStores } = useStoreStore();

  useEffect(() => {
    fetchStores();
  }, []);

  // 获取最近的门店
  const nearestStore = stores.length > 0 ? stores[0] : null;

  return (
    <ScrollView style={styles.container}>
      {/* 轮播 Banner */}
      <View style={styles.bannerContainer}>
        <Swiper images={bannerImages} height={220} />
      </View>

      {/* 自提/外送切换 */}
      <View style={styles.toggleContainer}>
        <TakeOutToggle value={orderType} onChange={setOrderType} />
      </View>

      {/* 门店信息 */}
      <View style={styles.storeInfo}>
        <Row
          leftChild={
            <View>
              <Text style={styles.storeName}>
                {nearestStore ? nearestStore.name : '加载中...'}
              </Text>
              <Text style={styles.storeDistance}>
                {nearestStore?.distanceText ? `距您${nearestStore.distanceText}` : '获取位置中...'}
              </Text>
            </View>
          }
          rightChild={
            <TouchableOpacity style={styles.scanButton}>
              <Text style={styles.scanIcon}>📷</Text>
            </TouchableOpacity>
          }
          height={60}
          onPress={() => router.push('/store')}
        />
      </View>

      {/* 快捷入口 */}
      <View style={styles.quickActions}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={() => action.route && router.push(action.route as any)}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>{action.icon}</Text>
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionDesc}>{action.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 底部装饰 */}
      <View style={styles.bottomDecoration}>
        <Text style={styles.bottomText}>LUCKIN COFFEE</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BrandColors.backgroundSecondary,
  },
  bannerContainer: {
    marginBottom: 0,
  },
  toggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  storeInfo: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 15,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.text,
  },
  storeDistance: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  scanButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: {
    fontSize: 20,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    gap: 15,
  },
  actionItem: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BrandColors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 11,
    color: BrandColors.textSecondary,
  },
  bottomDecoration: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  bottomText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    letterSpacing: 2,
  },
});
