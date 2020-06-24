import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { SvgUri } from 'react-native-svg';
import SkeletonContent from 'react-native-skeleton-content';

interface Props {
  id: number,
  title?: string,
  imageUrl?: string,
  loading: boolean;
  selected?: boolean;
  onSelect: (id: number) => void;
}

const Item: React.FC<Props> = (props) => {
  const {
    id,
    title,
    imageUrl,
    loading,
    selected,
    onSelect,
  } = props;

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.6}
        style={[
          styles.container,
          selected ? styles.selected : {}
        ]}
        onPress={() => onSelect(id)}
      >
        <SkeletonContent
          isLoading={loading}
          duration={800}
          layout={[
            {
              key: 'img',
              width: 72,
              height: 50,
              borderRadius: 4,
            },
            {
              key: 'text',
              width: 60,
              height: 16,
              borderRadius: 4,
              marginTop: 10
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <SvgUri
              width={42}
              height={42}
              uri={imageUrl || null}>
            </SvgUri>
          </View>
          <Text style={styles.title}>{title}</Text>
        </SkeletonContent>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  selected: {
    borderColor: '#00AFB9',
    borderWidth: 2,
    // backgroundColor: '#00afb91a'
  },
  title: {
    marginTop: 8,
    flex: 1,
    textAlignVertical: 'center',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
  iconContainer: {
    height: 42,
    width: 42
  }
})

export default Item;