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
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";


const getData = async (key: string): Promise<string | null> => {
    try {
        const value: string | null = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.error("Reading error: ", error);
        return null;
    }
};

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
    const [ownerId, setOwnerId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOwnerId = async () => {
            const value = await getData('ownerId');
            setOwnerId(value);
        };
        fetchOwnerId();
    }, []);

    useEffect(() => {
        if (!ownerId) return;

        const getOwnerProfileDetails = () => {
            const path = `ownerdb/${ownerId}`;
            const ownerProfileDetailsPref = ref(db, path);

            const unsubscribe = onValue(ownerProfileDetailsPref, (snapshot) => {
                if (snapshot.exists()) {
                    const data: OwnerData = snapshot.val();
                    setProfileData(data);
                } else {
                    setProfileData(null);
                }
                setLoading(false);
            }, (error) => {
                console.error("Error fetching owner's profile details: " + error);
                setProfileData(null);
                setLoading(false);
            });
            return () => unsubscribe();
        };

        getOwnerProfileDetails();
    }, [ownerId]);

    const handleLogout = async () => {
        try {
            await AsyncStorage.clear();
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "SignIn" }],
                })
            );
        } catch (e) {
            console.error('Logout error:', e);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.containerProfileScreen} showsVerticalScrollIndicator={false}>
            <View style={styles.headerProfileScreen}>
                <View style={styles.profileImageContainer}>
                    {profileData?.photoBase64 ? (
                        <Image
                            source={{uri: `data:image/jpeg;base64,${profileData.photoBase64}`}}
                            style={styles.profileImage}
                        />
                    ) : (
                        <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
                            <Ionicons name="person" size={32} color="#FFFFFF" />
                        </View>
                    )}
                    <TouchableOpacity style={styles.editImageButton}>
                        <Ionicons name="camera" size={16} color="#FFFFFF"/>
                    </TouchableOpacity>
                </View>

                <Text style={styles.userName}>{profileData?.ownerName || 'No Name'}</Text>
                <Text style={styles.userEmail}>{profileData?.mobileNumber || 'No Phone Number'}</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#EF4444"/>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

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

const groupByPeriod = (data: any[], period: string) => {
    if (!data || data.length === 0) return [];

    const grouped: Record<string, number[]> = {};

    data.forEach(({date, count}) => {
        if (!date) return;

        let key;
        try {
            if (period === 'daily') {
                key = new Date(date).toISOString().split('T')[0];
            } else if (period === 'monthly') {
                const d = new Date(date);
                key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            } else if (period === 'yearly') {
                key = `${new Date(date).getFullYear()}`;
            }

            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(count);
        } catch (e) {
            console.error('Error processing date:', date, e);
        }
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
};

const flattenFootfallData = (footfallData: FootfallData | null) => {
    if (!footfallData) return [];

    const result: {date: Date, count: number}[] = [];

    for (const year in footfallData) {
        for (const month in footfallData[year]) {
            for (const day in footfallData[year][month]) {
                const count = footfallData[year][month][day].count;
                try {
                    const date = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
                    if (!isNaN(date.getTime())) {
                        result.push({date, count});
                    }
                } catch (e) {
                    console.error('Error creating date:', e);
                }
            }
        }
    }

    return result;
};

const UploadAndViewFootfallScreen: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("daily");
    const [footfallCount, setFootfallCount] = useState('');
    const [footfall, setFootfall] = useState<any[]>([]);
    const [approvedOwnerIds, setApprovedOwnerIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [todayFootfall, setTodayFootfall] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [profileData, setProfileData] = useState<OwnerData | null>(null);
    const [ownerId, setOwnerId] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        const fetchOwnerId = async () => {
            const value = await getData('ownerId');
            setOwnerId(value);
        };
        fetchOwnerId();
    }, []);

    useEffect(() => {
        if (!ownerId) return;

        const getOwnerProfileDetails = () => {
            const path = `ownerdb/${ownerId}`;
            const ownerProfileDetailsPref = ref(db, path);

            const unsubscribe = onValue(ownerProfileDetailsPref, (snapshot) => {
                if (snapshot.exists()) {
                    const data: OwnerData = snapshot.val();
                    setProfileData(data);
                    setCapacity(data.capacity || 0);
                } else {
                    setProfileData(null);
                    setCapacity(0);
                }
                setProfileLoading(false);
            }, (error) => {
                console.error("Error fetching owner's profile details: " + error);
                setProfileData(null);
                setCapacity(0);
                setProfileLoading(false);
            });
            return () => unsubscribe();
        };

        getOwnerProfileDetails();
    }, [ownerId]);

    useEffect(() => {
        if (!ownerId) return;

        const fetchFootfall = () => {
            const path = `/ownerdb/${ownerId}/footfall`;
            const footfallRef = ref(db, path);

            onValue(
                footfallRef,
                (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const formatted = flattenFootfallData(data);
                        setFootfall(formatted);
                    } else {
                        setFootfall([]);
                    }
                },
                (error) => {
                    console.error("Error fetching footfall: " + error);
                    setFootfall([]);
                }
            );
        };

        fetchFootfall();
    }, [ownerId]);

    useEffect(() => {
        const approvedOwnersRef = ref(db, 'approved/ownerIds');
        const unsubscribe = onValue(
            approvedOwnersRef,
            (snapshot) => {
                const data = snapshot.val();
                setApprovedOwnerIds(data ? Object.values(data) : []);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching approved owners: " + error);
                setApprovedOwnerIds([]);
                setIsLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!ownerId) return;

        const getTodayFootfall = () => {
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
    }, [ownerId]);

    const handleUpdateFootfall = async () => {
        if (!ownerId) return;

        const count = parseInt(footfallCount);
        if (isNaN(count) || count < 0 || (capacity > 0 && count > capacity)) {
            Alert.alert('Invalid Input', capacity > 0
                ? `Enter a number between 0 and ${capacity}`
                : 'Enter a valid positive number');
            return;
        }

        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');

        const footfallRef = ref(db, `/ownerdb/${ownerId}/footfall/${year}/${month}/${day}`);

        try {
            await set(footfallRef, { count });
            Alert.alert('Success', 'Footfall updated successfully!');
            setFootfallCount('');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Error updating footfall');
        }
    };

    const calculateOccupancyPercentage = (count: number) => {
        if (!capacity || capacity === 0) return 0;
        return Math.round((count / capacity) * 100);
    };

    const periodButtons = [
        {key: "daily", label: "Daily", icon: "calendar-outline"},
        {key: "monthly", label: "Monthly", icon: "calendar"},
        {key: "yearly", label: "Yearly", icon: "calendar-sharp"}
    ];

    const groupedData = groupByPeriod(footfall, selectedPeriod);

    const renderHistoryItem = ({item}: {item: any}) => (
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
                            `${Math.round(item.avgMonthly / (capacity || 1) * 100)}% Avg Fill`}
                </Text>
            </View>
        </View>
    );

    if (isLoading || profileLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
        );
    }

    if (!approvedOwnerIds.includes(ownerId || '')) {
        return (
            <View style={styles.notApprovedContainer}>
                <Text style={styles.notApprovedText}>
                    Your profile has not been approved yet by admin
                </Text>
                <Text style={styles.notApprovedSubText}>
                    Please contact support if you believe this is an error
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Greetings 🔥</Text>
                    <Text style={styles.venueName}>{profileData?.venueName || 'Venue'}</Text>
                    <Text style={styles.venueDetails}>
                        {profileData?.venueType || ''} • {profileData?.city || ''}
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
                            <Text style={styles.footfallLabel}>/ {capacity || 'N/A'}</Text>
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
                            <Text style={styles.occupancyText}>
                                {calculateOccupancyPercentage(todayFootfall)}% Filled
                            </Text>
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
                            <TouchableOpacity
                                style={styles.updateButton}
                                onPress={handleUpdateFootfall}
                                disabled={!capacity}
                            >
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

                    {/* Detailed History */}
                    <View style={styles.historyList}>
                        <Text style={styles.historyTitle}>
                            Recent {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} History
                        </Text>
                        <FlatList
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
        </SafeAreaView>
    );
};



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

export default OwnerHomeScreen
