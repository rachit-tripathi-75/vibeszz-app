"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RadioButton } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"

const UserRegistrationScreen = ({ navigation }) => {
    const [mobileNumber, setMobileNumber] = useState("")
    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const [gender, setGender] = useState("male")

    const handleSubmit = () => {
        if (!mobileNumber || !name || !city) {
            Alert.alert("Error", "Please fill all the required fields")
            return
        }

        if (mobileNumber.length !== 10) {
            Alert.alert("Error", "Please enter a valid 10-digit mobile number")
            return
        }

        navigation.navigate("UserHome")
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Registration</Text>
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

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={[styles.input, styles.fullInput]}
                            placeholder="Enter your city"
                            placeholderTextColor="#9CA3AF"
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Gender</Text>
                        <View style={styles.radioGroup}>
                            <View style={styles.radioOption}>
                                <RadioButton
                                    value="male"
                                    status={gender === "male" ? "checked" : "unchecked"}
                                    onPress={() => setGender("male")}
                                    color="#8B5CF6"
                                />
                                <Text style={styles.radioText}>Male</Text>
                            </View>

                            <View style={styles.radioOption}>
                                <RadioButton
                                    value="female"
                                    status={gender === "female" ? "checked" : "unchecked"}
                                    onPress={() => setGender("female")}
                                    color="#8B5CF6"
                                />
                                <Text style={styles.radioText}>Female</Text>
                            </View>

                            <View style={styles.radioOption}>
                                <RadioButton
                                    value="other"
                                    status={gender === "other" ? "checked" : "unchecked"}
                                    onPress={() => setGender("other")}
                                    color="#8B5CF6"
                                />
                                <Text style={styles.radioText}>Other</Text>
                            </View>
                        </View>
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
        justifyContent: "space-between",
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
    },
    radioText: {
        color: "#FFFFFF",
        fontSize: 16,
        marginLeft: 8,
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

export default UserRegistrationScreen
