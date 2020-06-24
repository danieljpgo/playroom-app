import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, StyleSheet, Image, Text, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEState {
  sigla: string,
  nome: string,
}

interface IBGECity {
  sigla: string,
  nome: string
}

interface Item {
  label: string,
  value: string,
}

const Home: React.FC = () => {
  const [states, setStates] = useState<Item[]>([]);
  const [cities, setCities] = useState<Item[]>([]);
  const [selectedState, setSelectState] = useState<string>('default');
  const [selectedCity, setSelectCity] = useState<string>('default');

  const navigation = useNavigation();

  const defaultState = { label: 'Selecione o estado', value: null }
  const defaultCity = { label: 'Selecione a cidade', value: null }

  useEffect(() => {
    axios.get<IBGEState[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then((response) => setStates(response.data.map((ibgeStates) => ({
        label: ibgeStates.nome,
        value: ibgeStates.sigla
      }))));
  }, []);

  useEffect(() => {
    if (selectedState !== 'default') {
      axios.get<IBGECity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
        .then((response) => setCities(response.data.map((ibgeCities) => ({
          label: ibgeCities.nome,
          value: ibgeCities.nome
        }))));
    }
  }, [selectedState]);

  function handleSelectState(value: string, index: number) {
    setSelectState(value);
  }

  function handleSelectCity(value: string, index: number) {
    setSelectCity(value);
  }

  function handleNavigationToPoints() {
    navigation.navigate('Points', {
      state: selectedState,
      city: selectedCity
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../../assets/home-background.png')}
        style={styles.container}
        imageStyle={styles.background}>
        <View style={styles.main}>
          <View style={styles.brandContainer}>
            <Image
              style={styles.brand}
              source={require('../../../assets/logo.png')} />
            <Text style={styles.brandName}>Playroom</Text>
          </View>
          <View>
            <Text style={styles.title}>Seu marketplace de doação de brinquedos </Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de doação de brinquedos.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            style={{ viewContainer: styles.input }}
            useNativeAndroidPickerStyle={true}
            placeholder={defaultState}
            items={states}
            value={selectedState}
            onValueChange={handleSelectState}
          />
          <RNPickerSelect
            style={{ viewContainer: styles.input }}
            useNativeAndroidPickerStyle={true}
            placeholder={defaultCity}
            items={cities}
            value={selectedCity}
            onValueChange={handleSelectCity}
          />
          <RectButton
            enabled={(selectedCity !== 'default') || (selectedState !== 'default')}
            style={styles.button}
            onPress={handleNavigationToPoints}
          >
            <View style={styles.buttonIcon}>
              <Icon
                name="arrow-right"
                color="#fff"
                size={24} />
            </View>
            <Text style={styles.buttonText} >Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  background: {
    width: 400,
    height: 298,
  },

  main: {
    marginTop: 240,
    flex: 1,
    justifyContent: 'center',
  },

  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  brand: {
    height: 60,
    width: 60
  },

  brandName: {
    marginLeft: 12,
    color: '#3f3d56',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
  },

  title: {
    color: '#3f3d56',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    // maxWidth: 260,
    marginTop: 20,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {
  },

  select: {},

  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#00AFB9',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});