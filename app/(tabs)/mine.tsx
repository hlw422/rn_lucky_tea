import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { useAuthStore } from '../../stores/auth-store';
import { Row } from '../../components/ui/Row';

const menuItems = [
  { icon: '👤', title: '个人资料' },
  { icon: '☕', title: '咖啡钱包' },
  { icon: '🎫', title: '优惠券', route: '/coupon' },
  { icon: '🎁', title: '兑换优惠' },
  { icon: '📄', title: '发票管理' },
  { icon: '❓', title: '帮助反馈' },
];

export default function MineScreen() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      '提示',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: async () => {
            await logout();
            Alert.alert('提示', '已退出登录');
          }
        },
      ]
    );
  };

  const handleMenuPress = (item: typeof menuItems[0]) => {
    if (item.route) {
      router.push(item.route as any);
    }
  };

  const handleLoginPress = () => {
    if (!isLoggedIn) {
      router.push('/login/mail');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 用户头部 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userRow}
          onPress={handleLoginPress}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {isLoggedIn ? (user?.name?.[0] || '用') : '👤'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {isLoggedIn ? (user?.name || '用户') : '点击登录'}
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 功能菜单 */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <Row
            key={index}
            leftChild={<Text style={styles.menuIcon}>{item.icon}</Text>}
            centerChild={<Text style={styles.menuTitle}>{item.title}</Text>}
            rightChild={<Text style={styles.menuArrow}>›</Text>}
            onPress={() => handleMenuPress(item)}
            showBorder={index < menuItems.length - 1}
          />
        ))}
      </View>

      {/* 退出登录按钮 */}
      {isLoggedIn && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      )}

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
  header: {
    backgroundColor: BrandColors.backgroundDark,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  arrow: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingHorizontal: 15,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTitle: {
    fontSize: 15,
    color: BrandColors.text,
  },
  menuArrow: {
    fontSize: 20,
    color: BrandColors.textSecondary,
  },
  logoutButton: {
    marginTop: 30,
    marginHorizontal: 50,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: BrandColors.primaryLight,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: BrandColors.primaryLight,
  },
  bottomDecoration: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  bottomText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    letterSpacing: 2,
  },
});
