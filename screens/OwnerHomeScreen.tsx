// App.tsx
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    Image,
    FlatList, ActivityIndicator
} from 'react-native';
import {db} from "../config/firebaseConfig";
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {ref, set, onValue, get} from 'firebase/database';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {LineChart, BarChart} from "react-native-chart-kit"
import {Ionicons} from "@expo/vector-icons"
import {CommonActions} from "@react-navigation/native";
import SignInScreen from "./SignInScreen";
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const ownerId: string = 'owner174';
const venueCapacity: number = 400;


interface FootfallData {
    [year: string]: {
        [month: string]: {
            [day: string]: {
                count: number;
            };
        };
    };
}

interface OwnerData {
    capacity: number;
    city: string;
    footfall: FootfallData;
    id: string;
    mobileNumber: string;
    ownerName: string;
    password: string;
    photoBase64?: string;
    status: number;
    venueName: string;
    venueType: string;
}

interface TodayFootfallResponse {
    count: number;
}

const OwnerProfileScreen: React.FC = () => {
    const navigation = useNavigation();
    const [profileData, setProfileData] = useState<OwnerData | null>(null);


    useEffect(() => {
        const getOwnerProfileDetails = () => {

            const path = `ownerdb/${ownerId}`;
            const ownerProfileDetailsPref = ref(db, path);

            const unsubscribe = onValue(ownerProfileDetailsPref, (snapshot) => {
                if (snapshot.exists()) {
                    const data: OwnerData = snapshot.val();
                    setProfileData(data);
                    console.log(`yes i found user's data`);
                } else {
                    setProfileData(null);
                }

            }, (error) => {
                console.error("Error fetching owner's profile details: " + error);
                setProfileData(null);
            });
            return () => unsubscribe();
        };

        getOwnerProfileDetails()


    }, []);

    const handleLogout = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: "SignIn"}]
            })
        )
    }

    return (
        <ScrollView style={styles.containerProfileScreen} showsVerticalScrollIndicator={false}>
            <View style={styles.headerProfileScreen}>
                <View style={styles.profileImageContainer}>
                    <Image source={{uri: `data:image/jpeg;base64,${profileData?.photoBase64}`}}
                           style={styles.profileImage}/>
                    <TouchableOpacity style={styles.editImageButton}>
                        <Ionicons name="camera" size={16} color="#FFFFFF"/>
                    </TouchableOpacity>
                </View>

                <Text style={styles.userName}>{profileData?.ownerName}</Text>
                <Text style={styles.userEmail}>{profileData?.mobileNumber}</Text>


            </View>


            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#EF4444"/>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    )


}

const Tab = createBottomTabNavigator();

const OwnerHomeScreen: React.FC = () => {
    return (
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Home" component={UploadAndViewFootfallScreen}
                        options={{
                            tabBarIcon: ({color, size}) => (
                                <Ionicons name="home-outline" color={color} size={size}/>
                            ),
                        }}/>
            <Tab.Screen name="Profile" component={OwnerProfileScreen}
                        options={{
                            tabBarIcon: ({color, size}) => (
                                <Ionicons name="person-outline" color={color} size={size}/>
                            ),
                        }}/>
        </Tab.Navigator>

    );
};

export default OwnerHomeScreen;


const mockVenue = {
    id: "1",
    name: "Club Illusion",
    type: "club",
    capacity: 200,
    city: "Mumbai",
}

const groupByPeriod = (data, period) => {
    const grouped = {};

    data.forEach(({date, count}) => {
        let key;
        if (period === 'daily') {
            key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (period === 'monthly') {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else if (period === 'yearly') {
            key = `${date.getFullYear()}`;
        }

        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(count);
    });

    return Object.keys(grouped).map(label => {
        const total = grouped[label].reduce((a, b) => a + b, 0);
        const avg = Math.round(total / grouped[label].length);

        return {
            label,
            count: total,
            avgDaily: avg,
            avgMonthly: avg,
        };
    });
}

const flattenFootfallData = (footfallData) => {
    const result = [];

    for (const year in footfallData) {
        for (const month in footfallData[year]) {
            for (const day in footfallData[year][month]) {
                const count = footfallData[year][month][day].count;
                // const date = new Date(`${year}-${month}-${day}`);
                const date = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
                result.push({date, count});
            }
        }
    }

    return result;
};


const UploadAndViewFootfallScreen = () => {
    const [venue, setVenue] = useState(mockVenue)
    // const [currentFootfall, setCurrentFootfall] = useState("")
    const [selectedPeriod, setSelectedPeriod] = useState("daily") // daily, monthly, yearly
    // const [analyticsData, setAnalyticsData] = useState(generateDemoData())
    const [chartData, setChartData] = useState({})
    const [footfallCount, setFootfallCount] = useState<string>('');
    const [footfall, setFootfall] = useState([]);
    const rawData = footfall;
    const groupedData = groupByPeriod(rawData, selectedPeriod);
    const [approvedOwnerIds, setApprovedOwnerIds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [todayFootfall, setTodayFootfall] = useState(0);
    const [capacity, setCapacity] = useState(0);

    const fetchFootfall = (year = null, month = null, day = null) => {
        // let path = `/ownerdb/${ownerId}/footfall/${year}`;
        // if (month) path += `/${month}`;
        // if (day) path += `/${day}`;
        let path = `/ownerdb/${ownerId}/footfall`;
        if (year) path += `/${year}`;
        if (month) path += `/${month}`;
        if (day) path += `/${day}`;


        const footfallRef = ref(db, path);

        onValue(
            footfallRef,
            (snapshot) => {
                const data = snapshot.val();
                console.log("Snapshot data: ", data);
                if (data) {
                    const formatted = flattenFootfallData(
                        year && month && day ? {[year]: {[month]: {[day]: data}}} :
                            year && month ? {[year]: {[month]: data}} :
                                year ? {[year]: data} :
                                    data
                    );
                    setFootfall(formatted);
                } else {
                    console.log('No footfall data found');
                    setFootfall([]);
                }
            },
            (error) => {
                console.error("Error fetching footfall: " + error);
                Alert.alert('Error', "Could not fetch footfall data: " + error.message);
            }
        );
    };


    useEffect(() => {
        fetchFootfall();
    }, []);


    useEffect(() => {
        const approvedOwnersRef = ref(db, 'approved/ownerIds');
        const unsubscribe = onValue(
            approvedOwnersRef, (snapshot) => {
                const data = snapshot.val();
                console.log('Approved owners data: ', data);
                if (data) {
                    const idsArray = Object.values(data);
                    setApprovedOwnerIds(idsArray);
                } else {
                    console.log('No approved owners found');
                    setApprovedOwnerIds([]);
                }
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching approved owners: " + error);
                Alert.alert('Error', "Could not fetch approved owners: " + error.message);
                setIsLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);


    const handleUpdateFootfall = async () => {

        // if (!currentFootfall) {
        //     Alert.alert("Error", "Please enter the current footfall")
        //     return
        // }
        //
        // const footfall = Number.parseInt(currentFootfall)
        //
        // if (isNaN(footfall) || footfall < 0) {
        //     Alert.alert("Error", "Please enter a valid number")
        //     return
        // }
        //
        // if (footfall > venue.capacity) {
        //     Alert.alert("Error", `Footfall cannot exceed venue capacity (${venue.capacity})`)
        //     return
        // }

        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');

        const count = parseInt(footfallCount);
        if (isNaN(count) || count < 0 || count > capacity) {
            Alert.alert('Invalid Input', `Enter a number between 0 and ${capacity}`);
            return;
        }


        const footfallRef = ref(db, `/ownerdb/${ownerId}/footfall/${year}/${month}/${day}`);

        try {
            await set(footfallRef, {
                count,
            });
            Alert.alert('Success', 'Footfall updated successfully!');
            setFootfallCount('');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Error updating footfall');
        }


        // Update today's footfall in daily data
        // const updatedData = {...analyticsData}
        // const todayIndex = updatedData.daily.length - 1
        // updatedData.daily[todayIndex].count = count
        //
        // setAnalyticsData(updatedData)
        // setCurrentFootfall("")
        setFootfallCount('');
        Alert.alert("Success", "Footfall updated successfully")
    }


    const calculateOccupancyPercentage = (count) => {
        return Math.round((count / capacity) * 100)
    }


    useEffect(() => {
        const getCapacity = () => {
            // fetch the owner's capacity from firebase, and set that value..........


            const path = `ownerdb/${ownerId}`;
            const capacityRef = ref(db, path);


            const unsubscribe = onValue(capacityRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setCapacity(data.capacity);
                    console.log(`Capacity for ownerID ${ownerId}: ` + data.capacity);
                } else {
                    setCapacity(0);
                    console.log(`Capacity for ownerID ${ownerId}: ` + snapshot.val().capacity);
                }

            }, (error) => {
                console.error("Error fetching today's footfall: " + error.message);
                setCapacity(0)
            });
            return () => unsubscribe();
        };

        getCapacity();

    }, [ownerId]);


    useEffect(() => {
        const getTodayFootfall = () => {
            // fetch today's footfall from firebase, and return that value..........


            const today = new Date();
            const year = today.getFullYear().toString();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            const path = `ownerdb/${ownerId}/footfall/${year}/${month}/${day}`;
            const footfallRef = ref(db, path);


            const unsubscribe = onValue(footfallRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setTodayFootfall(typeof data === 'object' ? data.count : 0);
                } else {
                    setTodayFootfall(0);
                }

            }, (error) => {
                console.error("Error fetching today's footfall: " + error);
                setTodayFootfall(0);
            });
            return () => unsubscribe();
        };

        getTodayFootfall();


    }, [ownerId])


    // const getAnalyticsStats = () => {
    //     const currentData = analyticsData[selectedPeriod]
    //     if (!currentData.length) return {total: 0, average: 0, peak: 0}
    //
    //     const values = currentData.map(item =>
    //         selectedPeriod === 'daily' ? item.count :
    //             selectedPeriod === 'monthly' ? item.avgDaily :
    //                 item.avgMonthly
    //     )
    //
    //     return {
    //         total: values.reduce((sum, val) => sum + val, 0),
    //         average: Math.round(values.reduce((sum, val) => sum + val, 0) / values.length),
    //         peak: Math.max(...values)
    //     }
    // }

    const periodButtons = [
        {key: "daily", label: "Daily", icon: "calendar-outline"},
        {key: "monthly", label: "Monthly", icon: "calendar"},
        {key: "yearly", label: "Yearly", icon: "calendar-sharp"}
    ]

    // const stats = getAnalyticsStats()


    const renderHistoryItem = ({item}) => (
        <View style={styles.historyItem}>
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
                            `${Math.round(item.avgMonthly / capacity * 100)}% Avg Fill`}
                </Text>
            </View>
        </View>
    );
    return (
        <SafeAreaView style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF"/>
                </View>
            ) : approvedOwnerIds.includes(ownerId) ? (
                <>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Good Morning 🔥</Text>
                            <Text style={styles.venueName}>{venue.name}</Text>
                            <Text style={styles.venueDetails}>
                                {venue.type.charAt(0).toUpperCase() + venue.type.slice(1)} • {venue.city}
                            </Text>
                        </View>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Today's Footfall Card */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Today's Footfall</Text>

                            <View style={styles.footfallContainer}>
                                <View style={styles.currentFootfall}>
                                    <Text style={styles.footfallCount}>{todayFootfall}</Text>
                                    <Text style={styles.footfallLabel}>/ {capacity}</Text>
                                </View>

                                <View style={styles.occupancyContainer}>
                                    <View style={styles.progressBarContainer}>
                                        <View
                                            style={[
                                                styles.progressBar,
                                                {width: `${calculateOccupancyPercentage(todayFootfall)}%`},
                                                calculateOccupancyPercentage(todayFootfall) > 80
                                                    ? styles.highOccupancy
                                                    : calculateOccupancyPercentage(todayFootfall) > 50
                                                        ? styles.mediumOccupancy
                                                        : styles.lowOccupancy,
                                            ]}
                                        />
                                    </View>
                                    <Text
                                        style={styles.occupancyText}>{calculateOccupancyPercentage(todayFootfall)}%
                                        Filled</Text>
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
                                        value={footfallCount}
                                        onChangeText={setFootfallCount}
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

                            {/*/!* Stats Cards *!/*/}
                            {/*<View style={styles.statsContainer}>*/}
                            {/*    <View style={styles.statCard}>*/}
                            {/*        <Text style={styles.statValue}>{stats.average}</Text>*/}
                            {/*        <Text style={styles.statLabel}>*/}
                            {/*            Avg {selectedPeriod === 'yearly' ? 'Monthly' : 'Daily'}*/}
                            {/*        </Text>*/}
                            {/*    </View>*/}
                            {/*    <View style={styles.statCard}>*/}
                            {/*        <Text style={styles.statValue}>{stats.peak}</Text>*/}
                            {/*        <Text style={styles.statLabel}>Peak</Text>*/}
                            {/*    </View>*/}
                            {/*    <View style={styles.statCard}>*/}
                            {/*        <Text style={styles.statValue}>*/}
                            {/*            {selectedPeriod === 'daily' ? `${Math.round(stats.average / venue.capacity * 100)}%` :*/}
                            {/*                selectedPeriod === 'monthly' ? `${Math.round(stats.average / venue.capacity * 100)}%` :*/}
                            {/*                    `${Math.round(stats.average / venue.capacity * 100)}%`}*/}
                            {/*        </Text>*/}
                            {/*        <Text style={styles.statLabel}>Avg Fill Rate</Text>*/}
                            {/*    </View>*/}
                            {/*</View>*/}

                            {/*/!* Chart *!/*/}
                            {/*{chartData.labels && (*/}
                            {/*    <LineChart*/}
                            {/*        data={chartData}*/}
                            {/*        width={screenWidth - 70}*/}
                            {/*        height={220}*/}
                            {/*        chartConfig={{*/}
                            {/*            backgroundColor: "#374151",*/}
                            {/*            backgroundGradientFrom: "#374151",*/}
                            {/*            backgroundGradientTo: "#374151",*/}
                            {/*            decimalPlaces: 0,*/}
                            {/*            color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,*/}
                            {/*            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,*/}
                            {/*            style: {*/}
                            {/*                borderRadius: 16,*/}
                            {/*            },*/}
                            {/*            propsForDots: {*/}
                            {/*                r: "6",*/}
                            {/*                strokeWidth: "2",*/}
                            {/*                stroke: "#8B5CF6",*/}
                            {/*            },*/}
                            {/*        }}*/}
                            {/*        bezier*/}
                            {/*        style={styles.chart}*/}
                            {/*    />*/}
                            {/*)}*/}

                            {/* Detailed History */}
                            <View style={styles.historyList}>
                                <Text style={styles.historyTitle}>
                                    Recent {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} History
                                </Text>
                                <FlatList
                                    // data={[...analyticsData[selectedPeriod]].reverse().slice(0, 5)} // recent 5 items in reverse order
                                    data={groupedData.reverse()}
                                    renderItem={renderHistoryItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    ListEmptyComponent={
                                        <Text style={styles.emptyText}>No data found</Text>
                                    }
                                />
                            </View>
                        </View>
                    </ScrollView>
                </>
            ) : (
                <View style={styles.notApprovedContainer}>
                    <Text style={styles.notApprovedText}>
                        Your profile has not been approved yet by admin
                    </Text>
                    <Text style={styles.notApprovedSubText}>
                        Please contact support if you believe this is an error
                    </Text>
                </View>
            )}

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:
            "#000000",
    }
    ,
    header: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems:
            "center",
        paddingHorizontal:
            24,
        paddingTop:
            16,
        paddingBottom:
            24,
    }
    ,
    greeting: {
        fontSize: 16,
        color:
            "#9CA3AF",
        marginBottom:
            4,
    }
    ,
    venueName: {
        fontSize: 24,
        fontWeight:
            "bold",
        color:
            "#FFFFFF",
        marginBottom:
            4,
    }
    ,
    venueDetails: {
        fontSize: 14,
        color:
            "#9CA3AF",
    }
    ,
    notificationButton: {
        width: 44,
        height:
            44,
        borderRadius:
            22,
        backgroundColor:
            "#374151",
        justifyContent:
            "center",
        alignItems:
            "center",
    }
    ,
    content: {
        flex: 1,
        paddingHorizontal:
            24,
    }
    ,
    card: {
        backgroundColor: "#374151",
        borderRadius:
            16,
        padding:
            20,
        marginBottom:
            20,
    }
    ,
    cardTitle: {
        fontSize: 20,
        fontWeight:
            "bold",
        color:
            "#FFFFFF",
        marginBottom:
            20,
    }
    ,
    footfallContainer: {
        marginBottom: 24,
    }
    ,
    currentFootfall: {
        flexDirection: "row",
        alignItems:
            "baseline",
        marginBottom:
            16,
    }
    ,
    footfallCount: {
        fontSize: 48,
        fontWeight:
            "bold",
        color:
            "#FFFFFF",
    }
    ,
    footfallLabel: {
        fontSize: 20,
        color:
            "#9CA3AF",
        marginLeft:
            8,
    }
    ,
    occupancyContainer: {
        marginTop: 8,
    }
    ,
    progressBarContainer: {
        height: 12,
        backgroundColor:
            "#1F2937",
        borderRadius:
            6,
        overflow:
            "hidden",
        marginBottom:
            8,
    }
    ,
    progressBar: {
        height: "100%",
    }
    ,
    lowOccupancy: {
        backgroundColor: "#10B981",
    }
    ,
    mediumOccupancy: {
        backgroundColor: "#F59E0B",
    }
    ,
    highOccupancy: {
        backgroundColor: "#EF4444",
    }
    ,
    occupancyText: {
        fontSize: 16,
        color:
            "#9CA3AF",
    }
    ,
    updateFootfallContainer: {
        marginTop: 16,
    }
    ,
    updateLabel: {
        fontSize: 16,
        color:
            "#FFFFFF",
        marginBottom:
            12,
    }
    ,
    updateInputContainer: {
        flexDirection: "row",
        gap:
            12,
    }
    ,
    updateInput: {
        flex: 1,
        backgroundColor:
            "#1F2937",
        borderRadius:
            8,
        padding:
            12,
        color:
            "#FFFFFF",
        fontSize:
            16,
    }
    ,
    updateButton: {
        backgroundColor: "#8B5CF6",
        padding:
            12,
        borderRadius:
            8,
        justifyContent:
            "center",
        paddingHorizontal:
            20,
    }
    ,
    updateButtonText: {
        color: "#FFFFFF",
        fontWeight:
            "600",
        fontSize:
            16,
    }
    ,
    periodSelector: {
        flexDirection: "row",
        backgroundColor:
            "#1F2937",
        borderRadius:
            12,
        padding:
            4,
        marginBottom:
            20,
    }
    ,
    periodButton: {
        flex: 1,
        flexDirection:
            "row",
        alignItems:
            "center",
        justifyContent:
            "center",
        paddingVertical:
            12,
        paddingHorizontal:
            16,
        borderRadius:
            8,
        gap:
            8,
    }
    ,
    activePeriodButton: {
        backgroundColor: "#8B5CF6",
    }
    ,
    periodButtonText: {
        fontSize: 14,
        fontWeight:
            "500",
        color:
            "#9CA3AF",
    }
    ,
    activePeriodButtonText: {
        color: "#FFFFFF",
    }
    ,
    statsContainer: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        marginBottom:
            20,
        gap:
            12,
    }
    ,
    statCard: {
        flex: 1,
        backgroundColor:
            "#1F2937",
        borderRadius:
            12,
        padding:
            16,
        alignItems:
            "center",
    }
    ,
    statValue: {
        fontSize: 24,
        fontWeight:
            "bold",
        color:
            "#FFFFFF",
        marginBottom:
            4,
    }
    ,
    statLabel: {
        fontSize: 12,
        color:
            "#9CA3AF",
        textAlign:
            "center",
    }
    ,
    chart: {
        marginVertical: 8,
        borderRadius:
            16,
    }
    ,
    historyList: {
        marginTop: 20,
    }
    ,
    historyTitle: {
        fontSize: 18,
        fontWeight:
            "600",
        color:
            "#FFFFFF",
        marginBottom:
            16,
    }
    ,
    historyItem: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        paddingVertical:
            12,
        borderBottomWidth:
            1,
        borderBottomColor:
            "#1F2937",
    }
    ,
    historyDate: {
        fontSize: 16,
        color:
            "#FFFFFF",
    }
    ,
    historyDetails: {
        alignItems: "flex-end",
    }
    ,
    historyCount: {
        fontSize: 16,
        fontWeight:
            "500",
        color:
            "#FFFFFF",
    }
    ,
    historyPercentage: {
        fontSize: 14,
        color:
            "#9CA3AF",
    }
    ,


    containerProfileScreen: {
        flex: 1,
        backgroundColor:
            "#000000",
    }
    ,
    headerProfileScreen: {
        alignItems: "center",
        paddingHorizontal:
            24,
        paddingTop:
            40,
        paddingBottom:
            32,
    }
    ,
    profileImageContainer: {
        position: "relative",
        marginBottom:
            16,
    }
    ,
    profileImage: {
        width: 100,
        height:
            100,
        borderRadius:
            50,
        backgroundColor:
            "#374151",
    }
    ,
    editImageButton: {
        position: "absolute",
        bottom:
            0,
        right:
            0,
        backgroundColor:
            "#8B5CF6",
        width:
            32,
        height:
            32,
        borderRadius:
            16,
        justifyContent:
            "center",
        alignItems:
            "center",
        borderWidth:
            3,
        borderColor:
            "#000000",
    }
    ,
    userName: {
        fontSize: 24,
        fontWeight:
            "bold",
        color:
            "#FFFFFF",
        marginBottom:
            4,
    }
    ,
    userEmail: {
        fontSize: 16,
        color:
            "#9CA3AF",
        marginBottom:
            20,
    }
    ,
    editProfileButton: {
        backgroundColor: "#8B5CF6",
        paddingHorizontal:
            24,
        paddingVertical:
            12,
        borderRadius:
            8,
    }
    ,
    editProfileText: {
        color: "#FFFFFF",
        fontSize:
            16,
        fontWeight:
            "600",
    }
    ,
    statsContainerProfileScreen: {
        flexDirection: "row",
        backgroundColor:
            "#374151",
        marginHorizontal:
            24,
        borderRadius:
            16,
        paddingVertical:
            20,
        marginBottom:
            32,
    }
    ,
    statItem: {
        flex: 1,
        alignItems:
            "center",
    }
    ,
    statNumber: {
        fontSize: 24,
        fontWeight:
            "bold",
        color:
            "#FFFFFF",
        marginBottom:
            4,
    }
    ,
    statLabelProfileScreen: {
        fontSize: 14,
        color:
            "#9CA3AF",
    }
    ,
    statDivider: {
        width: 1,
        backgroundColor:
            "#4B5563",
    }
    ,
    menuContainer: {
        paddingHorizontal: 24,
        marginBottom:
            32,
    }
    ,
    menuItem: {
        flexDirection: "row",
        justifyContent:
            "space-between",
        alignItems:
            "center",
        paddingVertical:
            16,
        borderBottomWidth:
            1,
        borderBottomColor:
            "#374151",
    }
    ,
    menuItemLeft: {
        flexDirection: "row",
        alignItems:
            "center",
    }
    ,
    menuItemText: {
        fontSize: 16,
        color:
            "#FFFFFF",
        marginLeft:
            16,
    }
    ,
    logoutButton: {
        flexDirection: "row",
        alignItems:
            "center",
        justifyContent:
            "center",
        marginHorizontal:
            24,
        paddingVertical:
            16,
        borderWidth:
            1,
        borderColor:
            "#EF4444",
        borderRadius:
            12,
        marginBottom:
            40,
    }
    ,
    logoutText: {
        fontSize: 16,
        color:
            "#EF4444",
        marginLeft:
            8,
        fontWeight:
            "600",
    },
    emptyText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: 20,
        fontSize: 16,
    },
    notApprovedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    notApprovedText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    notApprovedSubText: {
        color: '#9CA3AF',
        fontSize: 14,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

// export default OwnerHomeScreen
