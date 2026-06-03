import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { Button } from '../../components/ui/Button';

const quickRemarks = [
  '少冰', '去冰', '多冰', '热一点',
  '少糖', '半糖', '无糖',
  '多奶', '少奶',
  '分开装', '不要吸管',
];

export default function OrderRemarkScreen() {
  const router = useRouter();
  const [remark, setRemark] = useState('');
  const [selectedRemarks, setSelectedRemarks] = useState<string[]>([]);

  const handleToggleRemark = (item: string) => {
    setSelectedRemarks(prev => 
      prev.includes(item) 
        ? prev.filter(r => r !== item)
        : [...prev, item]
    );
  };

  const handleSave = () => {
    const finalRemark = [...selectedRemarks, remark].filter(Boolean).join('，');
    if (finalRemark) {
      Alert.alert('提示', '备注已保存');
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>订单备注</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* 快捷备注 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷备注</Text>
          <View style={styles.quickRemarks}>
            {quickRemarks.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.quickRemarkItem,
                  selectedRemarks.includes(item) && styles.quickRemarkItemActive,
                ]}
                onPress={() => handleToggleRemark(item)}
              >
                <Text
                  style={[
                    styles.quickRemarkText,
                    selectedRemarks.includes(item) && styles.quickRemarkTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 自定义备注 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>其他备注</Text>
          <TextInput
            style={styles.input}
            placeholder="请输入您的备注..."
            placeholderTextColor={BrandColors.textSecondary}
            value={remark}
            onChangeText={setRemark}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* 保存按钮 */}
        <Button
          title="保存备注"
          onPress={handleSave}
          size="large"
          style={styles.saveButton}
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
  },
  quickRemarks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickRemarkItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BrandColors.border,
    backgroundColor: '#fff',
  },
  quickRemarkItemActive: {
    borderColor: BrandColors.primary,
    backgroundColor: 'rgba(43, 76, 126, 0.1)',
  },
  quickRemarkText: {
    fontSize: 13,
    color: BrandColors.text,
  },
  quickRemarkTextActive: {
    color: BrandColors.primary,
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
  saveButton: {
    width: '100%',
  },
});
