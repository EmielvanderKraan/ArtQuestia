import { IconSymbol } from "@/components/ui/icon-symbol";
import {
    Camera,
    Images,
    LineLayer,
    MapView,
    ShapeSource,
    SymbolLayer,
    UserLocation,
    type CameraRef,
} from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";


// Type for markers
type Marker = {
    id: string;
    coordinate: [number, number]; // [longitude, latitude]
    title: string;
    icon?: string; // icon name reference for custom icons
};

export default function MapScreen() {
    // fallback: Kortrijk
    const center: [number, number] = [3.2649, 50.828];

    // Markers array - Add your coordinates here
    const [markers, setMarkers] = useState<Marker[]>([
        {
            id: "oorlogsmonument_bissegem",
            coordinate: [3.227223, 50.823085],
            title: "Oorlogsmonument Bissegem",
            icon: "marker-icon1",
        },
        {
            id: "leie_monument",
            coordinate: [3.268430, 50.835340],
            title: "Leie Monument",
            icon: "marker-icon2",
        },
        {
            id: "groeninge_monument",
            coordinate: [3.275814, 50.828708],
            title: "Groeninge Monument",
            icon: "marker-icon3",
        },
        {
            id: "monument_voor_de_gesneuvelden_van_wereldoorlog_ii",
            coordinate: [3.265759, 50.827542],
            title: "WO II Monument",
            icon: "marker-icon4",
        },
    ]);

    // Onze MapTiler style
    const maptilerKey = "mIqAbQiXcMAwOt3f0O2W";
    const styleUrl = `https://api.maptiler.com/maps/019a91f5-7a01-7170-a11e-6df34c588725/style.json?key=${maptilerKey}`;

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [userCoord, setUserCoord] = useState<[number, number] | null>(null);
    const [routeGeoJSON, setRouteGeoJSON] = useState<any | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

    const cameraRef = useRef<CameraRef>(null);

    // OpenRouteService
    const ORS_API_KEY =
        "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImNjNDUyZGVlMzNmMzQ3N2RhMTNiNTFmOWU5MGIwYjYzIiwiaCI6Im11cm11cjY0In0=";

    // Fetch route to a specific marker
    const fetchWalkingRoute = async (
        startCoord: [number, number],
        endCoord: [number, number]
    ) => {
        try {
            const res = await fetch(
                "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        Accept: "application/geo+json, application/json",
                        Authorization: ORS_API_KEY,
                    },
                    body: JSON.stringify({
                        coordinates: [startCoord, endCoord],
                    }),
                }
            );

            if (!res.ok) {
                console.warn("ORS route request failed", await res.text());
                return;
            }

            const json = await res.json();
            console.log("Route GeoJSON:", JSON.stringify(json, null, 2));
            setRouteGeoJSON(json);
        } catch (e) {
            console.warn("Error fetching ORS walking route", e);
        }
    };

    // Navigate to a specific marker + route tekenen
    const navigateToMarker = async (marker: Marker) => {
        if (!userCoord) {
            console.warn("Geen user locatie beschikbaar");
            return;
        }

        setSelectedMarker(marker);
        await fetchWalkingRoute(userCoord, marker.coordinate);

        // Zoom naar het kunstwerk
        cameraRef.current?.setCamera({
            centerCoordinate: marker.coordinate,
            zoomLevel: 14,
            animationDuration: 1000,
        });
    };

    // Convert markers to GeoJSON for rendering
    const getMarkersGeoJSON = () => {
        return {
            type: "FeatureCollection",
            features: markers.map((marker) => ({
                type: "Feature",
                id: marker.id,
                properties: {
                    id: marker.id, // belangrijk om het later terug te vinden
                    title: marker.title,
                    icon: marker.icon || "marker-icon",
                },
                geometry: {
                    type: "Point",
                    coordinates: marker.coordinate,
                },
            })),
        };
    };

    // Click handler voor markers
    const onMarkerPress = (e: any) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const markerId =
            feature.properties?.id ?? feature.id;

        if (!markerId) return;

        const marker = markers.find((m) => m.id === markerId);
        if (!marker) return;

        setSelectedMarker(marker);
    };

    useEffect(() => {
        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setHasPermission(false);
                return;
            }

            setHasPermission(true);

            const loc = await Location.getCurrentPositionAsync({});
            const coord: [number, number] = [
                loc.coords.longitude,
                loc.coords.latitude,
            ];
            setUserCoord(coord);

            // Camera naar gebruiker
            cameraRef.current?.setCamera({
                centerCoordinate: coord,
                zoomLevel: 16,
                pitch: 60,
                animationDuration: 1000,
            });
        })();
    }, []);

    const goToMyLocation = async () => {
        const loc = await Location.getCurrentPositionAsync({});
        const coord: [number, number] = [
            loc.coords.longitude,
            loc.coords.latitude,
        ];

        setUserCoord(coord);

        cameraRef.current?.setCamera({
            centerCoordinate: coord,
            zoomLevel: 16,
            pitch: 60,
            animationDuration: 800,
        });

        // Route opnieuw berekenen als er een marker geselecteerd is
        if (selectedMarker) {
            await fetchWalkingRoute(coord, selectedMarker.coordinate);
        }
    };

    if (hasPermission === false) {
        return (
            <View style={styles.center}>
                <Text>Locatie-permissie is geweigerd</Text>
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
            {/* Search bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Zoek naar kunstwerken"
                    placeholderTextColor="#666666"
                    style={styles.input}
                />
            </View>

            <MapView
                style={styles.map}
                mapStyle={styleUrl}
                compassEnabled={false}
            >
                <Images
                    images={{
                        "marker-icon1": require("@/assets/icons/oorlogsmonument_bissegem.png"),
                        "marker-icon2": require("@/assets/icons/leie_monument.png"),
                        "marker-icon3": require("@/assets/icons/groeninge_monument.png"),
                        "marker-icon4": require("@/assets/icons/monument_voor_de_gesneuvelden_van_wereldoorlog_ii.png"),
                    }}
                />

                {/* native user dot */}
                <UserLocation visible={true} />

                {/* Custom Markers */}
                {markers.length > 0 && (
                    <ShapeSource
                        id="markers-source"
                        shape={getMarkersGeoJSON() as any}
                        onPress={onMarkerPress}
                    >
                        <SymbolLayer
                            id="markers-layer"
                            style={{
                                iconImage: ["get", "icon"],
                                iconSize: 0.05,
                                iconAllowOverlap: true,
                                iconIgnorePlacement: true,
                            }}
                        />
                    </ShapeSource>
                )}

                {/* wandelroute user → selected marker (volgt straten) */}
                {routeGeoJSON && (
                    <ShapeSource
                        id="walking-route"
                        shape={routeGeoJSON as any}
                    >
                        <LineLayer
                            id="walking-route-line"
                            style={{
                                lineColor: "#215AFF", // blauw
                                lineWidth: 4,
                                lineCap: "round",
                                lineJoin: "round",
                            }}
                        />
                    </ShapeSource>
                )}

                <Camera
                    ref={cameraRef}
                    centerCoordinate={userCoord ?? center}
                    zoomLevel={userCoord ? 17 : 12}
                    pitch={60}
                    heading={20}
                />
            </MapView>

            {/* Floating button: ga naar mijn locatie + route herberekenen */}
            <TouchableOpacity
                style={styles.locationBtn}
                onPress={goToMyLocation}
            >
                <IconSymbol name="location.fill" size={28} color="white" />
            </TouchableOpacity>

            {/* Popup onderaan bij geselecteerd kunstwerk */}
            {selectedMarker && (
                <View style={styles.popupContainer}>
                    <View style={styles.popupCard}>
                        <Text style={styles.popupTitle}>
                            {selectedMarker.title || "Kunstwerk"}
                        </Text>
                        <Text style={styles.popupSubtitle}>
                            {selectedMarker.id.replace(/_/g, " ")}
                        </Text>

                        <View style={styles.popupButtonsRow}>
                            <TouchableOpacity
                                style={styles.popupSecondaryButton}
                                onPress={() => setSelectedMarker(null)}
                            >
                                <Text style={styles.popupSecondaryText}>
                                    Sluit
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.popupPrimaryButton}
                                onPress={() => navigateToMarker(selectedMarker)}
                            >
                                <Text style={styles.popupPrimaryText}>
                                    Ontdek
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
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
    searchContainer: {
        position: "absolute",
        top: 60,
        left: 20,
        right: 20,
        flexDirection: "row",
        height: 45,
        backgroundColor: "#fff",
        borderRadius: 30,
        overflow: "hidden",
        zIndex: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    input: {
        flex: 1,
        paddingLeft: 15,
        fontSize: 15,
        color: "#000",
        fontFamily: "LeagueSpartan",
    },
    locationBtn: {
        position: "absolute",
        bottom: 24,
        right: 24,
        backgroundColor: "#292929",
        padding: 12,
        borderRadius: 50,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },

    // Popup styles
    popupContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        padding: 16,
    },
    popupCard: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    popupTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
        color: "#000",
    },
    popupSubtitle: {
        fontSize: 14,
        color: "#555",
        marginBottom: 16,
    },
    popupButtonsRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 8,
    },
    popupPrimaryButton: {
        backgroundColor: "#FF7700",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 999,
    },
    popupPrimaryText: {
        color: "#fff",
        fontWeight: "600",
    },
    popupSecondaryButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: "#f1f1f1",
    },
    popupSecondaryText: {
        color: "#333",
        fontWeight: "500",
    },
});