import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { AddressRow } from '../../components/AddressRow';
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

export default function StoreListScreen() {
  const router = useRouter();

  const handleStorePress = (store: Store) => {
    router.push(`/store/detail?id=${store.id}`);
  };

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>选择门店</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 门店列表 */}
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AddressRow
            store={item}
            onPress={() => handleStorePress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    paddingVertical: 10,
  },
});
