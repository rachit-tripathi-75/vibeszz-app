import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

const VenueDetailScreen = ({ route, navigation }) => {
    const { venue } = route.params
    const occupancyPercentage = Math.round((venue.currentOccupancy / venue.capacity) * 100)

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Venue Details</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Image source={venue.image} style={styles.venueImage} />

                <View style={styles.content}>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <Text style={styles.venueType}>{venue.type.charAt(0).toUpperCase() + venue.type.slice(1)}</Text>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Current Availability</Text>

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
                            <Text style={styles.occupancyText}>
                                {occupancyPercentage}% Full ({venue.currentOccupancy}/{venue.capacity})
                            </Text>
                        </View>

                        <View style={styles.statusIndicator}>
                            <Text
                                style={[
                                    styles.statusText,
                                    occupancyPercentage > 80
                                        ? styles.crowdedText
                                        : occupancyPercentage > 50
                                            ? styles.moderateText
                                            : styles.availableText,
                                ]}
                            >
                                {occupancyPercentage > 80 ? "Crowded" : occupancyPercentage > 50 ? "Moderate" : "Available"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Venue Information</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Type:</Text>
                            <Text style={styles.infoValue}>{venue.type.charAt(0).toUpperCase() + venue.type.slice(1)}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Capacity:</Text>
                            <Text style={styles.infoValue}>{venue.capacity} people</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Current Occupancy:</Text>
                            <Text style={styles.infoValue}>{venue.currentOccupancy} people</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.backToVenuesButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back to Venues</Text>
                </TouchableOpacity>
            </View>
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
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#374151",
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    placeholder: {
        width: 40,
    },
    venueImage: {
        width: "100%",
        height: 200,
    },
    content: {
        padding: 24,
    },
    venueName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    venueType: {
        fontSize: 16,
        color: "#9CA3AF",
        marginBottom: 24,
    },
    card: {
        backgroundColor: "#374151",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 16,
    },
    occupancyContainer: {
        marginBottom: 16,
    },
    progressBarContainer: {
        height: 12,
        backgroundColor: "#1F2937",
        borderRadius: 6,
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
        fontSize: 16,
        color: "#9CA3AF",
    },
    statusIndicator: {
        alignItems: "center",
        marginTop: 12,
    },
    statusText: {
        fontSize: 16,
        fontWeight: "600",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    availableText: {
        color: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
    },
    moderateText: {
        color: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
    },
    crowdedText: {
        color: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 12,
    },
    infoLabel: {
        width: 150,
        fontSize: 16,
        color: "#9CA3AF",
    },
    infoValue: {
        flex: 1,
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "500",
    },
    footer: {
        padding: 24,
    },
    backToVenuesButton: {
        backgroundColor: "#8B5CF6",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
})

export default VenueDetailScreen
