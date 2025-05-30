"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { ref, set, get } from "firebase/database"
import { db } from "../config/firebaseConfig"

const AdminRegistrationScreen = ({ navigation }) => {
    const [mobileNumber, setMobileNumber] = useState("")
    const [name, setName] = useState("")

    // Function to generate a random key for admins (e.g., admin123)
    const setKeyForAdmin = () => {
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        console.log("Generated admin key: admin" + randomNum);
        return "admin" + randomNum;
    }

    const uploadDataToFirebase = () => {
        // Validate inputs
        if (!mobileNumber || !name) {
            Alert.alert("Error", "Please fill all the required fields")
            return
        }

        if (mobileNumber.length !== 10) {
            Alert.alert("Error", "Please enter a valid 10-digit mobile number")
            return
        }

        // Step 1: Register the mobile number in registeredmobilenumbers
        const mobileNumbersRef = ref(db, 'registeredmobilenumbers')

        get(mobileNumbersRef)
            .then((snapshot) => {
                let mobileNumbers = []

                // If data exists, get the current array; otherwise, start with an empty array
                if (snapshot.exists()) {
                    mobileNumbers = snapshot.val().mobileNumbers || []
                    if (!Array.isArray(mobileNumbers)) {
                        mobileNumbers = [mobileNumbers]
                    }
                }

                // Append the new mobile number
                mobileNumbers.push(mobileNumber)

                // Write the updated array back to the database
                return set(mobileNumbersRef, {
                    mobileNumbers: mobileNumbers
                })
            })
            .then(() => {
                console.log("Mobile number registered successfully")

                // Step 2: After registering the mobile number, upload the admin data
                const primaryKey = setKeyForAdmin()
                const adminRef = ref(db, `admindb/${primaryKey}`)

                return set(adminRef, {
                    name: name,
                    mobileNumber: mobileNumber,
                })
            })
            .then(() => {
                // Step 3: Reset form fields and navigate to AdminHome
                setName('')
                setMobileNumber('')
                navigation.navigate("AdminHome")
                Alert.alert("Success", "Admin registered successfully")
            })
            .catch((error) => {
                Alert.alert("Error", "Failed to register admin: " + error.message)
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Admin Registration</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
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
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={[styles.input, styles.fullInput]}
                            placeholder="Enter your name"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={uploadDataToFirebase}>
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

export default AdminRegistrationScreen
