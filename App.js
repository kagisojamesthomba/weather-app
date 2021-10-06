import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = '8d6ecbd1f4886eb69e4fb5aea21b6ca4';

export default function App() {
  const [city, setCity] = useState('loading...');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState();
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style='light' />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color='white' size='large' />
          </View>
        ) : (
          days.map((day, i) => (
            <View key={i} style={styles.day}>
              <Text style={styles.temperature}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.detailedDescription}>
                {day.weather[0].description}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a536b',
  },
  weather: {
    // backgroundColor: 'blue',
  },
  city: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    color: '#FFFFFF',
    fontSize: 45,
    fontWeight: '600',
  },
  day: {
    // justifyContent: 'center',

    alignItems: 'center',
    width: SCREEN_WIDTH,
  },
  description: {
    fontSize: 60,
    marginTop: -10,
    color: '#FFFFFF',
  },
  temperature: {
    fontSize: 70,
    marginTop: 20,
    color: 'white',
  },
  detailedDescription: {
    fontSize: 30,
    color: 'white',
    fontStyle: 'italic',
  },
});
