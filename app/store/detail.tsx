import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  Linking,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { useStoreStore } from '../../stores/store-store';
import { openNavigation } from '../../utils/location';

// Web端不导入react-native-maps
let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
  try {
    const maps = require('react-native-maps');
    MapView = maps.default;
    Marker = maps.Marker;
  } catch (e) {
    console.log('react-native-maps not available');
  }
}

export default function StoreDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedStore: store, loading, error, fetchStoreById } = useStoreStore();

  useEffect(() => {
    if (id) {
      fetchStoreById(Number(id));
    }
  }, [id]);

  const handleCall = () => {
    if (store?.phone) {
      Linking.openURL(`tel:${store.phone}`);
    }
  };

  const handleNavigate = async () => {
    if (store) {
      await openNavigation(store.latitude, store.longitude, store.name);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>门店详情</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={BrandColors.primary} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (error || !store) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>门店详情</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || '门店不存在'}</Text>
        </View>
      </View>
    );
  }

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
        {/* 地图区域 */}
        <View style={styles.mapContainer}>
          {Platform.OS !== 'web' ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: store.latitude,
                longitude: store.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: store.latitude,
                  longitude: store.longitude,
                }}
                title={store.name}
                description={store.address}
              />
            </MapView>
          ) : (
            // Web 端显示静态地图占位
            <View style={styles.mapWebPlaceholder}>
              <Text style={styles.mapIcon}>📍</Text>
              <Text style={styles.mapWebText}>地图仅在移动设备显示</Text>
              <Text style={styles.mapWebHint}>点击下方按钮打开导航</Text>
            </View>
          )}
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
          
          {store.distanceText && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📏</Text>
              <Text style={styles.infoText}>距离您: {store.distanceText}</Text>
            </View>
          )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: BrandColors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
  },
  mapContainer: {
    height: 250,
    backgroundColor: '#e8e8e8',
  },
  map: {
    flex: 1,
  },
  mapWebPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  mapWebText: {
    fontSize: 16,
    color: BrandColors.text,
    marginBottom: 5,
  },
  mapWebHint: {
    fontSize: 13,
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
