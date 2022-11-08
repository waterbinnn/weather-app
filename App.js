import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = '2cdf4f36c0691a89b8520e4be9cb63ba';
const icons = {
  Clouds: 'cloudy',
  Clear: 'day-sunny',
};

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    const json = await response.json();

    setCity(json.name);
    setDays(json);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
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
            <ActivityIndicator
              color={'white'}
              style={{ marginTop: 30 }}
              size={'large'}
            ></ActivityIndicator>
          </View>
        ) : (
          <>
            <View style={styles.day}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(days.main.temp).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[days.weather[0].main]}
                  size={40}
                  color="white"
                />
              </View>
              <Text style={styles.desc}>{days.weather[0].main}</Text>
              <Text style={styles.tinyText}>{days.weather[0].description}</Text>
            </View>
            <View style={styles.day}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(days.main.temp).toFixed(1)}
                </Text>
                <Fontisto name={icons.Clear} size={40} color="white" />
              </View>
              <Text style={styles.desc}>Sunny</Text>
              <Text style={styles.tinyText}>so hot</Text>
            </View>
          </>
        )}
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    color: 'white',
    fontSize: 40,
    fontWeight: '500',
  },
  weather: {
    backgroundColor: 'black',
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    color: 'lightblue',
    marginTop: 50,
    fontSize: 100,
  },
  desc: {
    color: 'white',
    marginTop: 10,
    fontSize: 50,
    fontWeight: '700',
  },
  tinyText: {
    color: 'white',
    marginTop: -10,
    fontSize: 20,
    fontStyle: 'italic',
  },
  degree: {
    color: 'white',
    marginLeft: 10,
    fontSize: 50,
    fontWeight: '700',
    color: 'white',
  },
});
