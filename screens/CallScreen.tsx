"use client"

import React, {useState, useRef, useEffect} from "react"
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Modal,
    Animated,
} from "react-native"
import {Picker} from "@react-native-picker/picker"

const CallScreen = () => {
    const [callerName, setCallerName] = useState("Ms. Claire")
    const [callTime, setCallTime] = useState("")
    const [ringtone, setRingtone] = useState("Default")
    const [isCalling, setIsCalling] = useState(false)

    const scaleAnim = useRef(new Animated.Value(1)).current

    // Call animation: pulsing effect
    useEffect(() => {
        if (isCalling) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start()
        } else {
            scaleAnim.stopAnimation()
            scaleAnim.setValue(1)
        }
    }, [isCalling])

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
                    <Image
                        source={{uri: "https://boringapi.com/api/v1/static/photos/300.jpeg"}} // Change to a valid URL or require local image
                        style={styles.callerPhoto}
                    />
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
                    <Picker
                        selectedValue={ringtone}
                        onValueChange={(itemValue) => setRingtone(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Default" value="Default" color="#FFFFFF"/>
                        <Picker.Item label="Classic" value="Classic" color="#FFFFFF"/>
                        <Picker.Item label="Modern" value="Modern" color="#FFFFFF"/>
                    </Picker>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.scheduleButton}
                    onPress={() => setIsCalling(true)}
                >
                    <Text style={styles.scheduleButtonText}>call</Text>
                </TouchableOpacity>

            </View>

            {/* Calling Animation Modal */}
            <Modal visible={isCalling} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <Animated.View style={[styles.callBubble, {transform: [{scale: scaleAnim}]}]}>
                        <Image
                            source={{uri: "https://via.placeholder.com/100"}}
                            style={styles.modalImage}
                        />
                        <Text style={styles.modalName}>{callerName}</Text>
                        <Text style={styles.modalStatus}>Calling…</Text>
                        <TouchableOpacity
                            style={styles.endCallButton}
                            onPress={() => setIsCalling(false)}
                        >
                            <Text style={styles.endCallText}>End Call</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        justifyContent: "center",
        alignItems: "center",
    },
    callBubble: {
        alignItems: "center",
        padding: 32,
        borderRadius: 20,
        backgroundColor: "#1F2937",
    },
    modalImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    modalName: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: "600",
    },
    modalStatus: {
        fontSize: 16,
        color: "#9CA3AF",
        marginVertical: 8,
    },
    endCallButton: {
        marginTop: 16,
        backgroundColor: "#EF4444",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    endCallText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
})

export default CallScreen
