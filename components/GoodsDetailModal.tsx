import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  Modal, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView 
} from 'react-native';
import { BrandColors } from '../constants/colors';
import { SelectRow } from './ui/SelectRow';
import { Stepper } from './ui/Stepper';
import { Button } from './ui/Button';
import { useCartStore } from '../stores/cart-store';
import type { Goods } from '../types';

interface GoodsDetailModalProps {
  visible: boolean;
  goods: Goods | null;
  onClose: () => void;
}

const temperatureOptions = ['热', '温', '冰', '去冰'];
const sweetnessOptions = ['标准糖', '少糖', '半糖', '微糖', '无糖'];
const sizeOptions = ['中杯', '大杯', '超大杯'];

export const GoodsDetailModal: React.FC<GoodsDetailModalProps> = ({
  visible,
  goods,
  onClose,
}) => {
  const [temperature, setTemperature] = useState('热');
  const [sweetness, setSweetness] = useState('标准糖');
  const [size, setSize] = useState('中杯');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  if (!goods) return null;

  const handleAddToCart = async () => {
    await addItem({
      goodsId: goods.id,
      name: goods.name,
      price: Number(goods.originalPrice),
      quantity,
      pic: goods.pic,
      temperature,
      sweetness,
      size,
    });
    onClose();
    setQuantity(1);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: goods.pic || 'https://placehold.co/400x300/f5f5f5/999?text=咖啡' }}
              style={styles.image}
            />
            
            <View style={styles.content}>
              <Text style={styles.name}>{goods.name}</Text>
              {goods.characteristic && (
                <Text style={styles.description}>{goods.characteristic}</Text>
              )}
              <Text style={styles.price}>¥{Number(goods.originalPrice).toFixed(2)}</Text>
              
              <View style={styles.divider} />
              
              <SelectRow
                title="温度"
                options={temperatureOptions}
                selected={temperature}
                onSelect={setTemperature}
              />
              
              <SelectRow
                title="糖度"
                options={sweetnessOptions}
                selected={sweetness}
                onSelect={setSweetness}
              />
              
              <SelectRow
                title="杯型"
                options={sizeOptions}
                selected={size}
                onSelect={setSize}
              />
              
              <View style={styles.quantityRow}>
                <Text style={styles.quantityLabel}>数量</Text>
                <Stepper
                  value={quantity}
                  min={1}
                  max={10}
                  onChange={setQuantity}
                />
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>合计</Text>
              <Text style={styles.totalPrice}>
                ¥{(Number(goods.originalPrice) * quantity).toFixed(2)}
              </Text>
            </View>
            <Button
              title="加入购物车"
              onPress={handleAddToCart}
              size="large"
              style={styles.addButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
  },
  closeText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: BrandColors.backgroundSecondary,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: BrandColors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.primary,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: BrandColors.borderLight,
    marginBottom: 20,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: BrandColors.borderLight,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: BrandColors.text,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: BrandColors.primary,
  },
  addButton: {
    width: '100%',
  },
});
