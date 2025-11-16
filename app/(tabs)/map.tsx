import { Camera, MapView } from "@maplibre/maplibre-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function MapScreen() {
    const center: [number, number] = [4.3517, 50.8503];

    // Choose the style of the map here:
    const styleUrl =
        "https://api.maptiler.com/maps/streets-v2-3d/style.json?key=mIqAbQiXcMAwOt3f0O2W";

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                mapStyle={styleUrl}
            >
                <Camera
                    centerCoordinate={center}
                    zoomLevel={16}
                    pitch={60}
                    heading={20}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});