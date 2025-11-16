import {
    Camera,
    MapView,
    UserLocation,
    type CameraRef,
} from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function MapScreen() {
    // fallback: Brussel
    const center: [number, number] = [4.3517, 50.8503];

    // Kies de stijl van de kaart:
    const styleUrl =
        "https://api.maptiler.com/maps/streets-v2/style.json?key=mIqAbQiXcMAwOt3f0O2W";

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [userCoord, setUserCoord] = useState<[number, number] | null>(null);
    const cameraRef = useRef<CameraRef>(null);

    useEffect(() => {
        (async () => {
            // 1. Vraag toestemming
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setHasPermission(false);
                return;
            }

            setHasPermission(true);

            // 2. Huidige positie ophalen
            const loc = await Location.getCurrentPositionAsync({});
            const coord: [number, number] = [
                loc.coords.longitude,
                loc.coords.latitude,
            ];
            setUserCoord(coord);

            // 3. Camera naar gebruiker bewegen
            cameraRef.current?.setCamera({
                centerCoordinate: coord,
                zoomLevel: 16,
                pitch: 60,
                animationDuration: 1000,
            });
        })();
    }, []);

    if (hasPermission === false) {
        return (
            <View style={styles.center}>
                <Text>Locatie-permissie is geweigerd 😢</Text>
            </View>
        );
    }

    if (hasPermission === null) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text>Locatie ophalen…</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} mapStyle={styleUrl}>
                {/* blauw bolletje op je huidige positie */}
                <UserLocation visible={true} />

                <Camera
                    ref={cameraRef}
                    centerCoordinate={userCoord ?? center}
                    zoomLevel={userCoord ? 16 : 12}
                    pitch={60}
                    heading={20}
                    followUserLocation={!!userCoord}
                    followZoomLevel={16}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },
});