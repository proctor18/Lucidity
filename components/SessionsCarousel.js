import React from "react";
import { SafeAreaView, View, StyleSheet, useWindowDimensions } from 'react-native';
import { SystemBars } from 'react-native-bars';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler
} from 'react-native-reanimated';
import Item from './Item.js';

const SessionsCarousel = ({ 
  sessions, 
  loading, 
  incrementIndex, 
  decrementIndex, 
  currentIndex 
}) => {
  const { width } = useWindowDimensions();
  const x = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const initialOffset = useSharedValue(0);
  
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
    onBeginDrag: (event) => {
      initialOffset.value = x.value;
      isScrolling.value = true;
    },
    onEndDrag: (event) => {
      isScrolling.value = false;
      if (initialOffset.value > x.value) {
        decrementIndex();
      } else if (initialOffset.value < x.value) {
        incrementIndex();
      }
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
