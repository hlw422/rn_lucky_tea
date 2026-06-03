import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Linking 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import type { Store } from '../../types';

// 门店数据（本地数据源）
const stores: Store[] = [
  {
    id: 1,
    name: '青年汇店(No.1795)',
    address: '北京市朝阳区青年路青年汇佳园底商',
    distance: '53m',
    businessHours: '07:00-22:00',
    phone: '010-12345678',
  },
  {
    id: 2,
    name: '国贸店(No.1234)',
    address: '北京市朝阳区国贸大厦B座1层',
    distance: '1.2km',
    businessHours: '07:30-21:00',
    phone: '010-87654321',
  },
  {
    id: 3,
    name: '三里屯店(No.5678)',
    address: '北京市朝阳区三里屯太古里南区',
    distance: '2.5km',
    businessHours: '08:00-23:00',
    phone: '010-11223344',
  },
  {
    id: 4,
    name: '望京店(No.9012)',
    address: '北京市朝阳区望京SOHO T1',
    distance: '3.8km',
    businessHours: '07:00-21:30',
    phone: '010-55667788',
  },
  {
    id: 5,
    name: '中关村店(No.3456)',
    address: '北京市海淀区中关村大街1号',
    distance: '5.2km',
    businessHours: '07:30-22:00',
    phone: '010-99887766',
  },
];

export default function StoreDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const store = stores.find(s => s.id === Number(id));

  if (!store) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>门店详情</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>门店不存在</Text>
        </View>
      </View>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${store.phone}`);
  };

  const handleNavigate = () => {
    // 打开地图导航
    Alert.alert('提示', '正在打开导航...');
  };

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>门店详情</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* 门店地图占位 */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>🗺️</Text>
          <Text style={styles.mapText}>地图加载中...</Text>
        </View>

        {/* 门店信息 */}
        <View style={styles.section}>
          <Text style={styles.storeName}>{store.name}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{store.address}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⏰</Text>
            <Text style={styles.infoText}>营业时间: {store.businessHours}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📞</Text>
            <Text style={styles.infoText}>{store.phone}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📏</Text>
            <Text style={styles.infoText}>距离您: {store.distance}</Text>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          <Button
            title="拨打电话"
            onPress={handleCall}
            type="outline"
            size="large"
            style={styles.actionButton}
          />
          <Button
            title="导航到店"
            onPress={handleNavigate}
            size="large"
            style={styles.actionButton}
          />
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
  mapPlaceholder: {
    height: 200,
    backgroundColor: BrandColors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  mapText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '700',
    color: BrandColors.text,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    fontSize: 15,
    color: BrandColors.text,
    flex: 1,
    lineHeight: 22,
  },
  actions: {
    padding: 20,
    gap: 15,
  },
  actionButton: {
    width: '100%',
  },
});
