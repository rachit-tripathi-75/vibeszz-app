"use client"

import { useState } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import UserHomeScreen from "../screens/UserHomeScreen"
import CallScreen from "../screens/CallScreen"
import DrinksScreen from "../screens/DrinksScreen"
import GamesScreen from "../screens/GamesScreen"
import ProfileScreen from "../screens/ProfileScreen"

type TabName = "Home" | "Call" | "Drinks" | "Games" | "Profile"

const UserMainScreen = () => {
    const [activeTab, setActiveTab] = useState<TabName>("Home")

    const renderScreen = () => {
        switch (activeTab) {
            case "Home":
                return <UserHomeScreen />
            case "Call":
                return <CallScreen />
            // case "Drinks":
            //     return <DrinksScreen />
            // case "Games":
            //     return <GamesScreen />
            case "Profile":
                return <ProfileScreen />
            default:
                return <UserHomeScreen />
        }
    }

    const TabButton = ({
                           name,
                           icon,
                           isActive,
                           onPress,
                       }: {
        name: TabName
        icon: string
        isActive: boolean
        onPress: () => void
    }) => (
        <TouchableOpacity style={styles.tabButton} onPress={onPress}>
            <Ionicons name={icon as any} size={24} color={isActive ? "#8B5CF6" : "#9CA3AF"} />
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>{renderScreen()}</View>

            <View style={styles.bottomNavigation}>
                <TabButton name="Home" icon="home" isActive={activeTab === "Home"} onPress={() => setActiveTab("Home")} />
                <TabButton name="Call" icon="call" isActive={activeTab === "Call"} onPress={() => setActiveTab("Call")} />
                {/*<TabButton name="Drinks" icon="wine" isActive={activeTab === "Drinks"} onPress={() => setActiveTab("Drinks")} />*/}
                {/*<TabButton name="Games" icon="game-controller" isActive={activeTab === "Games"} onPress={() => setActiveTab("Games")} />*/}
                <TabButton name="Profile" icon="person" isActive={activeTab === "Profile"} onPress={() => setActiveTab("Profile")} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    content: {
        flex: 1,
    },
    bottomNavigation: {
        flexDirection: "row",
        backgroundColor: "#1F2937",
        paddingVertical: 12,
        paddingHorizontal: 20,
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#374151",
    },
    tabButton: {
        padding: 8,
        borderRadius: 20,
        minWidth: 40,
        alignItems: "center",
    },
})

export default UserMainScreen
