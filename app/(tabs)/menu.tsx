import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  SectionList,
  NativeSyntheticEvent,
  NativeScrollEvent 
} from 'react-native';
import { BrandColors } from '../../constants/colors';
import { useGoodsStore } from '../../stores/goods-store';
import { GoodsDetailModal } from '../../components/GoodsDetailModal';
import type { Goods } from '../../types';

export default function MenuScreen() {
  const { 
    categories, 
    goodsList, 
    selectedCategoryId, 
    isLoading, 
    isLoadingGoods,
    loadCategories,
    selectCategory 
  } = useGoodsStore();

  const [selectedGoods, setSelectedGoods] = useState<Goods | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const sectionListRef = useRef<SectionList>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  // 按分类组织商品数据
  const sections = categories.map(category => ({
    title: category.name,
    data: goodsList.filter(goods => goods.categoryId === category.id),
    category,
  }));

  const handleCategoryPress = (categoryId: number) => {
    selectCategory(categoryId);
    
    // 滚动到对应的 section
    const sectionIndex = sections.findIndex(s => s.category.id === categoryId);
    if (sectionIndex >= 0 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        animated: true,
      });
    }
  };

  const handleGoodsPress = (goods: Goods) => {
    setSelectedGoods(goods);
    setModalVisible(true);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isScrolling) return;
    
    // 根据滚动位置更新选中的分类
    const offsetY = event.nativeEvent.contentOffset.y;
    let currentCategoryIndex = 0;
    let accumulatedHeight = 0;
    
    for (let i = 0; i < sections.length; i++) {
      const sectionHeight = 40 + sections[i].data.length * 100; // 标题高度 + 商品高度
      if (offsetY < accumulatedHeight + sectionHeight) {
        currentCategoryIndex = i;
        break;
      }
      accumulatedHeight += sectionHeight;
      if (i === sections.length - 1) {
        currentCategoryIndex = i;
      }
    }
    
    const currentCategoryId = sections[currentCategoryIndex]?.category?.id;
    if (currentCategoryId && currentCategoryId !== selectedCategoryId) {
      selectCategory(currentCategoryId);
    }
  };

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.category.desc && (
        <Text style={styles.sectionDesc}>{section.category.desc}</Text>
      )}
    </View>
  );

  const renderGoodsItem = ({ item }: { item: Goods }) => (
    <TouchableOpacity
      style={styles.goodsItem}
      onPress={() => handleGoodsPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.goodsImagePlaceholder}>
        <Text style={styles.goodsImageText}>☕</Text>
      </View>
      <View style={styles.goodsInfo}>
        <Text style={styles.goodsName}>{item.name}</Text>
        {item.characteristic && (
          <Text style={styles.goodsDesc} numberOfLines={2}>{item.characteristic}</Text>
        )}
        <Text style={styles.goodsPrice}>¥{Number(item.originalPrice).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BrandColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>选择咖啡和小食</Text>
      </View>

      <View style={styles.content}>
        {/* 左侧分类列表 */}
        <View style={styles.categoryList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategoryId === category.id && styles.categoryItemActive,
              ]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategoryId === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 右侧商品列表 */}
        <View style={styles.goodsList}>
          {isLoadingGoods ? (
            <ActivityIndicator size="large" color={BrandColors.primary} style={styles.goodsLoading} />
          ) : (
            <SectionList
              ref={sectionListRef}
              sections={sections}
              keyExtractor={(item) => item.id.toString()}
              renderSectionHeader={renderSectionHeader}
              renderItem={renderGoodsItem}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
            />
          )}
        </View>
      </View>

      {/* 商品详情弹窗 */}
      <GoodsDetailModal
        visible={modalVisible}
        goods={selectedGoods}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  categoryList: {
    width: 90,
    backgroundColor: BrandColors.backgroundSecondary,
  },
  categoryItem: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  categoryItemActive: {
    backgroundColor: '#fff',
    borderLeftColor: BrandColors.primary,
  },
  categoryText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
  },
  categoryTextActive: {
    color: BrandColors.primary,
    fontWeight: '600',
  },
  goodsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  goodsLoading: {
    marginTop: 50,
  },
  sectionHeader: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.text,
  },
  sectionDesc: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginTop: 2,
  },
  goodsItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  goodsImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: BrandColors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goodsImageText: {
    fontSize: 30,
  },
  goodsInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  goodsName: {
    fontSize: 15,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 4,
  },
  goodsDesc: {
    fontSize: 12,
    color: BrandColors.textSecondary,
    marginBottom: 8,
  },
  goodsPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: BrandColors.primary,
  },
});
