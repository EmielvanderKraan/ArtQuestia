import { useFonts } from 'expo-font';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import Location from '../assets/icons/location.png';
import NextIcon from '../assets/icons/next.png';
import Icon1 from '../assets/icons/route.png';
import Icon3 from '../assets/icons/share.png';
import Icon2 from '../assets/icons/stickers.png';

const STRAPI_URL = 'http://172.30.40.49:1337';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

interface ArtworkCardDetailProps {
  artwork: {
    id: number;
    distance?: number;
    attributes: {
      Name: string;
      Creator: string;
      Year?: number;
      Theme?: string;
      Description?: string;
      Photo?: {
        data?: {
          attributes?: {
            url?: string;
          };
        };
      };
      Photo_Hidden?: {
        data?: {
          attributes?: {
            url?: string;
          };
        };
      };
      Location?: {
        lat?: number;
        lng?: number;
      };
      Stickers?: {
        data?: {
          attributes?: {
            url?: string;
          };
        };
      };
      Stickers_Hidden?: {
        data?: {
          attributes?: {
            url?: string;
          };
        };
      };
    };
  };
  onClose?: () => void;
}

export default function ArtworkCardDetail({ artwork, onClose }: ArtworkCardDetailProps) {
  const [fontsLoaded] = useFonts({
    Impact: require('../assets/fonts/impact.ttf'),
    LeagueSpartan: require('../assets/fonts/LeagueSpartan-VariableFont_wght.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!artwork) {
    console.log('No artwork provided');
    return null;
  }

  const attributes = artwork.attributes || artwork;
  
  // Get Photo URL with multiple fallback checks like in ArtworkCard
  const photoData = attributes.Photo?.data;
  const photoUrl = photoData?.attributes?.url || photoData?.url || attributes.Photo?.url;
  const fullImageUrl = photoUrl ? `${STRAPI_URL}${photoUrl}` : null;

  // Get Photo_Hidden URL
  const photoHiddenData = attributes.Photo_Hidden?.data;
  const photoHiddenUrl = photoHiddenData?.attributes?.url || photoHiddenData?.url || attributes.Photo_Hidden?.url;
  const fullPhotoHiddenUrl = photoHiddenUrl ? `${STRAPI_URL}${photoHiddenUrl}` : null;

  // Get Stickers URL
  const stickersData = attributes.Stickers?.data;
  const stickersUrl = stickersData?.attributes?.url || stickersData?.url || attributes.Stickers?.url;
  const fullStickersUrl = stickersUrl ? `${STRAPI_URL}${stickersUrl}` : null;

  // Get Stickers_Hidden URL
  const stickersHiddenData = attributes.Stickers_Hidden?.data;
  const stickersHiddenUrl = stickersHiddenData?.attributes?.url || stickersHiddenData?.url || attributes.Stickers_Hidden?.url;
  const fullStickersHiddenUrl = stickersHiddenUrl ? `${STRAPI_URL}${stickersHiddenUrl}` : null;

  // Get location info
  const lat = attributes.Location?.lat;
  const lon = attributes.Location?.lng;
  
  // Use the calculated distance from the artwork object (passed from index.tsx)
  const calculatedDistance = (artwork as any).distance;
  const distanceText = calculatedDistance && calculatedDistance !== Infinity 
    ? `${calculatedDistance.toFixed(1)} km` 
    : 'Distance not available';

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Back Button */}
        <TouchableOpacity 
          style={[
            styles.nextButton
          ]} 
          onPress={onClose}
        >
          <Image source={NextIcon} style={styles.nextButtonIcon} />
        </TouchableOpacity>

        {/* Main Photo */}
        {fullImageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: fullImageUrl }} style={styles.heroImage} />
          </View>
        )}

        {/* Content */}
        <View style={styles.contentContainer}>
          
          {/* Title Section */}
          <ThemedText style={[styles.title, { fontFamily: 'Impact' }]}>
            {attributes.Name || 'Untitled'}
          </ThemedText>
          
          <ThemedText style={[styles.creator, { fontFamily: 'LeagueSpartan' }]}>
             {attributes.Creator || 'Unknown'}
          </ThemedText>

        <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.buttonContainer}>
        <ThemedText style={styles.buttonIcon}>Jaar</ThemedText>
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>{attributes.Year || 'N/A'}</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <ThemedText style={styles.buttonIcon}>Afstand</ThemedText>
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>{distanceText}</ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <ThemedText style={styles.buttonIcon}>Thema</ThemedText>
          <View style={styles.button}>
            <ThemedText style={styles.buttonText}>{attributes.Theme || 'N/A'}</ThemedText>
          </View>
        </TouchableOpacity>
        </View>

          {/* Description */}
          {attributes.Description && (
            <View style={styles.section}>
              <ThemedText style={[styles.description, { fontFamily: 'LeagueSpartan' }]}>
                {attributes.Description}
              </ThemedText>
            </View>
          )}

            <TouchableOpacity 
                style={styles.readMoreButton}>
                <ThemedText style={styles.readMoreButtonText}>Start je tocht naar {attributes.Name}</ThemedText>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },

  // Back Button
  nextButton: {
    position: 'absolute',
    top: verticalScale(60),
    left: scale(20),
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    transform: [{ rotate: '180deg' }],
  },
  nextButtonIcon: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
    tintColor: '#fff',
  },

  // Hero Image
  imageContainer: {
    width: '100%',
    height: verticalScale(400),
    backgroundColor: '#FF5AE5',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Content
  contentContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(50),
  },
  title: {
    fontSize: moderateScale(32),
    color: '#fff',
    marginBottom: verticalScale(10),
    lineHeight: moderateScale(38),
  },
  creator: {
    fontSize: moderateScale(18),
    color: '#fff',
    marginBottom: verticalScale(30),
  },

  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  buttonContainer: {
    alignItems: 'center',
    position: 'relative',
    flex: 1,
    maxWidth: scale(100),
    marginHorizontal: scale(0),
  },
  buttonIcon: {
    width: moderateScale(100),
    height: moderateScale(100),
    position: 'absolute',
    top: verticalScale(-5),
    zIndex: 10,
    color: '#fff',
    fontSize: moderateScale(20),
    fontFamily: 'Impact',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(8),
    backgroundColor: '#292929',
    paddingTop: verticalScale(20),
    minHeight: verticalScale(70),
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(15),
    fontFamily: 'LeagueSpartan',
    textAlign: 'center',
  },

  // Sections
  section: {
    marginBottom: verticalScale(30),
    marginTop: verticalScale(10),
  },
  sectionTitle: {
    fontSize: moderateScale(24),
    color: '#fff',
    marginBottom: verticalScale(12),
  },
  description: {
    fontSize: moderateScale(15),
    color: '#fff',
    lineHeight: moderateScale(22),
  },

  // Location
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: moderateScale(12),
    padding: scale(15),
    alignSelf: 'flex-start',
  },
  locationIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
    marginRight: scale(10),
  },
  locationText: {
    fontSize: moderateScale(14),
    color: '#fff',
  },

  // Images
  sectionImage: {
    width: '100%',
    height: verticalScale(300),
    resizeMode: 'cover',
    borderRadius: moderateScale(12),
    backgroundColor: '#1a1a1a',
  },
  stickerImage: {
    width: scale(200),
    height: scale(200),
    resizeMode: 'contain',
    alignSelf: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: moderateScale(12),
    padding: scale(20),
  },
    readMoreButton: {
    backgroundColor: '#FF7700',
    paddingVertical: verticalScale(20),
    borderRadius: moderateScale(50),
    marginBottom: verticalScale(10),
  },
  readMoreButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: moderateScale(16),
    fontFamily: 'Impact',
  },
});
