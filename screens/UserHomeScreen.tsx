"use client"

import {useState, useEffect} from "react"
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ScrollView, Alert} from "react-native"
import {Picker} from "@react-native-picker/picker"
import {Ionicons} from "@expo/vector-icons"
import {off, onValue, ref} from "firebase/database";
import {db} from "../config/firebaseConfig";
import {useNavigation} from "@react-navigation/native";
import VenueDetailsScreen from "../screens/VenueDetailsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";


const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // value previously stored
            return value;
        }
    } catch (e) {
        console.error('Reading error:', e);
    }
};


interface Bars {
    capacity: string,
    city: string,
    id: string,
    mobileNumber: string,
    ownerName: string,
    photoBase64: string,
    venueName: string,
    venueType: string,
}

interface Restaurant {
    capacity: string,
    city: string,
    id: string,
    mobileNumber: string,
    ownerName: string,
    photoBase64: string,
    venueName: string,
    venueType: string,
}

interface Pub {
    capacity: string,
    city: string,
    id: string,
    mobileNumber: string,
    ownerName: string,
    photoBase64: string,
    venueName: string,
    venueType: string,
}

interface Club {
    capacity: string,
    city: string,
    id: string,
    mobileNumber: string,
    ownerName: string,
    photoBase64: string,
    venueName: string,
    venueType: string,
}


interface UserData {
    city: string;
    gender: string;
    id: string;
    mobileNumber: string,
    name: string,
    password: string;
    photoBase64?: string;
}

const UserHomeScreen = () => {

    const [approvedIds, setApprovedIds] = useState<string[]>([]);
    const [barsList, setBarsList] = useState<Bars[]>([]);
    const [restaurantsList, setRestaurantsList] = useState<Restaurant[]>([]);
    const [pubsList, setPubsList] = useState<Pub[]>([]);
    const [clubsList, setClubsList] = useState<Club[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // progress bar state
    const [profileData, setProfileData] = useState<UserData | null>(null);
    const [userId, setUserId] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserId = async() => {
            const value = await getData('userId');
            setUserId(value);
        };
        fetchUserId();
    }, []);


    useEffect(() => {
        const getUserProfileDetails = () => {

            const path = `userdb/${userId}`;
            const userProfileDetailsPref = ref(db, path);

            const unsubscribe = onValue(userProfileDetailsPref, (snapshot) => {
                if (snapshot.exists()) {
                    const data: UserData = snapshot.val();
                    setProfileData(data);
                    console.log(`yes i found user's data`);
                } else {
                    setProfileData(null);
                }

            }, (error) => {
                console.error("Error fetching user's profile details: " + error);
                setProfileData(null);
            });
            return () => unsubscribe();
        };

        getUserProfileDetails()


    }, []);


    const extractArray = (dataArray: Array<Array<string>>) => dataArray.flat();

    const fetchDetailOfEachBar = (restaurantOwnerIds: string[]) => {
        const requestedRef = ref(db, 'ownerdb/');

        onValue(
            requestedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const allBars = Object.values(data) as Bars[];
                    const matchedBars = allBars.filter(restaurant =>
                        restaurantOwnerIds.includes(restaurant.id) &&
                        restaurant.venueType === 'bar'
                    );

                    if (matchedBars.length > 0) {
                        setBarsList(matchedBars);
                    } else {
                        console.log('No matching restaurants found');
                        setBarsList([]);
                    }
                } else {
                    console.log('No owner data found');
                    setBarsList([]);
                }
                setLoading(false); // data has received, so turn off loading......
            },
            (error) => {
                console.error('Error fetching bar data:', error);
                Alert.alert('Error', 'Failed to fetch bar data: ' + error.message);
                setLoading(false);
            }
        );
    };


    const fetchDetailOfEachRestaurant = (restaurantOwnerIds: string[]) => {
        const requestedRef = ref(db, 'ownerdb/');

        onValue(
            requestedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const allRestaurants = Object.values(data) as Restaurant[];
                    const matchedRestaurant = allRestaurants.filter(restaurant =>
                        restaurantOwnerIds.includes(restaurant.id) &&
                        restaurant.venueType === 'restaurant'
                    );

                    if (matchedRestaurant.length > 0) {
                        setRestaurantsList(matchedRestaurant);
                    } else {
                        console.log('No matching restaurants found');
                        setRestaurantsList([]);
                    }
                } else {
                    console.log('No owner data found');
                    setRestaurantsList([]);
                }
                setLoading(false); // data has received, so turn off loading......
            },
            (error) => {
                console.error('Error fetching bar data:', error);
                Alert.alert('Error', 'Failed to fetch bar data: ' + error.message);
                setLoading(false);
            }
        );
    };

    const fetchDetailOfEachPub = (restaurantOwnerIds: string[]) => {
        const requestedRef = ref(db, 'ownerdb/');

        onValue(
            requestedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const allPubs = Object.values(data) as Pub[];
                    const matchedPubs = allPubs.filter(restaurant =>
                        restaurantOwnerIds.includes(restaurant.id) &&
                        restaurant.venueType === 'pub'
                    );

                    if (matchedPubs.length > 0) {
                        setPubsList(matchedPubs);
                    } else {
                        console.log('No matching pubs found');
                        setPubsList([]);
                    }
                } else {
                    console.log('No owner data found');
                    setPubsList([]);
                }
                setLoading(false); // data has received, so turn off loading......
            },
            (error) => {
                console.error('Error fetching pub data:', error);
                Alert.alert('Error', 'Failed to fetch pub data: ' + error.message);
                setLoading(false);
            }
        );
    };

    const fetchDetailOfEachClub = (restaurantOwnerIds: string[]) => {
        const requestedRef = ref(db, 'ownerdb/');

        onValue(
            requestedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const allClubs = Object.values(data) as Restaurant[];
                    const matchedClubs = allClubs.filter(restaurant =>
                        restaurantOwnerIds.includes(restaurant.id) &&
                        restaurant.venueType === 'club'
                    );

                    if (matchedClubs.length > 0) {
                        setClubsList(matchedClubs);
                    } else {
                        console.log('No matching clubs found');
                        setClubsList([]);
                    }
                } else {
                    console.log('No owner data found');
                    setClubsList([]);
                }
                setLoading(false); // data has received, so turn off loading......
            },
            (error) => {
                console.error('Error fetching club data:', error);
                Alert.alert('Error', 'Failed to fetch club data: ' + error.message);
                setLoading(false);
            }
        );
    };

    const fetchBarsDataFromFirebase = () => {
        setApprovedIds([]);
        const approvedRef = ref(db, 'approved/');
        setLoading(true);

        const listener = onValue(
            approvedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const dataArray: Array<Array<string>> = Object.values(data);
                    const flatIds = extractArray(dataArray);
                    setApprovedIds(flatIds);
                    fetchDetailOfEachBar(flatIds);
                } else {
                    setApprovedIds([]);
                    setBarsList([]);
                    setLoading(false);
                    console.log('No bars available');
                }
            },
            (error) => {
                console.error('Error fetching bars data:', error);
                Alert.alert('Error', 'Failed to fetch bars data: ' + error.message);
                setLoading(false);
            }
        );

        return () => off(approvedRef, 'value', listener);
    };


    const fetchRestaurantsDataFromFirebase = () => {
        setApprovedIds([]);
        const approvedRef = ref(db, 'approved/');
        setLoading(true);

        const listener = onValue(
            approvedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const dataArray: Array<Array<string>> = Object.values(data);
                    const flatIds = extractArray(dataArray);
                    setApprovedIds(flatIds);
                    fetchDetailOfEachRestaurant(flatIds);
                } else {
                    setApprovedIds([]);
                    setRestaurantsList([]);
                    setLoading(false);
                    console.log('No restaurants available');
                }
            },
            (error) => {
                console.error('Error fetching restaurants data:', error);
                Alert.alert('Error', 'Failed to fetch restaurants data: ' + error.message);
                setLoading(false);
            }
        );

        return () => off(approvedRef, 'value', listener);
    };

    const fetchPubsDataFromFirebase = () => {
        setApprovedIds([]);
        const approvedRef = ref(db, 'approved/');
        setLoading(true);

        const listener = onValue(
            approvedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const dataArray: Array<Array<string>> = Object.values(data);
                    const flatIds = extractArray(dataArray);
                    setApprovedIds(flatIds);
                    fetchDetailOfEachPub(flatIds);
                } else {
                    setApprovedIds([]);
                    setPubsList([]);
                    setLoading(false);
                    console.log('No pubs available');
                }
            },
            (error) => {
                console.error('Error fetching pubs data:', error);
                Alert.alert('Error', 'Failed to fetch pubs data: ' + error.message);
                setLoading(false);
            }
        );

        return () => off(approvedRef, 'value', listener);
    }

    const fetchClubsDataFromFirebase = () => {
        setApprovedIds([]);
        const approvedRef = ref(db, 'approved/');
        setLoading(true);

        const listener = onValue(
            approvedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const dataArray: Array<Array<string>> = Object.values(data);
                    const flatIds = extractArray(dataArray);
                    setApprovedIds(flatIds);
                    fetchDetailOfEachClub(flatIds);
                } else {
                    setApprovedIds([]);
                    setClubsList([]);
                    setLoading(false);
                    console.log('No pubs available');
                }
            },
            (error) => {
                console.error('Error fetching pubs data:', error);
                Alert.alert('Error', 'Failed to fetch pubs data: ' + error.message);
                setLoading(false);
            }
        );

        return () => off(approvedRef, 'value', listener);
    }


    useEffect(() => {
        const cleanup = fetchBarsDataFromFirebase();
        return cleanup;
    }, []);

    useEffect(() => {
        const cleanup = fetchRestaurantsDataFromFirebase();
        return cleanup;
    }, []);

    useEffect(() => {
        const cleanup = fetchPubsDataFromFirebase();
        return cleanup;
    }, []);

    useEffect(() => {
        const cleanup = fetchClubsDataFromFirebase();
        return cleanup;
    }, []);


    // Reusable render function for consistency
    const renderVenueCard = ({ item }: { item: Bars | Restaurant | Pub | Club }) => (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate("VenueDetails", {
                    venueId: item.id,
                });
            }}
        >
            <View style={styles.barCard}>
                <Image
                    source={{ uri: `data:image/jpeg;base64,${item.photoBase64}` }}
                    style={styles.sectionImage}
                />
                <Text style={styles.barName}>{item.venueName}</Text>
                <Text style={styles.city}>{item.city}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Greetings 🔥</Text>
                <Text style={styles.name}>{profileData?.name}</Text>
            </View>

            {/* Main Content */}
            <ScrollView style={styles.scrollView}>
                {/* Featured Bar Section */}
                <Image source={require("../assets/spceresaurant.jpg")} style={styles.featuredImage}/>

                {/* Best Bars Section */}
                {!loading && barsList.length > 0 && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Best Bars</Text>
                        </View>

                        <FlatList
                            horizontal
                            data={barsList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderVenueCard}
                            showsHorizontalScrollIndicator={false}
                            style={styles.horizontalScroll}
                        />
                    </>
                )}

                {/* Best Restaurants Section */}
                {!loading && restaurantsList.length > 0 && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Best Restaurants</Text>
                        </View>

                        <FlatList
                            horizontal
                            data={restaurantsList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderVenueCard}
                            showsHorizontalScrollIndicator={false}
                            style={styles.horizontalScroll}
                        />
                    </>
                )}
                {/* Best Clubs Section */}
                {!loading && clubsList.length > 0 && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Best Clubs</Text>

                        </View>

                        <FlatList
                            horizontal
                            data={clubsList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderVenueCard}
                            showsHorizontalScrollIndicator={false}
                            style={styles.horizontalScroll}
                        />
                    </>
                )}
                {/* Best Pubs Section */}
                {!loading && pubsList.length > 0 && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Best Pubs</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewAll}>View all</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            horizontal
                            data={pubsList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderVenueCard}
                            showsHorizontalScrollIndicator={false}
                            style={styles.horizontalScroll}
                        />
                    </>
                )}


            </ScrollView>

        </View>
    );


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        padding: 20,
        paddingTop: 40,
    },
    greeting: {
        color: '#fff',
        fontSize: 16,
    },
    name: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    featuredImage: {
        width: '90%',
        height: 200,
        borderRadius: 10,
        alignSelf: 'center',
        marginVertical: 10,
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    viewAll: {
        color: '#888',
        fontSize: 14,
    },
    horizontalScroll: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sectionImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginRight: 10,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingVertical: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    navItem: {
        alignItems: 'center',
    },
    navIcon: {
        fontSize: 24,
        color: '#888',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    barCard: {marginRight: 10, alignItems: 'center'},
    barName: {marginTop: 5, fontWeight: '600'},
    city: {fontSize: 12, color: 'white'}
});


export default UserHomeScreen
