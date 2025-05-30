"use client"

import {useEffect, useState} from "react"
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs"
import {Ionicons} from "@expo/vector-icons"
import {db} from "../config/firebaseConfig";
import {ref, set, onValue, get, off, remove} from 'firebase/database';


const Tab = createMaterialTopTabNavigator()

interface RequestedRestaurantData {
    capacity: string,
    city: string,
    id: string,
    mobileNumber: string,
    ownerName: string,
    photoBase64: string,
    venueName: string,
    venueType: string,
    status: number
}

interface ApprovedRestaurantData {
    capacity: string,
    city: string,
    id: string,
    mobileNumber: string,
    ownerName: string,
    photoBase64: string,
    venueName: string,
    venueType: string,
    status: number
}


interface CancelledRestaurantData {
    capacity: string,
    city: string,
    id: string,
    mobileNumber: string,
    ownerName: string,
    photoBase64: string,
    venueName: string,
    venueType: string,
    status: number
}



// const ApprovedScreen = () => {
//     // const [venues, setVenues] = useState(mockVenues.approved)
//     const [approvedIds, setApprovedIds] = useState([]);
//     const [approvedRestaurants, setApprovedRestaurantsData] = useState<ApprovedRestaurantData[]>([]);
//
//
//     useEffect(() => {
//         console.log("RequestRestaurants updated with size: ", approvedRestaurants.length);
//         // setVenues(requestedRestaurants);
//     }, [approvedRestaurants]);
//
//     // console.log("RequestRestaurants updated with sizexx: ", requestedRestaurants.length);
//
//     function fetchDetailOfEachRestaurant(restaurantOwnerIds: Array<string>) {
//         const requestedRef = ref(db, 'ownerdb/');
//
//         onValue(
//             requestedRef,
//             (snapshot) => {
//                 const data = snapshot.val();
//                 if (data) {
//                     // Convert object to array and filter by matching IDs
//                     const allRestaurants = Object.values(data) as RequestedRestaurantData[];
//                     const matchedRestaurants = allRestaurants.filter(restaurant =>
//                         restaurantOwnerIds.includes(restaurant.id)
//                     );
//
//                     if (matchedRestaurants.length > 0) {
//                         // showDataInFlatList(matchedRestaurants);
//                         console.log("Yes, I've been filled");
//                         setApprovedRestaurantsData(matchedRestaurants);
//                     } else {
//                         console.log("No matching restaurants found for IDs:", restaurantOwnerIds);
//                     }
//                 } else {
//                     // setRequestedRestaurantsData([]);
//                     console.log('No owner data available');
//                 }
//             },
//             (error) => {
//                 console.error('Error fetching data:', error);
//                 Alert.alert('Error', 'Failed to fetch data: ' + error.message);
//             }
//         );
//     }
//
//     // function iterateData(a: string[]) {
//     //     for (let i = 0; i < a.length; i++) {
//     //         fetchDetailOfEachRestaurant(a.at(i));
//     //     }
//     // }
//
//     function extractArray(dataArray: Array<Array<string>>) {
//         let arr: string[] = [];
//         for (let i = 0; i < dataArray.length; i++) {
//             for (let j = 0; j < dataArray[i].length; j++) {
//                 arr.push(dataArray[i][j]);
//             }
//         }
//         return arr;
//     }
//
//     // Fetch data from Firebase
//     const fetchDataFromFirebase = () => {
//         const approvedRef = ref(db, 'approved/');
//         const listener = onValue(
//             approvedRef,
//             (snapshot) => {
//                 const data = snapshot.val();
//                 if (data) {
//                     const dataArray: Array<Array<string>> = Object.values(data);
//                     setApprovedIds(dataArray);
//                     const x = extractArray(dataArray);
//                     console.log('Requested IDs:', dataArray);
//                     // iterateData(dataArray);
//                     fetchDetailOfEachRestaurant(x);
//                     console.log("filledddddddddd", approvedRestaurants);
//                 } else {
//                     setApprovedIds([]);
//                     console.log('No data available');
//                 }
//             },
//             (error) => {
//                 console.error('Error fetching data:', error);
//                 Alert.alert('Error', 'Failed to fetch data: ' + error.message);
//             }
//         );
//
//         // Return cleanup function to remove the listener
//         return () => off(approvedRef, 'value', listener);
//     };
//
//
//     function showDataInFlatList(matchedRestaurantsx: RequestedRestaurantData[]) {
//         for (let i = 0; i < matchedRestaurantsx.length; i++) {
//             console.log("matched IDs: ", matchedRestaurantsx.at(i)?.id);
//         }
//     }
//
//     // Run fetchDataFromFirebase only once on component mount
//     useEffect(() => {
//         const cleanup = fetchDataFromFirebase();
//         return cleanup; // Cleanup listener on component unmount
//     }, []); // Empty dependency array ensures it runs only once
//
//
//     const renderVenueItem = ({item}) => (
//         <View style={styles.venueCard}>
//             {/*<Image source={item.image} style={styles.venueImage}/>*/}
//             {<Image source={{uri: `data:image/jpeg;base64,${item.photoBase64}`}} style={styles.venueImage}/>}
//             <View style={styles.venueInfo}>
//                 <Text style={styles.venueName}>{item.venueName}</Text>
//                 {/*<Text style={styles.venueType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>*/}
//                 <Text style={styles.venueType}>{item.venueType}</Text>
//                 <Text style={styles.venueCity}>{item.city}</Text>
//                 <Text style={styles.venueCapacity}>Capacity: {item.capacity}</Text>
//             </View>
//         </View>
//     )
//
//     return (
//         <View style={styles.tabContainer}>
//             {approvedRestaurants.length > 0 ? (
//                 <FlatList
//                     data={approvedRestaurants}
//                     renderItem={renderVenueItem}
//                     keyExtractor={(item) => item.id}
//                     contentContainerStyle={styles.venueList}
//                     showsVerticalScrollIndicator={false}
//                 />
//             ) : (
//                 <View style={styles.emptyState}>
//                     <Text style={styles.emptyStateText}>No approved venues</Text>
//                 </View>
//             )}
//         </View>
//     )
// }

// const RequestedScreen = () => {
//     // const [venues, setVenues] = useState(mockVenues.requested);
//     // const [venues, setVenues] = useState<RequestedRestaurantData[]>([]);
//     const [requestedIds, setRequestedIds] = useState([]);
//     const [requestedRestaurants, setRequestedRestaurantsData] = useState<RequestedRestaurantData[]>([]);
//
//
//     // const [requestedRestaurants, setRequestedRestaurantsData] = useState<RequestedRestaurantData[]>([]);
//     useEffect(() => {
//         console.log("RequestRestaurants updated with size: ", requestedRestaurants.length);
//         // setVenues(requestedRestaurants);
//     }, [requestedRestaurants]);
//
//     // console.log("RequestRestaurants updated with sizexx: ", requestedRestaurants.length);
//
//     function fetchDetailOfEachRestaurant(restaurantOwnerIds: Array<string>) {
//         const requestedRef = ref(db, 'ownerdb/');
//
//         onValue(
//             requestedRef,
//             (snapshot) => {
//                 const data = snapshot.val();
//                 if (data) {
//                     // Convert object to array and filter by matching IDs
//                     const allRestaurants = Object.values(data) as RequestedRestaurantData[];
//                     const matchedRestaurants = allRestaurants.filter(restaurant =>
//                         restaurantOwnerIds.includes(restaurant.id)
//                     );
//
//                     if (matchedRestaurants.length > 0) {
//                         // showDataInFlatList(matchedRestaurants);
//                         console.log("Yes, I've been filled");
//                         setRequestedRestaurantsData(matchedRestaurants);
//                     } else {
//                         console.log("No matching restaurants found for IDs:", restaurantOwnerIds);
//                     }
//                 } else {
//                     // setRequestedRestaurantsData([]);
//                     console.log('No owner data available');
//                 }
//             },
//             (error) => {
//                 console.error('Error fetching data:', error);
//                 Alert.alert('Error', 'Failed to fetch data: ' + error.message);
//             }
//         );
//     }
//
//     // function iterateData(a: string[]) {
//     //     for (let i = 0; i < a.length; i++) {
//     //         fetchDetailOfEachRestaurant(a.at(i));
//     //     }
//     // }
//
//     function extractArray(dataArray: Array<Array<string>>) {
//         let arr: string[] = [];
//         for (let i = 0; i < dataArray.length; i++) {
//             for (let j = 0; j < dataArray[i].length; j++) {
//                 arr.push(dataArray[i][j]);
//             }
//         }
//         return arr;
//     }
//
//     // Fetch data from Firebase
//     const fetchDataFromFirebase = () => {
//         const requestedRef = ref(db, 'requested/');
//         const listener = onValue(
//             requestedRef,
//             (snapshot) => {
//                 const data = snapshot.val();
//                 if (data) {
//                     const dataArray: Array<Array<string>> = Object.values(data);
//                     setRequestedIds(dataArray);
//                     const x = extractArray(dataArray);
//                     console.log('Requested IDs:', dataArray);
//                     // iterateData(dataArray);
//                     fetchDetailOfEachRestaurant(x);
//                     console.log("filledddddddddd", requestedRestaurants);
//                 } else {
//                     setRequestedIds([]);
//                     console.log('No data available');
//                 }
//             },
//             (error) => {
//                 console.error('Error fetching data:', error);
//                 Alert.alert('Error', 'Failed to fetch data: ' + error.message);
//             }
//         );
//
//         // Return cleanup function to remove the listener
//         return () => off(requestedRef, 'value', listener);
//     };
//
//
//     function showDataInFlatList(matchedRestaurantsx: RequestedRestaurantData[]) {
//         for (let i = 0; i < matchedRestaurantsx.length; i++) {
//             console.log("matched IDs: ", matchedRestaurantsx.at(i)?.id);
//         }
//     }
//
//
//     // Run fetchDataFromFirebase only once on component mount
//     useEffect(() => {
//         const cleanup = fetchDataFromFirebase();
//         return cleanup; // Cleanup listener on component unmount
//     }, []); // Empty dependency array ensures it runs only once
//
//     const handleApprove = async (id) => {
//         setRequestedRestaurantsData(requestedRestaurants.filter((venue) => venue.id !== id));
//         console.log("approved id: ", id)
//         const approvedRef = ref(db, 'approved/ownerIds');
//         const requestedRef = ref(db, 'requested/ownerIds');
//
//         try {
//             const snapshot = await get(approvedRef);
//             const currentData = snapshot.val();
//             const nextIndex = currentData ? Object.keys(currentData).length : 0;
//
//             const newRef = ref(db, `approved/ownerIds/${nextIndex}`);
//             await set(newRef, id);
//
//             // now removing this particular ID from requested DB.....
//             const requestedSnapshot = await get(requestedRef);
//             const requestedData = requestedSnapshot.val();
//             if (requestedData) {
//                 const matchedEntry = Object.entries(requestedData).find(([key, value]) =>
//                     value === id
//                 );
//                 if (matchedEntry != undefined) {
//                     const [matchedKey] = matchedEntry;
//                     await remove(ref(db, `requested/ownerIds/${matchedKey}`));
//                     console.log("ID ${id} removed from requested/ownerIds");
//                 } else {
//                     console.log(`ID ${id} not found in requested/ownerIds`);
//                 }
//             }
//
//         } catch (error) {
//             console.error('Error saving approved ID:', error);
//         }
//
//     };
//
//     const handleReject = async (id) => {
//         setRequestedRestaurantsData(requestedRestaurants.filter((s) => s.id !== id));
//         console.log("rejected id: ", id)
//
//         const cancelledRef = ref(db, 'cancelled/ownerIds');
//         const requestedRef = ref(db, 'requested/ownerIds');
//
//         try {
//             const snapshot = await get(cancelledRef);
//             const currentData = snapshot.val();
//             const nextIndex = currentData ? Object.keys(currentData).length : 0;
//
//             const newRef = ref(db, `cancelled/ownerIds/${nextIndex}`);
//             await set(newRef, id);
//
//             // now removing this particular ID from requested DB.....
//             const requestedSnapshot = await get(requestedRef);
//             const requestedData = requestedSnapshot.val();
//             if (requestedData) {
//                 const matchedEntry = Object.entries(requestedData).find(([key, value]) =>
//                     value === id
//                 );
//                 if (matchedEntry != undefined) {
//                     const [matchedKey] = matchedEntry;
//                     await remove(ref(db, `requested/ownerIds/${matchedKey}`));
//                     console.log("ID ${id} removed from requested/ownerIds");
//                 } else {
//                     console.log(`ID ${id} not found in requested/ownerIds`);
//                 }
//             }
//
//         } catch (error) {
//             console.error('Error saving approved ID:', error);
//         }
//     };
//
//     const renderVenueItem = ({item}) => (
//         <View style={styles.venueCard}>
//             {/*<Image source={item.image} style={styles.venueImage}/>*/}
//             {<Image source={{uri: `data:image/jpeg;base64,${item.photoBase64}`}} style={styles.venueImage}/>}
//             <View style={styles.venueInfo}>
//                 <Text style={styles.venueName}>{item.venueName}</Text>
//                 <Text style={styles.venueType}>
//                     {/*{item.type.charAt(0).toUpperCase() + item.type.slice(1)}*/}
//                     {item.venueType}
//                 </Text>
//                 <Text style={styles.venueCity}>{item.city}</Text>
//                 <Text style={styles.venueCapacity}>Capacity: {item.capacity}</Text>
//
//                 <View style={styles.actionButtons}>
//                     <TouchableOpacity
//                         style={[styles.actionButton, styles.approveButton]}
//                         onPress={() => handleApprove(item.id)}
//                     >
//                         <Ionicons name="checkmark" size={16} color="#FFFFFF"/>
//                         <Text style={styles.actionButtonText}>Approve</Text>
//                     </TouchableOpacity>
//
//                     <TouchableOpacity
//                         style={[styles.actionButton, styles.rejectButton]}
//                         onPress={() => handleReject(item.id)}
//                     >
//                         <Ionicons name="close" size={16} color="#FFFFFF"/>
//                         <Text style={styles.actionButtonText}>Reject</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </View>
//     );
//
//     return (
//         <View style={styles.tabContainer}>
//             {requestedRestaurants.length > 0 ? (
//                 <FlatList
//                     data={requestedRestaurants}
//                     renderItem={renderVenueItem}
//                     keyExtractor={(item) => item.id}
//                     contentContainerStyle={styles.venueList}
//                     showsVerticalScrollIndicator={false}
//                 />
//             ) : (
//                 <View style={styles.emptyState}>
//                     <Text style={styles.emptyStateText}>No pending requests</Text>
//                 </View>
//             )}
//         </View>
//     );
// };

// const CancelledScreen = () => {
//     const [venues, setVenues] = useState(mockVenues.cancelled)
//     const [cancelledIds, setCancelledIds] = useState([]);
//     const [cancelledRestaurants, setCancelledRestaurants] = useState<CancelledRestaurantData[]>([]);
//
//
//     useEffect(() => {
//         console.log("RequestRestaurants updated with size: ", cancelledRestaurants.length);
//         // setVenues(requestedRestaurants);
//     }, [cancelledRestaurants]);
//
//     // console.log("RequestRestaurants updated with sizexx: ", requestedRestaurants.length);
//
//     function fetchDetailOfEachRestaurant(restaurantOwnerIds: Array<string>) {
//         const requestedRef = ref(db, 'ownerdb/');
//
//         onValue(
//             requestedRef,
//             (snapshot) => {
//                 const data = snapshot.val();
//                 if (data) {
//                     // Convert object to array and filter by matching IDs
//                     const allRestaurants = Object.values(data) as CancelledRestaurantData[];
//                     const matchedRestaurants = allRestaurants.filter(restaurant =>
//                         restaurantOwnerIds.includes(restaurant.id)
//                     );
//
//                     if (matchedRestaurants.length > 0) {
//                         // showDataInFlatList(matchedRestaurants);
//                         console.log("Yes, I've been filled");
//                         setCancelledRestaurants(matchedRestaurants);
//                     } else {
//                         console.log("No matching restaurants found for IDs:", restaurantOwnerIds);
//                     }
//                 } else {
//                     // setRequestedRestaurantsData([]);
//                     console.log('No owner data available');
//                 }
//             },
//             (error) => {
//                 console.error('Error fetching data:', error);
//                 Alert.alert('Error', 'Failed to fetch data: ' + error.message);
//             }
//         );
//     }
//
//     // function iterateData(a: string[]) {
//     //     for (let i = 0; i < a.length; i++) {
//     //         fetchDetailOfEachRestaurant(a.at(i));
//     //     }
//     // }
//
//     function extractArray(dataArray: Array<Array<string>>) {
//         let arr: string[] = [];
//         for (let i = 0; i < dataArray.length; i++) {
//             for (let j = 0; j < dataArray[i].length; j++) {
//                 arr.push(dataArray[i][j]);
//             }
//         }
//         return arr;
//     }
//
//     // Fetch data from Firebase
//     const fetchDataFromFirebase = () => {
//         const cancelledRef = ref(db, 'cancelled/');
//         const listener = onValue(
//             cancelledRef,
//             (snapshot) => {
//                 const data = snapshot.val();
//                 if (data) {
//                     const dataArray: Array<Array<string>> = Object.values(data);
//                     setCancelledIds(dataArray);
//                     const x = extractArray(dataArray);
//                     console.log('Requested IDs:', dataArray);
//                     // iterateData(dataArray);
//                     fetchDetailOfEachRestaurant(x);
//                     console.log("filledddddddddd", cancelledRestaurants);
//                 } else {
//                     setCancelledIds([]);
//                     console.log('No data available');
//                 }
//             },
//             (error) => {
//                 console.error('Error fetching data:', error);
//                 Alert.alert('Error', 'Failed to fetch data: ' + error.message);
//             }
//         );
//
//         // Return cleanup function to remove the listener
//         return () => off(cancelledRef, 'value', listener);
//     };
//
//
//     function showDataInFlatList(matchedRestaurantsx: RequestedRestaurantData[]) {
//         for (let i = 0; i < matchedRestaurantsx.length; i++) {
//             console.log("matched IDs: ", matchedRestaurantsx.at(i)?.id);
//         }
//     }
//
//     // Run fetchDataFromFirebase only once on component mount
//     useEffect(() => {
//         const cleanup = fetchDataFromFirebase();
//         return cleanup; // Cleanup listener on component unmount
//     }, []); // Empty dependency array ensures it runs only once
//
//
//     const renderVenueItem = ({item}) => (
//         <View style={styles.venueCard}>
//             {/*<Image source={item.image} style={styles.venueImage}/>*/}
//             {<Image source={{uri: `data:image/jpeg;base64,${item.photoBase64}`}} style={styles.venueImage}/>}
//             <View style={styles.venueInfo}>
//                 <Text style={styles.venueName}>{item.venueName}</Text>
//                 {/*<Text style={styles.venueType}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>*/}
//                 <Text style={styles.venueType}>{item.venueType}</Text>
//                 <Text style={styles.venueCity}>{item.city}</Text>
//                 <Text style={styles.venueCapacity}>Capacity: {item.capacity}</Text>
//             </View>
//         </View>
//     )
//
//     return (
//         <View style={styles.tabContainer}>
//             {venues.length > 0 ? (
//                 <FlatList
//                     data={cancelledRestaurants}
//                     renderItem={renderVenueItem}
//                     keyExtractor={(item) => item.id}
//                     contentContainerStyle={styles.venueList}
//                     showsVerticalScrollIndicator={false}
//                 />
//             ) : (
//                 <View style={styles.emptyState}>
//                     <Text style={styles.emptyStateText}>No cancelled venues</Text>
//                 </View>
//             )}
//         </View>
//     )
// }





const ApprovedScreen = () => {
    const [approvedIds, setApprovedIds] = useState<string[]>([]);
    const [approvedRestaurants, setApprovedRestaurantsData] = useState<ApprovedRestaurantData[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // progress bar state

    const extractArray = (dataArray: Array<Array<string>>) => dataArray.flat();

    const fetchDetailOfEachRestaurant = (restaurantOwnerIds: string[]) => {
        const requestedRef = ref(db, 'ownerdb/');

        onValue(
            requestedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const allRestaurants = Object.values(data) as RequestedRestaurantData[];
                    const matchedRestaurants = allRestaurants.filter(restaurant =>
                        restaurantOwnerIds.includes(restaurant.id)
                    );

                    if (matchedRestaurants.length > 0) {
                        setApprovedRestaurantsData(matchedRestaurants);
                    } else {
                        console.log('No matching restaurants found');
                        setApprovedRestaurantsData([]);
                    }
                } else {
                    console.log('No owner data found');
                    setApprovedRestaurantsData([]);
                }
                setLoading(false); // ✅ Done loading
            },
            (error) => {
                console.error('Error fetching owner data:', error);
                Alert.alert('Error', 'Failed to fetch owner data: ' + error.message);
                setLoading(false); // ✅ End loading on error
            }
        );
    };

    const fetchDataFromFirebase = () => {
        const approvedRef = ref(db, 'approved/');
        setLoading(true); // ✅ Start loading

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
                    setApprovedRestaurantsData([]);
                    setLoading(false); // ✅ No data to load
                    console.log('No approved data available');
                }
            },
            (error) => {
                console.error('Error fetching approved data:', error);
                Alert.alert('Error', 'Failed to fetch approved data: ' + error.message);
                setLoading(false);
            }
        );

        return () => off(approvedRef, 'value', listener); // Cleanup
    };

    useEffect(() => {
        const cleanup = fetchDataFromFirebase();
        return cleanup;
    }, []);

    const renderVenueItem = ({ item }: { item: ApprovedRestaurantData }) => (
        <View style={styles.venueCard}>
            <Image source={{ uri: `data:image/jpeg;base64,${item.photoBase64}` }} style={styles.venueImage} />
            <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{item.venueName}</Text>
                <Text style={styles.venueType}>{item.venueType}</Text>
                <Text style={styles.venueCity}>{item.city}</Text>
                <Text style={styles.venueCapacity}>Capacity: {item.capacity}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.tabContainer}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading approved venues...</Text>
                </View>
            ) : approvedRestaurants.length > 0 ? (
                <FlatList
                    data={approvedRestaurants}
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
    );
};



const RequestedScreen = () => {
    const [requestedIds, setRequestedIds] = useState<string[][]>([]);
    const [requestedRestaurants, setRequestedRestaurantsData] = useState<RequestedRestaurantData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log("RequestRestaurants updated with size: ", requestedRestaurants.length);
    }, [requestedRestaurants]);

    function extractArray(dataArray: Array<Array<string>>) {
        let arr: string[] = [];
        for (let i = 0; i < dataArray.length; i++) {
            for (let j = 0; j < dataArray[i].length; j++) {
                arr.push(dataArray[i][j]);
            }
        }
        return arr;
    }

    function fetchDetailOfEachRestaurant(restaurantOwnerIds: Array<string>) {
        const requestedRef = ref(db, 'ownerdb/');
        onValue(
            requestedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const allRestaurants = Object.values(data) as RequestedRestaurantData[];
                    const matchedRestaurants = allRestaurants.filter(restaurant =>
                        restaurantOwnerIds.includes(restaurant.id)
                    );
                    setRequestedRestaurantsData(matchedRestaurants);
                    setIsLoading(false);
                } else {
                    setRequestedRestaurantsData([]);
                    setIsLoading(false);
                    console.log('No owner data available');
                }
            },
            (error) => {
                setIsLoading(false);
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch data: ' + error.message);
            }
        );
    }

    const fetchDataFromFirebase = () => {
        const requestedRef = ref(db, 'requested/');
        const listener = onValue(
            requestedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const dataArray: Array<Array<string>> = Object.values(data);
                    setRequestedIds(dataArray);
                    const flatIds = extractArray(dataArray);
                    console.log('Requested IDs:', dataArray);
                    fetchDetailOfEachRestaurant(flatIds);
                } else {
                    setRequestedIds([]);
                    setRequestedRestaurantsData([]);
                    setIsLoading(false);
                    console.log('No data available');
                }
            },
            (error) => {
                setIsLoading(false);
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch data: ' + error.message);
            }
        );

        return () => off(requestedRef, 'value', listener);
    };

    useEffect(() => {
        const cleanup = fetchDataFromFirebase();
        return cleanup;
    }, []);


    const handleApproveClick = async (id: string) => {
        const result = await handleApprove(id);
        if (result.success) {
            setRequestedRestaurantsData(prev => prev.filter(venue => venue.id !== id));setRequestedRestaurantsData(prev => prev.filter(venue => venue.id !== id));
        } else {
            Alert.alert(result.message);
        }
    }

    const handleApprove = async (id: string) => {

        const approvedRef = ref(db, 'approved/ownerIds');
        const requestedRef = ref(db, 'requested/ownerIds');
        const ownerdbRef = ref(db, 'ownerdb');

        try {
            const snapshot = await get(approvedRef);
            const currentData = snapshot.val();
            const nextIndex = currentData ? Object.keys(currentData).length : 0;

            const newRef = ref(db, `approved/ownerIds/${nextIndex}`);
            await set(newRef, id);

            const requestedSnapshot = await get(requestedRef);
            const requestedData = requestedSnapshot.val();

            if (requestedData) {
                const matchedEntry = Object.entries(requestedData).find(([_, value]) => value === id);
                if (matchedEntry) {
                    const [matchedKey] = matchedEntry;
                    await remove(ref(db, `requested/ownerIds/${matchedKey}`));
                    console.log(`ID ${id} removed from requested/ownerIds`);
                }
            }


            // now, updating the status to 1.......
            const ownerdbsnapshot = await get(ownerdbRef);
            const ownerdbData = ownerdbsnapshot.val();

            if (ownerdbData) {
                const ownerKey = Object.keys(ownerdbData).find(key => key === id);
                if (ownerKey) {
                    const ownerStatusRef = ref(db, `ownerdb/${ownerKey}/status`);
                    await set(ownerStatusRef, 1);
                    console.log(`Status for ${id} updated to 1 in ownerdb`);
                } else {
                    console.log(`Owner ${id} not found in ownerdb`);
                }
            } else {
                console.log('No data found in ownerdb');
            }

            return {
                success: true,
                message: `ID ${id} approved successfully`
            };


        } catch (error) {
            console.error('Error saving approved ID or updating status:', error);
            return {
                success: false,
                message: `Failed to approve ID ${id}: ${error.message}`
            };
        }
    };

    const handleRejectClick = async (id: string) =>  {
        const result = await handleReject(id);
        if (result.success) {
            setRequestedRestaurantsData(prev => prev.filter(venue => venue.id !== id));setRequestedRestaurantsData(prev => prev.filter(venue => venue.id !== id));
        } else {
            Alert.alert(result.message);
        }
    }

    const handleReject = async (id: string) => {
        setRequestedRestaurantsData(prev => prev.filter(venue => venue.id !== id));
        const cancelledRef = ref(db, 'cancelled/ownerIds');
        const requestedRef = ref(db, 'requested/ownerIds');
        const ownerdbRef = ref(db, 'ownerdb');

        try {
            const snapshot = await get(cancelledRef);
            const currentData = snapshot.val();
            const nextIndex = currentData ? Object.keys(currentData).length : 0;

            const newRef = ref(db, `cancelled/ownerIds/${nextIndex}`);
            await set(newRef, id);

            const requestedSnapshot = await get(requestedRef);
            const requestedData = requestedSnapshot.val();

            if (requestedData) {
                const matchedEntry = Object.entries(requestedData).find(([_, value]) => value === id);
                if (matchedEntry) {
                    const [matchedKey] = matchedEntry;
                    await remove(ref(db, `requested/ownerIds/${matchedKey}`));
                    console.log(`ID ${id} removed from requested/ownerIds`);
                }
            }

            // now, updating the status to -1.......
            const ownerdbsnapshot = await get(ownerdbRef);
            const ownerdbData = ownerdbsnapshot.val();

            if (ownerdbData) {
                const ownerKey = Object.keys(ownerdbData).find(key => key === id);
                if (ownerKey) {
                    const ownerStatusRef = ref(db, `ownerdb/${ownerKey}/status`);
                    await set(ownerStatusRef, -1);
                    console.log(`Status for ${id} updated to -1 in ownerdb`);
                } else {
                    console.log(`Owner ${id} not found in ownerdb`);
                }
            } else {
                console.log('No data found in ownerdb');
            }


            return {
                success: true,
                message: `ID ${id} cancelled successfully`
            };

        } catch (error) {
            console.error('Error saving rejected ID:', error);
            return {
                success: false,
                message: `Failed to cancel ID ${id}: ${error.message}`
            };
        }
    };

    const renderVenueItem = ({ item }) => (
        <View style={styles.venueCard}>
            <Image source={{ uri: `data:image/jpeg;base64,${item.photoBase64}` }} style={styles.venueImage} />
            <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{item.venueName}</Text>
                <Text style={styles.venueType}>{item.venueType}</Text>
                <Text style={styles.venueCity}>{item.city}</Text>
                <Text style={styles.venueCapacity}>Capacity: {item.capacity}</Text>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.approveButton]}
                        onPress={() => handleApproveClick(item.id)}
                    >
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.rejectButton]}
                        onPress={() => handleRejectClick(item.id)}
                    >
                        <Ionicons name="close" size={16} color="#FFFFFF" />
                        <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.tabContainer}>
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading requested venues...</Text>
                </View>
            ) : requestedRestaurants.length > 0 ? (
                <FlatList
                    data={requestedRestaurants}
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
    );
};




const CancelledScreen = () => {
    const [cancelledIds, setCancelledIds] = useState([]);
    const [cancelledRestaurants, setCancelledRestaurants] = useState<CancelledRestaurantData[]>([]);
    const [isLoading, setIsLoading] = useState(true); // <- ✅ loading state

    useEffect(() => {
        console.log("RequestRestaurants updated with size: ", cancelledRestaurants.length);
    }, [cancelledRestaurants]);

    function fetchDetailOfEachRestaurant(restaurantOwnerIds: Array<string>) {
        const requestedRef = ref(db, 'ownerdb/');
        onValue(
            requestedRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const allRestaurants = Object.values(data) as CancelledRestaurantData[];
                    const matchedRestaurants = allRestaurants.filter(restaurant =>
                        restaurantOwnerIds.includes(restaurant.id)
                    );
                    setCancelledRestaurants(matchedRestaurants);
                } else {
                    setCancelledRestaurants([]);
                    console.log('No owner data available');
                }
                setIsLoading(false); // ✅ Done loading after data handled
            },
            (error) => {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch data: ' + error.message);
                setIsLoading(false); // ✅ Also stop loading on error
            }
        );
    }

    function extractArray(dataArray: Array<Array<string>>) {
        let arr: string[] = [];
        for (let i = 0; i < dataArray.length; i++) {
            for (let j = 0; j < dataArray[i].length; j++) {
                arr.push(dataArray[i][j]);
            }
        }
        return arr;
    }

    const fetchDataFromFirebase = () => {
        const cancelledRef = ref(db, 'cancelled/');
        const listener = onValue(
            cancelledRef,
            (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const dataArray: Array<Array<string>> = Object.values(data);
                    setCancelledIds(dataArray);
                    const x = extractArray(dataArray);
                    fetchDetailOfEachRestaurant(x);
                } else {
                    setCancelledIds([]);
                    setCancelledRestaurants([]);
                    setIsLoading(false); // ✅ stop loading even if no data
                    console.log('No data available');
                }
            },
            (error) => {
                console.error('Error fetching data:', error);
                Alert.alert('Error', 'Failed to fetch data: ' + error.message);
                setIsLoading(false);
            }
        );

        return () => off(cancelledRef, 'value', listener);
    };

    useEffect(() => {
        const cleanup = fetchDataFromFirebase();
        return cleanup;
    }, []);

    const renderVenueItem = ({ item }) => (
        <View style={styles.venueCard}>
            <Image source={{ uri: `data:image/jpeg;base64,${item.photoBase64}` }} style={styles.venueImage} />
            <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{item.venueName}</Text>
                <Text style={styles.venueType}>{item.venueType}</Text>
                <Text style={styles.venueCity}>{item.city}</Text>
                <Text style={styles.venueCapacity}>Capacity: {item.capacity}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.tabContainer}>
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading cancelled venues...</Text>
                </View>
            ) : cancelledRestaurants.length > 0 ? (
                <FlatList
                    data={cancelledRestaurants}
                    renderItem={renderVenueItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.venueList}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>No cancelled venues found</Text>
                </View>
            )}
        </View>
    );
};




const AdminHomeScreen = () => {


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning 🔥</Text>
                    <Text style={styles.title}>Admin Dashboard</Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                    <Ionicons name="notifications-outline" size={24} color="#9CA3AF"/>
                </TouchableOpacity>
            </View>

            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: "#8B5CF6",
                    tabBarInactiveTintColor: "#9CA3AF",
                    tabBarIndicatorStyle: {backgroundColor: "#8B5CF6"},
                    tabBarLabelStyle: {fontSize: 14, fontWeight: "600"},
                    tabBarStyle: {backgroundColor: "#374151"},
                }}
            >
                <Tab.Screen name="Approved" component={ApprovedScreen}/>
                <Tab.Screen name="Requested" component={RequestedScreen}/>
                <Tab.Screen name="Cancelled" component={CancelledScreen}/>
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
