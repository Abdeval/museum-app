import { SliderProps } from "@/types";
import React, { useRef, useState } from "react";
import { Dimensions, View, ViewToken } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import Pagination from "./Pagination";
import SliderItem from "./SliderItem";
const width = Dimensions.get("screen").width;
// const height = Dimensions.get("screen").height;

export default function Slider({ museumImages }: SliderProps) {
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (
      viewableItems[0].index !== undefined &&
      viewableItems[0].index !== null
    ) {
      setPaginationIndex(viewableItems[0].index);
      // console.log('logging...')
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <View>
      <Animated.FlatList
        data={museumImages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <SliderItem item={item} index={index || 0} scrollX={scrollX} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        snapToInterval={width}
        decelerationRate="fast"
        scrollEventThrottle={16}
        bounces={false}
      />
      <Pagination
        scrollX={scrollX}
        items={museumImages}
        paginationIndex={paginationIndex}
      />
    </View>
  );
}
