import React, { useMemo, useRef, useState } from "react";
import s from "./HorizontalScrollPicker.s";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import InnerShadowWrapper from "../../wrappers/InnerShadowWrapper/InnerShadowWrapper";
import classnames from "classnames-react-native";

const HorizontalScrollPicker = ({
  numberOfItems = 50,
  activeItem = 1,
  setActiveItem = () => {},
  title,
  separator,
  itemsStep = 1,
}) => {
  const [itemWidth, setItemWidth] = useState(0);

  const data = useMemo(() => {
    return [...Array(numberOfItems).keys()].map((item, id) => ({
      id,
      title: `${item * itemsStep}`,
    }));
  }, [numberOfItems, itemsStep]);

  const scrollRef = useRef();
  const onScroll = ({ nativeEvent }) => {
    const { x } = nativeEvent.contentOffset;
    const { width: layoutWidth } = nativeEvent.layoutMeasurement;
    const value =
      Math.round(x / itemWidth) + Math.floor(layoutWidth / itemWidth / 2);
    setActiveItem(value * itemsStep);
    console.log("value ===", value);
  };

  const onMomentumScrollEnd = ({ nativeEvent }) => {
    console.log("index ===", activeItem / itemsStep - 1);
    console.log("active item ===", activeItem);
    scrollRef.current.scrollToIndex({ index: activeItem / itemsStep - 1 });
  };

  return (
    <View>
      {!!title && <Text style={s.title}>{title}</Text>}
      <InnerShadowWrapper style={s.container}>
        <FlatList
          horizontal
          ref={scrollRef}
          {...{ onMomentumScrollEnd }}
          {...{ onScroll }}
          {...{ data }}
          initialScrollIndex={activeItem - 2}
          getItemLayout={(data, index) => ({
            length: itemWidth,
            offset: itemWidth * index,
            index,
          })}
          showsHorizontalScrollIndicator={false}
          style={s.list}
          renderItem={({ item, onPress = () => {}, style }) => (
            <TouchableOpacity
              onLayout={({ nativeEvent }) => {
                if (!itemWidth) {
                  setItemWidth(nativeEvent.layout.width);
                }
              }}
              style={classnames(s.item, [
                s.activeItem,
                `${activeItem}` === item.title,
              ])}
              onPress={onPress}
            >
              <Text
                style={classnames(s.text, [
                  s.activeText,
                  `${activeItem}` === item.title,
                ])}
              >
                {item.title}
              </Text>
              <View style={s.lines}>
                <View
                  style={classnames(s.line, s.mainLine, [
                    s.activeLine,
                    `${activeItem}` === item.title,
                  ])}
                />
                <View style={s.line} />
                <View style={s.line} />
                <View style={s.line} />
                <View style={s.line} />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
        <Text style={s.scrollInnerText}>{separator}</Text>
      </InnerShadowWrapper>
    </View>
  );
};

export default HorizontalScrollPicker;