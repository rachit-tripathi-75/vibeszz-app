"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LineChart, BarChart } from "react-native-chart-kit"
import { Ionicons } from "@expo/vector-icons"

// Generate comprehensive demo data
const generateDemoData = () => {
    const data = {
        daily: [],
        monthly: [],
        yearly: []
    }

    // Generate daily data for the last 30 days
    for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const baseFootfall = Math.floor(Math.random() * 100) + 80 // 80-180 range
        const weekendBonus = date.getDay() === 0 || date.getDay() === 6 ? 50 : 0
        data.daily.push({
            date: date.toISOString().split('T')[0],
            count: Math.min(200, baseFootfall + weekendBonus),
            label: `${date.getDate()}/${date.getMonth() + 1}`
        })
    }

    // Generate monthly data for the last 12 months
    for (let i = 11; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const avgDaily = Math.floor(Math.random() * 50) + 100 // 100-150 average
        const monthlyTotal = avgDaily * 30
        data.monthly.push({
            date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
            count: monthlyTotal,
            avgDaily: avgDaily,
            label: date.toLocaleDateString('en', { month: 'short' })
        })
    }

    // Generate yearly data for the last 5 years
    for (let i = 4; i >= 0; i--) {
        const year = new Date().getFullYear() - i
        const avgMonthly = Math.floor(Math.random() * 1000) + 3000 // 3000-4000 average
        const yearlyTotal = avgMonthly * 12
        data.yearly.push({
            date: year.toString(),
            count: yearlyTotal,
            avgMonthly: avgMonthly,
            label: year.toString()
        })
    }

    return data
}

const mockVenue = {
    id: "1",
    name: "Club Illusion",
    type: "club",
    capacity: 200,
    city: "Mumbai",
}

const screenWidth = Dimensions.get("window").width

const OwnerHomeScreen = () => {
    const [venue, setVenue] = useState(mockVenue)
    const [currentFootfall, setCurrentFootfall] = useState("")
    const [selectedPeriod, setSelectedPeriod] = useState("daily") // daily, monthly, yearly
    const [analyticsData, setAnalyticsData] = useState(generateDemoData())
    const [chartData, setChartData] = useState({})

    useEffect(() => {
        updateChartData()
    }, [selectedPeriod, analyticsData])

    const updateChartData = () => {
        let data, labels

        switch (selectedPeriod) {
            case "daily":
                data = analyticsData.daily.slice(-7) // Last 7 days
                labels = data.map(item => item.label)
                break
            case "monthly":
                data = analyticsData.monthly.slice(-6) // Last 6 months
                labels = data.map(item => item.label)
                break
            case "yearly":
                data = analyticsData.yearly
                labels = data.map(item => item.label)
                break
            default:
                data = analyticsData.daily.slice(-7)
                labels = data.map(item => item.label)
        }

        setChartData({
            labels,
            datasets: [{
                data: data.map(item => selectedPeriod === 'daily' ? item.count :
                    selectedPeriod === 'monthly' ? item.avgDaily :
                        item.avgMonthly / 100) // Scale down yearly for better visualization
            }],
        })
    }

    const handleUpdateFootfall = () => {
        if (!currentFootfall) {
            Alert.alert("Error", "Please enter the current footfall")
            return
        }

        const footfall = Number.parseInt(currentFootfall)

        if (isNaN(footfall) || footfall < 0) {
            Alert.alert("Error", "Please enter a valid number")
            return
        }

        if (footfall > venue.capacity) {
            Alert.alert("Error", `Footfall cannot exceed venue capacity (${venue.capacity})`)
            return
        }

        // Update today's footfall in daily data
        const updatedData = { ...analyticsData }
        const todayIndex = updatedData.daily.length - 1
        updatedData.daily[todayIndex].count = footfall

        setAnalyticsData(updatedData)
        setCurrentFootfall("")
        Alert.alert("Success", "Footfall updated successfully")
    }

    const calculateOccupancyPercentage = (count) => {
        return Math.round((count / venue.capacity) * 100)
    }

    const getTodayFootfall = () => {
        return analyticsData.daily[analyticsData.daily.length - 1]?.count || 0
    }

    const getAnalyticsStats = () => {
        const currentData = analyticsData[selectedPeriod]
        if (!currentData.length) return { total: 0, average: 0, peak: 0 }

        const values = currentData.map(item =>
            selectedPeriod === 'daily' ? item.count :
                selectedPeriod === 'monthly' ? item.avgDaily :
                    item.avgMonthly
        )

        return {
            total: values.reduce((sum, val) => sum + val, 0),
            average: Math.round(values.reduce((sum, val) => sum + val, 0) / values.length),
            peak: Math.max(...values)
        }
    }

    const periodButtons = [
        { key: "daily", label: "Daily", icon: "calendar-outline" },
        { key: "monthly", label: "Monthly", icon: "calendar" },
        { key: "yearly", label: "Yearly", icon: "calendar-sharp" }
    ]

    const stats = getAnalyticsStats()

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning 🔥</Text>
                    <Text style={styles.venueName}>{venue.name}</Text>
                    <Text style={styles.venueDetails}>
                        {venue.type.charAt(0).toUpperCase() + venue.type.slice(1)} • {venue.city}
                    </Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Today's Footfall Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Today's Footfall</Text>

                    <View style={styles.footfallContainer}>
                        <View style={styles.currentFootfall}>
                            <Text style={styles.footfallCount}>{getTodayFootfall()}</Text>
                            <Text style={styles.footfallLabel}>/ {venue.capacity}</Text>
                        </View>

                        <View style={styles.occupancyContainer}>
                            <View style={styles.progressBarContainer}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        { width: `${calculateOccupancyPercentage(getTodayFootfall())}%` },
                                        calculateOccupancyPercentage(getTodayFootfall()) > 80
                                            ? styles.highOccupancy
                                            : calculateOccupancyPercentage(getTodayFootfall()) > 50
                                                ? styles.mediumOccupancy
                                                : styles.lowOccupancy,
                                    ]}
                                />
                            </View>
                            <Text style={styles.occupancyText}>{calculateOccupancyPercentage(getTodayFootfall())}% Filled</Text>
                        </View>
                    </View>

                    <View style={styles.updateFootfallContainer}>
                        <Text style={styles.updateLabel}>Update Today's Footfall:</Text>
                        <View style={styles.updateInputContainer}>
                            <TextInput
                                style={styles.updateInput}
                                placeholder="Enter current footfall"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="number-pad"
                                value={currentFootfall}
                                onChangeText={setCurrentFootfall}
                            />
                            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateFootfall}>
                                <Text style={styles.updateButtonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Analytics Period Selection */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Analytics Dashboard</Text>

                    <View style={styles.periodSelector}>
                        {periodButtons.map((period) => (
                            <TouchableOpacity
                                key={period.key}
                                style={[
                                    styles.periodButton,
                                    selectedPeriod === period.key && styles.activePeriodButton
                                ]}
                                onPress={() => setSelectedPeriod(period.key)}
                            >
                                <Ionicons
                                    name={period.icon}
                                    size={20}
                                    color={selectedPeriod === period.key ? "#FFFFFF" : "#9CA3AF"}
                                />
                                <Text style={[
                                    styles.periodButtonText,
                                    selectedPeriod === period.key && styles.activePeriodButtonText
                                ]}>
                                    {period.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Stats Cards */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{stats.average}</Text>
                            <Text style={styles.statLabel}>
                                Avg {selectedPeriod === 'yearly' ? 'Monthly' : 'Daily'}
                            </Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>{stats.peak}</Text>
                            <Text style={styles.statLabel}>Peak</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statValue}>
                                {selectedPeriod === 'daily' ? `${Math.round(stats.average / venue.capacity * 100)}%` :
                                    selectedPeriod === 'monthly' ? `${Math.round(stats.average / venue.capacity * 100)}%` :
                                        `${Math.round(stats.average / venue.capacity * 100)}%`}
                            </Text>
                            <Text style={styles.statLabel}>Avg Fill Rate</Text>
                        </View>
                    </View>

                    {/* Chart */}
                    {chartData.labels && (
                        <LineChart
                            data={chartData}
                            width={screenWidth - 48}
                            height={220}
                            chartConfig={{
                                backgroundColor: "#374151",
                                backgroundGradientFrom: "#374151",
                                backgroundGradientTo: "#374151",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#8B5CF6",
                                },
                            }}
                            bezier
                            style={styles.chart}
                        />
                    )}

                    {/* Detailed History */}
                    <View style={styles.historyList}>
                        <Text style={styles.historyTitle}>
                            Recent {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} History
                        </Text>
                        {analyticsData[selectedPeriod]
                            .slice()
                            .reverse()
                            .slice(0, 5)
                            .map((item, index) => (
                                <View key={index} style={styles.historyItem}>
                                    <Text style={styles.historyDate}>
                                        {selectedPeriod === 'daily' ? new Date(item.date).toLocaleDateString() :
                                            selectedPeriod === 'monthly' ? item.label :
                                                item.label}
                                    </Text>
                                    <View style={styles.historyDetails}>
                                        <Text style={styles.historyCount}>
                                            {selectedPeriod === 'daily' ? `${item.count} visitors` :
                                                selectedPeriod === 'monthly' ? `${item.avgDaily} avg daily` :
                                                    `${item.avgMonthly} avg monthly`}
                                        </Text>
                                        <Text style={styles.historyPercentage}>
                                            {selectedPeriod === 'daily' ? `${calculateOccupancyPercentage(item.count)}% Filled` :
                                                selectedPeriod === 'monthly' ? `${calculateOccupancyPercentage(item.avgDaily)}% Avg Fill` :
                                                    `${Math.round(item.avgMonthly / venue.capacity * 100)}% Avg Fill`}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                    </View>
                </View>
            </ScrollView>
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
    venueName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    venueDetails: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#374151",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
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
        marginBottom: 20,
    },
    footfallContainer: {
        marginBottom: 24,
    },
    currentFootfall: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 16,
    },
    footfallCount: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    footfallLabel: {
        fontSize: 20,
        color: "#9CA3AF",
        marginLeft: 8,
    },
    occupancyContainer: {
        marginTop: 8,
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
    updateFootfallContainer: {
        marginTop: 16,
    },
    updateLabel: {
        fontSize: 16,
        color: "#FFFFFF",
        marginBottom: 12,
    },
    updateInputContainer: {
        flexDirection: "row",
        gap: 12,
    },
    updateInput: {
        flex: 1,
        backgroundColor: "#1F2937",
        borderRadius: 8,
        padding: 12,
        color: "#FFFFFF",
        fontSize: 16,
    },
    updateButton: {
        backgroundColor: "#8B5CF6",
        padding: 12,
        borderRadius: 8,
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    updateButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 16,
    },
    periodSelector: {
        flexDirection: "row",
        backgroundColor: "#1F2937",
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    periodButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        gap: 8,
    },
    activePeriodButton: {
        backgroundColor: "#8B5CF6",
    },
    periodButtonText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#9CA3AF",
    },
    activePeriodButtonText: {
        color: "#FFFFFF",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#1F2937",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#9CA3AF",
        textAlign: "center",
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    historyList: {
        marginTop: 20,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#FFFFFF",
        marginBottom: 16,
    },
    historyItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#1F2937",
    },
    historyDate: {
        fontSize: 16,
        color: "#FFFFFF",
    },
    historyDetails: {
        alignItems: "flex-end",
    },
    historyCount: {
        fontSize: 16,
        fontWeight: "500",
        color: "#FFFFFF",
    },
    historyPercentage: {
        fontSize: 14,
        color: "#9CA3AF",
    },
})

export default OwnerHomeScreen
