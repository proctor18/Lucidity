import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { SystemBars } from 'react-native-bars';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import CarouselButton from './CarouselButton.js';
import Item from './Item.js';

const SessionsCarousel = () => {
  const { width } = useWindowDimensions();
  const x = useSharedValue(0);

  const ITEM_WIDTH = 250;
  const ITEM_HEIGHT = 285;
  const MARGIN_HORIZONTAL = 20;
  const ITEM_FULL_WIDTH = ITEM_WIDTH + MARGIN_HORIZONTAL * 2;
  const SPACER = (width - ITEM_FULL_WIDTH) / 2;

  // Define data without images
  const data = [
    { id: '1', name: 'Chemistry', exp: 'Experience 1' },
    { id: '2', name: 'Toplogy', exp: 'Experience 2' },
    { id: '3', name: 'Chinese', exp: 'Experience 2' },
    // Add more items as needed
  ];

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <SystemBars animated={true} barStyle={'light-content'} />
      <View style={styles.textContainer}>
      </View>

      <Animated.FlatList
        onScroll={onScroll}
        ListHeaderComponent={<View />}
        ListHeaderComponentStyle={{ width: SPACER }}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={{ width: SPACER }}
        data={data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id + item.name}
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
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={ITEM_FULL_WIDTH}
      />

    </SafeAreaView>
  );
};

export default SessionsCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#131313',
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 26,
    fontWeight: '300',
    textAlign: 'center',
  },
});

