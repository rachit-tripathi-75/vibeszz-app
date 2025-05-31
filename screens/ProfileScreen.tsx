import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from "react-native"
import {Ionicons} from "@expo/vector-icons"
import {useEffect, useState} from "react";
import {onValue, ref} from "firebase/database";
import {db} from "../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CommonActions, useNavigation, NavigationContainer} from "@react-navigation/native";

const getData = async (key) => {
    try {
        const value: string | null = await AsyncStorage.getItem(key);
        if (value != null) {
            return value;
        }
    } catch (error) {
        console.error("Reading error: ", error);
    }
};



// const userId: string = await getData('userId');

// const navigation = useNavigation();

interface UserData {
    city: string;
    gender: string;
    id: string;
    mobileNumber: string,
    name: string,
    password: string;
    photoBase64?: string;
}

const ProfileScreen = () => {

    const [profileData, setProfileData] = useState<UserData | null>(null);
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        const fetchUserId = async() => {
            const value : string | undefined = await getData('userId');
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


    const handleLogout = () => {
        // navigation.dispatch(
        //     CommonActions.reset({
        //         index: 0,
        //         routes: [{name: "SignIn"}]
        //     })
        // )
    }


    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <View style={styles.profileImageContainer}>
                    <Image source={{uri: "/placeholder.svg?height=100&width=100"}} style={styles.profileImage}/>
                    <TouchableOpacity style={styles.editImageButton}>
                        <Ionicons name="camera" size={16} color="#FFFFFF"/>
                    </TouchableOpacity>
                </View>

                <Text style={styles.userName}>{profileData?.name}</Text>
                <Text style={styles.userEmail}>{profileData?.mobileNumber}</Text>

                {/*<TouchableOpacity style={styles.editProfileButton}>*/}
                {/*    <Text style={styles.editProfileText}>Edit Profile</Text>*/}
                {/*</TouchableOpacity>*/}
            </View>


            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#EF4444"/>
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
