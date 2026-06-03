import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../constants/colors';
import { useCouponStore } from '../stores/coupon-store';
import { useAuthStore } from '../stores/auth-store';
import { CouponCard } from '../components/CouponCard';

export default function CouponScreen() {
  const router = useRouter();
  const { coupons, isLoading, loadCoupons, saveCoupon, isCouponSaved, loadSavedCoupons } = useCouponStore();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      loadCoupons();
      loadSavedCoupons();
    }
  }, [isLoggedIn]);

  const handleSaveCoupon = (couponId: number) => {
    if (!isLoggedIn) {
      Alert.alert('提示', '请先登录', [
        { text: '取消', style: 'cancel' },
        { text: '去登录', onPress: () => router.push('/login/mail') },
      ]);
      return;
    }
    
    saveCoupon(couponId);
    Alert.alert('提示', '优惠券已领取');
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        {/* 顶部标题 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>优惠券</Text>
          <View style={styles.placeholder} />
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>优惠券</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 优惠券列表 */}
      {isLoading ? (
        <ActivityIndicator size="large" color={BrandColors.primary} style={styles.loading} />
      ) : coupons.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎫</Text>
          <Text style={styles.emptyText}>暂无可用优惠券</Text>
        </View>
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CouponCard
              coupon={item}
              isSaved={isCouponSaved(item.id)}
              onSave={() => handleSaveCoupon(item.id)}
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
  loading: {
    marginTop: 50,
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
