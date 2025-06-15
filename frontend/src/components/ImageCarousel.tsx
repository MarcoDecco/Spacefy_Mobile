import React from 'react';
import { View, ScrollView, Image, Text } from 'react-native';

interface ImageCarouselProps {
  images: any[];
  activeIndex: number;
  onScroll: (event: any) => void;
  onMomentumScrollEnd: (event: any) => void;
  scrollRef: React.RefObject<ScrollView>;
  setIsAutoPlayPaused: (paused: boolean) => void;
  styles: any;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  activeIndex,
  onScroll,
  onMomentumScrollEnd,
  scrollRef,
  setIsAutoPlayPaused,
  styles,
}) => (
  <View style={styles.imageContainer}>
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      onMomentumScrollEnd={onMomentumScrollEnd}
      ref={scrollRef}
      scrollEventThrottle={16}
      onTouchStart={() => setIsAutoPlayPaused(true)}
      onTouchEnd={() => setIsAutoPlayPaused(false)}
    >
      {images.map((img, index) => (
        <Image key={index} source={img} style={styles.image} resizeMode="cover" />
      ))}
    </ScrollView>
    {/* Dots de navegação */}
    <View style={styles.dotsContainer}>
      {images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
    {/* Contador de imagens */}
    <View style={styles.counter}>
      <Text style={styles.counterText}>
        {activeIndex + 1}/{images.length}
      </Text>
    </View>
  </View>
);