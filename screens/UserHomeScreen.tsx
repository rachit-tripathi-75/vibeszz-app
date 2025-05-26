"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Picker } from "@react-native-picker/picker"
import { Ionicons } from "@expo/vector-icons"

// Mock data for venues
const mockVenues = {
    Mumbai: [
        {
            id: "1",
            name: "Club Illusion",
            type: "club",
            capacity: 200,
            currentOccupancy: 140,
            image: require("../assets/clubillusion.jpg"),
        },
        {
            id: "2",
            name: "Spice Restaurant",
            type: "restaurant",
            capacity: 100,
            currentOccupancy: 50,
            image: require("../assets/spceresaurant.jpg"),
        },
        {
            id: "3",
            name: "Skybar",
            type: "bar",
            capacity: 150,
            currentOccupancy: 75,
            image: require("../assets/skybar.jpg"),
        },
    ],
    Delhi: [
        {
            id: "4",
            name: "Capital Club",
            type: "club",
            capacity: 300,
            currentOccupancy: 210,
            image: require("../assets/capitalclub.jpg"),
        },
        {
            id: "5",
            name: "Delhi Darbar",
            type: "restaurant",
            capacity: 120,
            currentOccupancy: 90,
            image: require("../assets/delhidarbar.jpg"),
        },
    ],
    Bangalore: [
        {
            id: "6",
            name: "Tech Pub",
            type: "pub",
            capacity: 80,
            currentOccupancy: 60,
            image: require("../assets/techpub.jpg"),
        },
        {
            id: "7",
            name: "Garden Restaurant",
            type: "restaurant",
            capacity: 150,
            currentOccupancy: 45,
            image: require("../assets/gardenrestaurant.jpg"),
        },
    ],
}

const cities = ["Mumbai", "Delhi", "Bangalore"]

const UserHomeScreen = ({ navigation }) => {
    const [selectedCity, setSelectedCity] = useState("Mumbai")
    const [venues, setVenues] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        setVenues(mockVenues[selectedCity] || [])
    }, [selectedCity])

    const renderVenueItem = ({ item }) => {
        const occupancyPercentage = Math.round((item.currentOccupancy / item.capacity) * 100)
        const imageSource = typeof item.image === "string" ? { uri: item.image } : item.image;
        console.log(`Image source for ${item.name}:`, imageSource); // Debug

        return (
            <TouchableOpacity style={styles.venueCard} onPress={() => navigation.navigate("VenueDetail", { venue: item })}>
                <Image source={imageSource} style={styles.venueImage} />
                <View style={styles.venueInfo}>
                    <Text style={styles.venueName}>{item.name}</Text>
                    <Text style={styles.venueType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
                    <View style={styles.occupancyContainer}>
                        <View style={styles.progressBarContainer}>
                            <View
                                style={[
                                    styles.progressBar,
                                    { width: `${occupancyPercentage}%` },
                                    occupancyPercentage > 80
                                        ? styles.highOccupancy
                                        : occupancyPercentage > 50
                                            ? styles.mediumOccupancy
                                            : styles.lowOccupancy,
                                ]}
                            />
                        </View>
                        <Text style={styles.occupancyText}>{occupancyPercentage}% Full</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.greetingContainer}>
                    <Text style={styles.greeting}>Good Morning 🔥</Text>
                    <Text style={styles.userName}>Mr. Casanova</Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Find bars..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.cityPickerContainer}>
                <Text style={styles.cityLabel}>Select City:</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={selectedCity}
                        onValueChange={(itemValue) => setSelectedCity(itemValue)}
                        style={styles.cityPicker}
                        dropdownIconColor="#9CA3AF"
                    >
                        {cities.map((city) => (
                            <Picker.Item key={city} label={city} value={city} color="#FFFFFF" />
                        ))}
                    </Picker>
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Best Venues</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
            </View>

            {venues.length > 0 ? (
                <FlatList
                    data={venues}
                    renderItem={renderVenueItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.venueList}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No venues available in this city</Text>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
    },
    greetingContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: 16,
        color: "#9CA3AF",
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#374151",
        justifyContent: "center",
        alignItems: "center",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F3F4F6",
        borderRadius: 12,
        marginHorizontal: 24,
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 16,
        fontSize: 16,
        color: "#374151",
    },
    cityPickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    cityLabel: {
        fontSize: 16,
        marginRight: 12,
        color: "#FFFFFF",
    },
    pickerWrapper: {
        flex: 1,
        backgroundColor: "#374151",
        borderRadius: 8,
        overflow: "hidden",
    },
    cityPicker: {
        height: 40,
        color: "#FFFFFF",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    viewAllText: {
        fontSize: 14,
        color: "#8B5CF6",
    },
    venueList: {
        paddingHorizontal: 24,
    },
    venueCard: {
        backgroundColor: "#374151",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
    },
    venueImage: {
        width: "100%",
        height: 160,
    },
    venueInfo: {
        padding: 16,
    },
    venueName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    venueType: {
        fontSize: 14,
        color: "#9CA3AF",
        marginBottom: 12,
    },
    occupancyContainer: {
        marginTop: 8,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: "#1F2937",
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 8,
    },
    progressBar: {
        height: "100%",
    },
    lowOccupancy: {
        backgroundColor: "#10B981",
    },
    mediumOccupancy: {
        backgroundColor: "#F59E0B",
    },
    highOccupancy: {
        backgroundColor: "#EF4444",
    },
    occupancyText: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#9CA3AF",
        textAlign: "center",
    },
})

export default UserHomeScreen
