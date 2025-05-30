"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native"
import { Picker } from "@react-native-picker/picker"

const CallScreen = () => {
    const [callerName, setCallerName] = useState("Ms. Claire")
    const [callTime, setCallTime] = useState("")
    const [ringtone, setRingtone] = useState("Default")

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Fake Call Setup</Text>

            <View style={styles.formContainer}>
                <Text style={styles.label}>Caller Name</Text>
                <TextInput
                    style={styles.input}
                    value={callerName}
                    onChangeText={setCallerName}
                    placeholder="Enter caller name"
                    placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.label}>Caller Photo</Text>
                <View style={styles.photoContainer}>
                    <Image source={{ uri: "/placeholder.svg?height=80&width=80" }} style={styles.callerPhoto} />
                </View>

                <Text style={styles.label}>Call Time</Text>
                <TextInput
                    style={styles.input}
                    value={callTime}
                    onChangeText={setCallTime}
                    placeholder="Set call time"
                    placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.label}>Ringtone</Text>
                <View style={styles.pickerWrapper}>
                    <Picker selectedValue={ringtone} onValueChange={(itemValue) => setRingtone(itemValue)} style={styles.picker}>
                        <Picker.Item label="Default" value="Default" color="#FFFFFF" />
                        <Picker.Item label="Classic" value="Classic" color="#FFFFFF" />
                        <Picker.Item label="Modern" value="Modern" color="#FFFFFF" />
                    </Picker>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.previewButton}>
                    <Text style={styles.previewButtonText}>Preview Call Screen</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.scheduleButton}>
                    <Text style={styles.scheduleButtonText}>Scheduled Fake Call</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 40,
    },
    formContainer: {
        flex: 1,
    },
    label: {
        fontSize: 18,
        color: "#FFFFFF",
        marginBottom: 12,
        marginTop: 24,
    },
    input: {
        backgroundColor: "#374151",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: "#FFFFFF",
    },
    photoContainer: {
        alignItems: "flex-start",
        marginBottom: 8,
    },
    callerPhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#374151",
    },
    pickerWrapper: {
        backgroundColor: "#374151",
        borderRadius: 12,
        overflow: "hidden",
    },
    picker: {
        height: 50,
        color: "#FFFFFF",
    },
    buttonContainer: {
        paddingBottom: 40,
    },
    previewButton: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#8B5CF6",
        borderRadius: 12,
        paddingVertical: 16,
        marginBottom: 16,
        alignItems: "center",
    },
    previewButtonText: {
        color: "#8B5CF6",
        fontSize: 16,
        fontWeight: "600",
    },
    scheduleButton: {
        backgroundColor: "#8B5CF6",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
    },
    scheduleButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
})

export default CallScreen
