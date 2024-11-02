import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { SystemBars } from 'react-native-bars';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler
} from 'react-native-reanimated';
import Item from './Item.js';

const SessionsCarousel = ( { sessions , loading , currentIndex }) => {
  const { width } = useWindowDimensions();
  const x = useSharedValue(0);
  const initialValue = useSharedValue(0);

  const ITEM_WIDTH = 250;
  const ITEM_HEIGHT = 285;
  const MARGIN_HORIZONTAL = 20;
  const ITEM_FULL_WIDTH = ITEM_WIDTH + MARGIN_HORIZONTAL * 2;
  const SPACER = (width - ITEM_FULL_WIDTH) / 2;

  const values = sessions.map((dict, index) => ({
    id: `Session ${index + 1}`,
    name: dict.subject,
    exp: `Session ${index + 1}`,
    ...dict
  }));

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
    onEndDrag : (event) => {
      if(initialValue.value > x.value ){ // case left 
        currentIndex.value = currentIndex.value - 1
        console.log(currentIndex.value)
      }else if(initialValue.value < x.value ){ // case right 
        currentIndex.value = currentIndex.value + 1
        console.log(currentIndex.value)
      }
    },
    onBeginDrag : (event) => {
      initialValue.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <SystemBars animated={true} barStyle="light-content" />
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          onScroll={onScroll}
          data={values}
          renderItem={({ item, index }) => (
            <Item
              item={item}
              index={index}
              x={x}
              width={ITEM_WIDTH}
              height={ITEM_HEIGHT}
              marginHorizontal={MARGIN_HORIZONTAL}
              fullWidth={ITEM_FULL_WIDTH}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={ITEM_FULL_WIDTH}
          ListHeaderComponent={<View style={{ width: SPACER }} />}
          ListFooterComponent={<View style={{ width: SPACER }} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scrollContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    height: 285, // Match ITEM_HEIGHT
  },
  scrollContent: {
    alignItems: 'center',
  }
});

export default SessionsCarousel;
