import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';

export default function OrderEvaluateScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 模拟提交评价
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        '评价成功',
        '感谢您的评价',
        [
          { 
            text: '确定', 
            onPress: () => router.back() 
          },
        ]
      );
    } catch (error) {
      Alert.alert('错误', '提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Text style={[
              styles.star,
              star <= rating && styles.starActive
            ]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>评价订单</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* 评分 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>请为本次服务评分</Text>
          {renderStars()}
          <Text style={styles.ratingText}>
            {rating === 5 ? '非常满意' : 
             rating === 4 ? '满意' : 
             rating === 3 ? '一般' : 
             rating === 2 ? '不满意' : '非常不满意'}
          </Text>
        </View>

        {/* 评论 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>分享您的体验（选填）</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入您的评价..."
            placeholderTextColor={BrandColors.textSecondary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* 提交按钮 */}
        <Button
          title="提交评价"
          onPress={handleSubmit}
          loading={isSubmitting}
          size="large"
          style={styles.submitButton}
        />
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 40,
    color: BrandColors.border,
  },
  starActive: {
    color: '#FFD700',
  },
  ratingText: {
    fontSize: 16,
    color: BrandColors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    height: 100,
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    color: BrandColors.text,
  },
  submitButton: {
    width: '100%',
  },
});
