import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Share 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BrandColors } from '../constants/colors';
import { Button } from '../components/ui/Button';

export default function DiningCodeScreen() {
  const router = useRouter();
  const { orderNum } = useLocalSearchParams<{ orderNum?: string }>();
  
  const [diningCode, setDiningCode] = useState('');
  const [countdown, setCountdown] = useState(300); // 5分钟倒计时

  useEffect(() => {
    // 生成随机取餐码
    const code = Math.floor(100 + Math.random() * 900).toString();
    setDiningCode(code);
    
    // 倒计时
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `我的取餐码是: ${diningCode}，请尽快到店取餐！`,
      });
    } catch (error) {
      Alert.alert('错误', '分享失败');
    }
  };

  const handleRefresh = () => {
    const newCode = Math.floor(100 + Math.random() * 900).toString();
    setDiningCode(newCode);
    setCountdown(300);
  };

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>取餐码</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* 取餐码展示 */}
        <View style={styles.codeSection}>
          <Text style={styles.codeTitle}>您的取餐码</Text>
          <Text style={styles.codeNumber}>{diningCode}</Text>
          <Text style={styles.codeHint}>
            请向店员出示此取餐码
          </Text>
        </View>

        {/* 倒计时 */}
        <View style={styles.timerSection}>
          <Text style={styles.timerLabel}>有效期剩余</Text>
          <Text style={styles.timerValue}>{formatTime(countdown)}</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <Text style={styles.refreshText}>刷新取餐码</Text>
          </TouchableOpacity>
        </View>

        {/* 订单信息 */}
        {orderNum && (
          <View style={styles.orderSection}>
            <Text style={styles.orderLabel}>关联订单</Text>
            <Text style={styles.orderNum}>{orderNum}</Text>
          </View>
        )}

        {/* 操作按钮 */}
        <View style={styles.actions}>
          <Button
            title="分享餐码给好友"
            onPress={handleShare}
            type="outline"
            size="large"
            style={styles.shareButton}
          />
        </View>

        {/* 提示信息 */}
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>温馨提示</Text>
          <Text style={styles.tipsText}>1. 取餐码有效期为5分钟</Text>
          <Text style={styles.tipsText}>2. 请在有效期内到店取餐</Text>
          <Text style={styles.tipsText}>3. 如需帮助请联系店员</Text>
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
    padding: 20,
  },
  codeSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  codeTitle: {
    fontSize: 16,
    color: BrandColors.textSecondary,
    marginBottom: 15,
  },
  codeNumber: {
    fontSize: 72,
    fontWeight: '700',
    color: BrandColors.primary,
    letterSpacing: 10,
    marginBottom: 15,
  },
  codeHint: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  timerSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 36,
    fontWeight: '700',
    color: BrandColors.warning,
    marginBottom: 15,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  refreshText: {
    fontSize: 14,
    color: BrandColors.primary,
  },
  orderSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  orderLabel: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginBottom: 8,
  },
  orderNum: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.text,
  },
  actions: {
    marginBottom: 30,
  },
  shareButton: {
    width: '100%',
  },
  tips: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});
