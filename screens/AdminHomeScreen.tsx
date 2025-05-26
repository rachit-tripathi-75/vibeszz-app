"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { Ionicons } from "@expo/vector-icons"

const Tab = createMaterialTopTabNavigator()

// Mock data for venues
const mockVenues = {
    approved: [
        {
            id: "1",
            name: "Club Illusion",
            type: "club",
            city: "Mumbai",
            capacity: 200,
            image: require("../assets/clubillusion.jpg"),
        },
        {
            id: "2",
            name: "Spice Restaurant",
            type: "restaurant",
            city: "Mumbai",
            capacity: 100,
            image: require("../assets/spceresaurant.jpg"),
        },
        { id: "3", name: "Skybar", type: "bar", city: "Delhi", capacity: 150, image: require("../assets/skybar.jpg") },
    ],
    requested: [
        {
            id: "4",
            name: "Capital Club",
            type: "club",
            city: "Delhi",
            capacity: 300,
            image: require("../assets/capitalclub.jpg"),
        },
        {
            id: "5",
            name: "Delhi Darbar",
            type: "restaurant",
            city: "Delhi",
            capacity: 120,
            image: require("../assets/delhidarbar.jpg"),
        },
    ],
    cancelled: [
        {
            id: "6",
            name: "Tech Pub",
            type: "pub",
            city: "Bangalore",
            capacity: 80,
            image: require("../assets/techpub.jpg"),
        },
    ],
}

const ApprovedScreen = () => {
    const [venues, setVenues] = useState(mockVenues.approved)

    const renderVenueItem = ({ item }) => (
        <View style={styles.venueCard}>
            <Image source={item.image} style={styles.venueImage} />
            <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{item.name}</Text>
                <Text style={styles.venueType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
                <Text style={styles.venueCity}>{item.city}</Text>
                <Text style={styles.venueCapacity}>Capacity: {item.capacity}</Text>
            </View>
        </View>
    )

    return (
        <View style={styles.tabContainer}>
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
                    <Text style={styles.emptyStateText}>No approved venues</Text>
                </View>
            )}
        </View>
    )
}

const RequestedScreen = () => {
    const [venues, setVenues] = useState(mockVenues.requested)

    const handleApprove = (id) => {
        Alert.alert("Success", "Venue approved successfully")
        setVenues(venues.filter((venue) => venue.id !== id))
    }

    const handleReject = (id) => {
        Alert.alert("Success", "Venue rejected successfully")
        setVenues(venues.filter((venue) => venue.id !== id))
    }

    const renderVenueItem = ({ item }) => (
        <View style={styles.venueCard}>
            <Image source={item.image} style={styles.venueImage} />
            <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{item.name}</Text>
                <Text style={styles.venueType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
                <Text style={styles.venueCity}>{item.city}</Text>
                <Text style={styles.venueCapacity}>Capacity: {item.capacity}</Text>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.actionButton, styles.approveButton]} onPress={() => handleApprove(item.id)}>
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => handleReject(item.id)}>
                        <Ionicons name="close" size={16} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

    return (
        <View style={styles.tabContainer}>
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
                    <Text style={styles.emptyStateText}>No pending requests</Text>
                </View>
            )}
        </View>
    )
}

const CancelledScreen = () => {
    const [venues, setVenues] = useState(mockVenues.cancelled)

    const renderVenueItem = ({ item }) => (
        <View style={styles.venueCard}>
            <Image source={item.image} style={styles.venueImage} />
            <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{item.name}</Text>
                <Text style={styles.venueType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
                <Text style={styles.venueCity}>{item.city}</Text>
                <Text style={styles.venueCapacity}>Capacity: {item.capacity}</Text>
            </View>
        </View>
    )

    return (
        <View style={styles.tabContainer}>
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
                    <Text style={styles.emptyStateText}>No cancelled venues</Text>
                </View>
            )}
        </View>
    )
}

const AdminHomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning 🔥</Text>
                    <Text style={styles.title}>Admin Dashboard</Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: "#8B5CF6",
                    tabBarInactiveTintColor: "#9CA3AF",
                    tabBarIndicatorStyle: { backgroundColor: "#8B5CF6" },
                    tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
                    tabBarStyle: { backgroundColor: "#374151" },
                }}
            >
                <Tab.Screen name="Approved" component={ApprovedScreen} />
                <Tab.Screen name="Requested" component={RequestedScreen} />
                <Tab.Screen name="Cancelled" component={CancelledScreen} />
            </Tab.Navigator>
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
    greeting: {
        fontSize: 16,
        color: "#9CA3AF",
        marginBottom: 4,
    },
    title: {
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
    tabContainer: {
        flex: 1,
        backgroundColor: "#000000",
    },
    venueList: {
        padding: 24,
    },
    venueCard: {
        backgroundColor: "#374151",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
    },
    venueImage: {
        width: "100%",
        height: 120,
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
        marginBottom: 4,
    },
    venueCity: {
        fontSize: 14,
        color: "#9CA3AF",
        marginBottom: 4,
    },
    venueCapacity: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    actionButtons: {
        flexDirection: "row",
        marginTop: 12,
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        borderRadius: 8,
        gap: 4,
    },
    approveButton: {
        backgroundColor: "#10B981",
    },
    rejectButton: {
        backgroundColor: "#EF4444",
    },
    actionButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 14,
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

export default AdminHomeScreen
