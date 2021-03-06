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
  const [isScrollByClick, setScrollByClick] = useState(false);

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
    const { width: contentWidth } = nativeEvent.contentSize;

    if (x === 0) {
      setActiveItem(0);
      return;
    }
    if (Math.round(x + layoutWidth) === contentWidth) {
      setActiveItem((data.length - 1) * itemsStep);
      return;
    }
    const value =
      Math.floor(x / itemWidth) + Math.floor(layoutWidth / itemWidth / 2);
    setActiveItem(value * itemsStep);
  };

  const onItemPress = ({ title, index }) => {
    setActiveItem(+title);
  };

  return (
    <View>
      {!!title && <Text style={s.title}>{title}</Text>}
      <InnerShadowWrapper style={s.container}>
        <FlatList
          horizontal
          ref={scrollRef}
          {...{ onScroll }}
          {...{ data }}
          initialScrollIndex={activeItem - 2 > 0 ? activeItem - 2 : 0}
          getItemLayout={(data, index) => ({
            length: itemWidth,
            offset: itemWidth * index,
            index,
          })}
          showsHorizontalScrollIndicator={false}
          style={s.list}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onLayout={({ nativeEvent }) => {
                if (!itemWidth) {
                  setItemWidth(nativeEvent.layout.width);
                }
              }}
              key={`scrollpicker${index}`}
              style={classnames(
                s.item,
                [s.activeItem, `${activeItem}` === item.title],
                [s.firstItem, index === 0]
              )}
              onPress={() => onItemPress({ ...item, index })}
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
