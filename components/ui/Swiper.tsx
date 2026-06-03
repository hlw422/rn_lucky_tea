import React, { useRef, useEffect, useState } from 'react';
import { 
  FlatList, 
  View, 
  Image, 
  StyleSheet, 
  Dimensions, 
  NativeSyntheticEvent, 
  NativeScrollEvent 
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SwiperProps {
  images: string[];
  height?: number;
  autoPlay?: boolean;
  interval?: number;
}

export const Swiper: React.FC<SwiperProps> = ({
  images,
  height = 200,
  autoPlay = true,
  interval = 3000,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (autoPlay && images.length > 1) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [currentIndex, autoPlay, images.length]);

  const startAutoPlay = () => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, interval);
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={[styles.slide, { height }]}>
      <Image 
        source={{ uri: item }} 
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  const renderDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.dot,
        index === currentIndex && styles.dotActive,
      ]}
    />
  );

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => renderDot(index))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  slide: {
    width: SCREEN_WIDTH,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
});
