import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { SvgUri } from 'react-native-svg';


interface Props {
  id: number,
  title?: string,
  imageUrl?: string,
  loading?: boolean;
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
          styles.item,
          selected ? styles.itemSelected : {}
        ]}
        onPress={() => onSelect(id)}
      >
        <SvgUri
          width={42}
          height={42}
          uri={imageUrl || null}>
        </SvgUri>
        <Text style={styles.itemTitle}>{loading ? 'title' : title}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
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
    justifyContent: 'space-between',
    textAlign: 'center',
  },

  itemSelected: {
    borderColor: '#34CB79',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  }
})

export default Item;