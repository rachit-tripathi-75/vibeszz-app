import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const ProfileScreen = () => {
    const menuItems = [
        { id: "1", title: "Edit Profile", icon: "person-outline" },
        { id: "2", title: "Favorite Venues", icon: "heart-outline" },
        { id: "3", title: "Booking History", icon: "time-outline" },
        { id: "4", title: "Payment Methods", icon: "card-outline" },
        { id: "5", title: "Notifications", icon: "notifications-outline" },
        { id: "6", title: "Privacy Settings", icon: "shield-outline" },
        { id: "7", title: "Help & Support", icon: "help-circle-outline" },
        { id: "8", title: "About", icon: "information-circle-outline" },
    ]

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.profileImageContainer}>
                    <Image source={{ uri: "/placeholder.svg?height=100&width=100" }} style={styles.profileImage} />
                    <TouchableOpacity style={styles.editImageButton}>
                        <Ionicons name="camera" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.userName}>Mr. Casanova</Text>
                <Text style={styles.userEmail}>casanova@example.com</Text>

                <TouchableOpacity style={styles.editProfileButton}>
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>24</Text>
                    <Text style={styles.statLabel}>Venues Visited</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Favorites</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>8</Text>
                    <Text style={styles.statLabel}>Reviews</Text>
                </View>
            </View>

            <View style={styles.menuContainer}>
                {menuItems.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name={item.icon as any} size={24} color="#9CA3AF" />
                            <Text style={styles.menuItemText}>{item.title}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    header: {
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 32,
    },
    profileImageContainer: {
        position: "relative",
        marginBottom: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#374151",
    },
    editImageButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#8B5CF6",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#000000",
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: "#9CA3AF",
        marginBottom: 20,
    },
    editProfileButton: {
        backgroundColor: "#8B5CF6",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    editProfileText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "#374151",
        marginHorizontal: 24,
        borderRadius: 16,
        paddingVertical: 20,
        marginBottom: 32,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    statDivider: {
        width: 1,
        backgroundColor: "#4B5563",
    },
    menuContainer: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#374151",
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    menuItemText: {
        fontSize: 16,
        color: "#FFFFFF",
        marginLeft: 16,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 24,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: "#EF4444",
        borderRadius: 12,
        marginBottom: 40,
    },
    logoutText: {
        fontSize: 16,
        color: "#EF4444",
        marginLeft: 8,
        fontWeight: "600",
    },
})

export default ProfileScreen
