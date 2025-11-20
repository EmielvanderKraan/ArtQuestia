import { useFonts } from 'expo-font';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import Bell from '../../assets/icons/doorbell.png';
import Icon11 from '../../assets/prestaties/11.png';
import Icon4 from '../../assets/prestaties/4.png';
import Icon7 from '../../assets/prestaties/7.png';
import Icon120 from '../../assets/prestaties/120.png';
import Icon55 from '../../assets/prestaties/55.png';
import Route from '../../assets/icons/themaRouteIcon.png';
import deJeugd from '../../assets/stickers/deJeugd.png';
import ballerina from '../../assets/stickers/ballerina.png';
import cowboyHenk from '../../assets/stickers/cowboyHenk.png';
import bazuin from '../../assets/stickers/bazuin.png';

export default function SettingsScreen() {
  const [fontsLoaded] = useFonts({
    Impact: require('../../assets/fonts/impact.ttf'),
    LeagueSpartan: require('../../assets/fonts/LeagueSpartan-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <ThemedView style={styles.titleContainer}>

      <TouchableOpacity style={styles.bellButton}>
        <Image source={Bell} style={styles.bellIcon} />
      </TouchableOpacity>

      <ThemedText type="title" style={[styles.mainTitle, { fontFamily: 'Impact' }]}>
        ArtQuestia
      </ThemedText>

      <ThemedText type="title" style={[styles.subtitle, { fontFamily: 'LeagueSpartan' }]}>
        Beleef, ontdek, verbind
      </ThemedText>

      <ThemedText type="title" style={[styles.title, { fontFamily: 'LeagueSpartan' }]}>
        Prestaties
      </ThemedText>

      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={Icon11} style={styles.buttonIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>Religie</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={Icon4} style={styles.buttonIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>Abstract</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={Icon7} style={styles.buttonIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>Fun</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={Icon120} style={styles.buttonIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>Gemeenschap</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={Icon55} style={styles.buttonIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>Oorlog</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.themaRoute}>
        <ThemedText type="title" style={[styles.title, { fontFamily: 'LeagueSpartan' }]}>
          Oorlog thema route
        </ThemedText>
        <ThemedText type="title" style={[styles.title, { fontFamily: 'LeagueSpartan' }]}>
          55%
        </ThemedText>
      </View>
      <Image source={Route} style={styles.themaRouteIcon} />


      <ThemedText type="title" style={[styles.title, { fontFamily: 'LeagueSpartan' }]}>
        Stickers
      </ThemedText>
      <View style={styles.buttonContainerStickers}>
        <TouchableOpacity style={styles.buttonStickers1}>
          <ThemedText style={styles.buttonTextStickers}>Alle</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStickers2}>
          <ThemedText style={styles.buttonTextStickers}>Thema's</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.rowStickers}>
        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={deJeugd} style={styles.stickerIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>De Jeugd</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={ballerina} style={styles.stickerIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>Ballerina</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={cowboyHenk} style={styles.stickerIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>Cowboy Henk</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={bazuin} style={styles.stickerIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>Bazuin</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={ballerina} style={styles.stickerIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>Ballerina</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <Image source={cowboyHenk} style={styles.stickerIcon} />
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>Cowboy Henk</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingTop: 70,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#000',
    fontFamily: 'Impact',
  },

  bellButton: {
    position: 'absolute',
    top: 60,
    right: 25,
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  bellIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  mainTitle: {
    fontSize: 32,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    color: '#fff',
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    color: '#fff',
  },

  container: {
    flexDirection: 'row',
    width: '100%',
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 16,
  },
  input: {
    flex: 1,
    paddingLeft: 15,
    fontSize: 15,
    color: '#000',
  },
  searchButton: {
    width: 50,
    backgroundColor: '#FF7700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },

  rowButtons: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
    position: 'relative',
    width: 85,
  },
  buttonIcon: {
    width: 60,
    height: 77,
    position: 'absolute',
    top: -25,
    zIndex: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    paddingTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'LeagueSpartan',
  },
  themaRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themaRouteIcon: {
    width: '100%',
    height: 60,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonContainerStickers: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  buttonStickers1: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#215AFF',
  },
  buttonStickers2: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF7700',
  },
  buttonTextStickers: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Impact',
  },
  rowStickers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 70,
    marginBottom: 20,
    width: '100%',
  },
  stickerIcon: {
    width: 93,
    height: 90,
    position: 'absolute',
    top: -30,
    zIndex: 10,
  },
});