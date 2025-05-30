"use client"

import React, {useEffect, useState} from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    Image,
    Platform,
    KeyboardAvoidingView
} from "react-native"
import {SafeAreaView} from "react-native-safe-area-context"
import {RadioButton} from "react-native-paper"
import {Ionicons} from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import {db} from "../config/firebaseConfig";
import {ref, set, onValue, get} from 'firebase/database';
import * as FileSystem from 'expo-file-system';
import {degToRad} from "react-native-gesture-handler/lib/typescript/web/utils";
import Icon from "react-native-vector-icons/MaterialIcons";


const OwnerRegistrationScreen = ({navigation}) => {
    const [venueName, setVenueName] = useState("")
    const [name, setName] = useState("");
    const [type, setType] = useState("restaurant")
    const [capacity, setCapacity] = useState("")
    const [photo, setPhoto] = useState(null)
    const [mobileNumber, setMobileNumber] = useState("")
    const [city, setCity] = useState("");
    const [ownerData, setOwnerData] = useState([]);
    const [photoBase64, setPhotoBase64] = useState(null);
    const [primaryKey, setPrimaryKey] = useState("");
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)


    const setKeyForOwner = () => {
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        console.log("Generated admin key: admin" + randomNum);
        return randomNum;
    }


    const pickImage = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (status !== "granted") {
            Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to upload an image.")
            return
        }


        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.canceled) {
            const uri = result.assets[0].uri
            setPhoto(uri)
            // now converting this photo, to upload it to firebase rtdb....
            try {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64
                })
                setPhotoBase64(base64)
            } catch (error) {
                Alert.alert("Error", "Failed to convert image to Base64" + error.message);
            }
        }
    }

    const uploadDataToFirebase = () => {


        if (!name || !venueName || !capacity || !mobileNumber || !city) {
            Alert.alert("Error", "Please fill all the required fields")
            return
        }

        if (mobileNumber.length !== 10) {
            Alert.alert("Error", "Please enter a valid 10-digit mobile number")
            return
        }

        if (!photo) {
            Alert.alert("Error", "Please upload a photo of your venue")
            return
        }

        if (!password) {
            Alert.alert("Error", "Please set up your password")
            return
        }

        if (!confirmPassword) {
            Alert.alert("Error", "Please confirm your password")
            return
        }

        if (password != confirmPassword) {
            Alert.alert("Error", "Password must be same")
            return
        }


        const mobileNumbersRef = ref(db, 'registeredmobilenumbers');
        const requestedRef = ref(db, 'requested'); // Changed to 'approved' based on your comment
        const primaryKeyForOwner = "owner" + setKeyForOwner();

        get(mobileNumbersRef)
            .then((snapshot) => {
                let mobileNumbers = [];

                // If data exists, get the current array; otherwise, start with an empty array
                if (snapshot.exists()) {
                    mobileNumbers = snapshot.val().mobileNumbers || [];
                    if (!Array.isArray(mobileNumbers)) {
                        mobileNumbers = [mobileNumbers];
                    }
                }

                if (mobileNumbers.includes(mobileNumber)) {
                    alert("This mobile number already exists. Please use a different mobile number");
                    return Promise.reject(new Error("Mobile number already exists"));
                }

                // Append the new mobile number
                mobileNumbers.push(mobileNumber);

                // Write the updated array back to the database
                return set(mobileNumbersRef, {
                    mobileNumbers: mobileNumbers,
                });
            })
            .then(() => {
                console.log("Mobile number registered successfully");

                const ownerRef = ref(db, `ownerdb/${primaryKeyForOwner}`);

                return set(ownerRef, {
                    id: primaryKeyForOwner,
                    ownerName: name,
                    venueName: venueName,
                    venueType: type,
                    capacity: capacity,
                    mobileNumber: mobileNumber,
                    city: city,
                    status: 0,
                    photoBase64: photoBase64,
                    password: password
                });
            })
            .then(() => {
                // Step 3: Append the owner ID to the requested section
                return get(requestedRef).then((snapshot) => {
                    let ownerIds = [];

                    // If data exists, get the current array; otherwise, start with an empty array
                    if (snapshot.exists()) {
                        ownerIds = snapshot.val().ownerIds || [];
                        if (!Array.isArray(ownerIds)) {
                            ownerIds = [ownerIds];
                        }
                    }

                    // Append the new owner ID
                    ownerIds.push(primaryKeyForOwner);

                    // Write the updated array back to the database
                    return set(requestedRef, {
                        ownerIds: ownerIds,
                    });
                });
            })
            .then(() => {
                console.log(`Owner ID ${primaryKey} sent for approval.`);

                // Step 4: Reset form fields and navigate to OwnerHome
                setName('');
                setVenueName('');
                setType("restaurant");
                setCapacity('');
                setMobileNumber('');
                setCity('');
                navigation.navigate("OwnerHome");
            })
            .catch((error) => {
                console.error("Error details:", error); // Log detailed error for debugging
                Alert.alert("Error", `Failed to register owner: ${error.message}`);
            });


    }

    // Fetch data from Firebase
    const fetchDataFromFirebase = () => {
        const starCountRef = ref(db, 'ownerdb/')
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val()
            if (data) {
                // Convert the object into an array of values
                const dataArray = Object.values(data)
                setOwnerData(dataArray)
                console.log("Fetched data:", dataArray) // Log the fetched data directly
            } else {
                setOwnerData([])
                console.log("No data available")
            }
        }, (error) => {
            console.error("Error fetching data:", error)
            Alert.alert("Error", "Failed to fetch data: " + error.message)
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF"/>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Owner Registration</Text>
                    <View style={styles.placeholder}/>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.content}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Your Name</Text>
                            <TextInput
                                style={[styles.input, styles.fullInput]}
                                placeholder="Enter your name"
                                placeholderTextColor="#9CA3AF"
                                value={name}
                                onChangeText={setName}
                            />
                            <Text style={styles.label}>Venue Name</Text>
                            <TextInput
                                style={[styles.input, styles.fullInput]}
                                placeholder="Enter venue name"
                                placeholderTextColor="#9CA3AF"
                                value={venueName}
                                onChangeText={setVenueName}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Venue Type</Text>
                            <View style={styles.radioGroup}>
                                <View style={styles.radioOption}>
                                    <RadioButton
                                        value="restaurant"
                                        status={type === "restaurant" ? "checked" : "unchecked"}
                                        onPress={() => setType("restaurant")}
                                        color="#8B5CF6"
                                    />
                                    <Text style={styles.radioText}>Restaurant</Text>
                                </View>

                                <View style={styles.radioOption}>
                                    <RadioButton
                                        value="club"
                                        status={type === "club" ? "checked" : "unchecked"}
                                        onPress={() => setType("club")}
                                        color="#8B5CF6"
                                    />
                                    <Text style={styles.radioText}>Club</Text>
                                </View>

                                <View style={styles.radioOption}>
                                    <RadioButton
                                        value="pub"
                                        status={type === "pub" ? "checked" : "unchecked"}
                                        onPress={() => setType("pub")}
                                        color="#8B5CF6"
                                    />
                                    <Text style={styles.radioText}>Pub</Text>
                                </View>

                                <View style={styles.radioOption}>
                                    <RadioButton
                                        value="bar"
                                        status={type === "bar" ? "checked" : "unchecked"}
                                        onPress={() => setType("bar")}
                                        color="#8B5CF6"
                                    />
                                    <Text style={styles.radioText}>Bar</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Total Capacity</Text>
                            <TextInput
                                style={[styles.input, styles.fullInput]}
                                placeholder="Enter total capacity"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="number-pad"
                                value={capacity}
                                onChangeText={setCapacity}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Venue Photo</Text>
                            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                <Ionicons name="camera-outline" size={24} color="#FFFFFF"/>
                                <Text style={styles.photoButtonText}>Upload Photo</Text>
                            </TouchableOpacity>
                            {photo && <Image source={{uri: photo}} style={styles.photoPreview}/>}
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputPrefix}>+41</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter mobile number"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    value={mobileNumber}
                                    onChangeText={setMobileNumber}
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>City</Text>
                            <TextInput
                                style={[styles.input, styles.fullInput]}
                                placeholder="Enter city"
                                placeholderTextColor="#9CA3AF"
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter Your Password"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity style={styles.eyeButton}
                                                  onPress={() => setShowPassword(!showPassword)}>
                                    <Icon name={showPassword ? "visibility-off" : "visibility"} size={20}
                                          color="#9CA3AF"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Confirm Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Confirm Your Password"
                                    placeholderTextColor="#9CA3AF"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <TouchableOpacity style={styles.eyeButton}
                                                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <Icon name={showConfirmPassword ? "visibility-off" : "visibility"} size={20}
                                          color="#9CA3AF"/>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* change the function to handleSubmit */}
                        <TouchableOpacity style={styles.submitButton} onPress={uploadDataToFirebase}>
                            <Text style={styles.buttonText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
            backgroundColor
    :
        "#000000",
    }
,
    header: {
        flexDirection: "row",
            alignItems
    :
        "center",
            justifyContent
    :
        "space-between",
            paddingHorizontal
    :
        24,
            paddingVertical
    :
        16,
    }
,
    backButton: {
        width: 40,
            height
    :
        40,
            borderRadius
    :
        20,
            backgroundColor
    :
        "#374151",
            justifyContent
    :
        "center",
            alignItems
    :
        "center",
    }
,
    headerTitle: {
        fontSize: 18,
            fontWeight
    :
        "600",
            color
    :
        "#FFFFFF",
    }
,
    placeholder: {
        width: 40,
    }
,
    scrollContent: {
        flexGrow: 1,
    }
,
    content: {
        flex: 1,
            padding
    :
        24,
    }
,
    formGroup: {
        marginBottom: 24,
    }
,
    label: {
        fontSize: 16,
            marginBottom
    :
        8,
            marginTop
    :
        8,
            color
    :
        "#FFFFFF",
    }
,
    inputContainer: {
        flexDirection: "row",
            alignItems
    :
        "center",
            backgroundColor
    :
        "#374151",
            borderRadius
    :
        12,
    }
,
    inputPrefix: {
        paddingHorizontal: 16,
            fontSize
    :
        16,
            color
    :
        "#FFFFFF",
            borderRightWidth
    :
        1,
            borderRightColor
    :
        "#4B5563",
    }
,
    input: {
        flex: 1,
            padding
    :
        16,
            fontSize
    :
        16,
            color
    :
        "#FFFFFF",
    }
,
    fullInput: {
        backgroundColor: "#374151",
            borderRadius
    :
        12,
    }
,
    radioGroup: {
        flexDirection: "row",
            flexWrap
    :
        "wrap",
            justifyContent
    :
        "space-between",
    }
,
    radioOption: {
        flexDirection: "row",
            alignItems
    :
        "center",
            width
    :
        "48%",
            marginBottom
    :
        12,
    }
,
    radioText: {
        color: "#FFFFFF",
            fontSize
    :
        16,
            marginLeft
    :
        8,
    }
,
    photoButton: {
        backgroundColor: "#8B5CF6",
            padding
    :
        16,
            borderRadius
    :
        12,
            alignItems
    :
        "center",
            flexDirection
    :
        "row",
            justifyContent
    :
        "center",
            marginBottom
    :
        12,
    }
,
    photoButtonText: {
        color: "#FFFFFF",
            fontSize
    :
        16,
            marginLeft
    :
        8,
    }
,
    photoPreview: {
        width: "100%",
            height
    :
        200,
            borderRadius
    :
        12,
            marginTop
    :
        12,
    }
,
    submitButton: {
        backgroundColor: "#8B5CF6",
            padding
    :
        16,
            borderRadius
    :
        12,
            alignItems
    :
        "center",
            marginTop
    :
        24,
    }
,
    inputGroup: {
        marginBottom: 16,
    }
,
    inputLabel: {
        color: "#fff",
            fontSize
    :
        16,
            marginBottom
    :
        8,
            fontWeight
    :
        "500",
    }
,
    passwordContainer: {
        flexDirection: "row",
            alignItems
    :
        "center",
            backgroundColor
    :
        "#374151",
            borderRadius
    :
        8,
            borderWidth
    :
        1,
            borderColor
    :
        "#4B5563",
    }
,
    passwordInput: {
        flex: 1,
            paddingHorizontal
    :
        16,
            paddingVertical
    :
        16,
            fontSize
    :
        16,
            color
    :
        "#fff",
    }
,
    eyeButton: {
        paddingHorizontal: 16,
            paddingVertical
    :
        16,
    }
,
    buttonText: {
        color: "#FFFFFF",
            fontSize
    :
        18,
            fontWeight
    :
        "600",
    }
,
})

export default OwnerRegistrationScreen
