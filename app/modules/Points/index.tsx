import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons'
import MapView, { Marker } from 'react-native-maps';
import SkeletonContent from 'react-native-skeleton-content';
import api from '../../common/services/api';
import * as Location from 'expo-location';
import Item from './Item';

interface Item {
  id: number,
  title: string,
  image_url: string,
}

interface Point {
  id: number,
  image: string,
  image_url: string,
  name: string,
  latitude: number,
  longitude: number
}

interface Params {
  city: string,
  state: string,
}

const Points: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([0, 0]);

  const navigation = useNavigation();
  const route = useRoute();

  const routesParams = route.params as Params;

  useEffect(() => {
    async function getCurrentPosition() {
      const { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ops...', 'Precisamos de sua permissão para obter a localização');
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      const { latitude, longitude } = location.coords;
      setCurrentPosition([latitude, longitude]);
    }

    getCurrentPosition();
  }, []);

  useEffect(() => {
    api.get('items').then(response => setItems(response.data));
  }, [])

  useEffect(() => {
    api.get('points', {
      params: {
        city: routesParams.city, // @TODO Desconstruir aqui
        state: routesParams.state,
        items: selectedItems
      }
    }).then(response => {
      setPoints(response.data)
    });
  }, [selectedItems])

  function handleNavigationBack() {
    navigation.goBack();
  }

  function handleNavigationDetail(id: number) {
    navigation.navigate('Details', { id })
  }

  function handleSelectItem(id: number) {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  const showMap = currentPosition[0] !== 0;

  const itemsLoading = [1, 2, 3].map((item) => (
    <Item
      key={String(item)}
      id={item}
      onSelect={() => null}
      loading
    />
  ));

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={20} color="#00AFB9" />
        </TouchableOpacity>

        <Text style={styles.title}>Bem vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de doação.</Text>

        <SkeletonContent
          isLoading={!showMap}
          duration={800}
          layout={[
            {
              key: 'map',
              flex: 1,
              width: '100%',
              borderRadius: 10,
              overflow: 'hidden',
              marginTop: 16,
            },
          ]}>
          <View style={styles.mapContainer}>
            {
              showMap && (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: currentPosition[0],
                    longitude: currentPosition[1],
                    latitudeDelta: 0.014,
                    longitudeDelta: 0.014,
                  }}>
                  {
                    points.map(point => (
                      <Marker
                        key={String(point.id)}
                        style={styles.mapMarker}
                        onPress={() => handleNavigationDetail(point.id)}
                        coordinate={{
                          latitude: point.latitude,
                          longitude: point.longitude,
                        }} >
                        <View style={styles.mapMarkerContainer}>
                          <Image
                            style={styles.mapMarkerImage}
                            source={{ uri: point.image_url }} />
                          <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                        </View>
                      </Marker>
                    ))
                  }
                </MapView>)
            }
          </View>
        </SkeletonContent>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={{ paddingHorizontal: 30 }}
          showsVerticalScrollIndicator={false}>
          {
            items.length === 0
              ? itemsLoading
              : (
                items.map((item) => (
                  <Item
                    key={String(item.id)}
                    id={item.id}
                    title={item.title}
                    imageUrl={item.image_url}
                    loading={false}
                    selected={selectedItems.includes(item.id)}
                    onSelect={handleSelectItem} />
                )))
          }
        </ScrollView>
      </View>
    </>
  );
}

export default Points;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#00AFB9',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 6,
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    lineHeight: 23,
    fontSize: 10,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  }
});