"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RadioButton } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

const OwnerRegistrationScreen = ({ navigation }) => {
    const [name, setName] = useState("")
    const [type, setType] = useState("restaurant")
    const [capacity, setCapacity] = useState("")
    const [photo, setPhoto] = useState(null)
    const [mobileNumber, setMobileNumber] = useState("")
    const [city, setCity] = useState("")

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

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
            setPhoto(result.assets[0].uri)
        }
    }

    const handleSubmit = () => {
        if (!name || !capacity || !mobileNumber || !city) {
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

        navigation.navigate("OwnerHome")
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Owner Registration</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Venue Name</Text>
                        <TextInput
                            style={[styles.input, styles.fullInput]}
                            placeholder="Enter venue name"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
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
                            <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
                            <Text style={styles.photoButtonText}>Upload Photo</Text>
                        </TouchableOpacity>
                        {photo && <Image source={{ uri: photo }} style={styles.photoPreview} />}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputPrefix}>+91</Text>
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

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
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
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: "#FFFFFF",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#374151",
        borderRadius: 12,
    },
    inputPrefix: {
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#FFFFFF",
        borderRightWidth: 1,
        borderRightColor: "#4B5563",
    },
    input: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: "#FFFFFF",
    },
    fullInput: {
        backgroundColor: "#374151",
        borderRadius: 12,
    },
    radioGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        width: "48%",
        marginBottom: 12,
    },
    radioText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginLeft: 8,
    },
    photoButton: {
        backgroundColor: "#8B5CF6",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 12,
    },
    photoButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginLeft: 8,
    },
    photoPreview: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginTop: 12,
    },
    submitButton: {
        backgroundColor: "#8B5CF6",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 24,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
})

export default OwnerRegistrationScreen
