import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Touchable,
} from 'react-native';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>MartinGoals Mobile</Text>
        </View>
        <View style={styles.oddsContainer}>
          <View style={styles.goalsContainer}>
            <Text style={styles.dashboardText}>Under</Text>
            <TextInput style={styles.numberInput} keyboardType="number-pad" />
          </View>
          <View style={styles.goalsContainer}>
            <Text style={styles.dashboardText}>Over</Text>
            <TextInput style={styles.numberInput} keyboardType="number-pad" />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#082545',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: '#E64E15',
    flex: 1,
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
  },
  titleText: {
    fontSize: 40,
    color: '#fff',
  },
  oddsContainer: {
    flex: 5,
    flexDirection: 'column',
    width: '75%',
  },
  dashboardText: {
    fontSize: 25,
    color: '#fff',
    marginHorizontal: '10%',
  },
  goalsContainer: {
    backgroundColor: '#E64E15',
    flexDirection: 'row',
    marginVertical: '5%',
    paddingVertical: '5%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  numberInput: {
    backgroundColor: '#fff',
    width: '50%',
  },
});
