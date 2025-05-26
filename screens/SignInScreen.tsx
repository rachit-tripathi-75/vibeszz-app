"use client"

import React, { useState } from "react"
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, StatusBar, Image} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RadioButton } from "react-native-paper"
import * as Google from "expo-google-app-auth";
import Icon from "react-native-vector-icons/MaterialIcons"
import firebase from "firebase/compat";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;


//********************** starting point **************************************

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [userType, setUserType] = useState("user")
    const [showSignUp, setShowSignUp] = useState(false)
    const [error, setError] = useState<string | null>(null);

    const handleSignIn = () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password")
            return
        }

        // Check predefined credentials for different user types
        if (email === "user@test.com" && password === "password") {
            navigation.navigate("UserHome")
        } else if (email === "owner@test.com" && password === "password") {
            navigation.navigate("OwnerHome")
        } else if (email === "admin@test.com" && password === "password") {
            navigation.navigate("AdminHome")
        } else {
            Alert.alert("Error", "Invalid credentials. Please try again.")
        }
    }

    const handleSignUp = () => {
        if (userType === "user") {
            navigation.navigate("UserRegistration")
        } else if (userType === "owner") {
            navigation.navigate("OwnerRegistration")
        } else if (userType === "admin") {
            navigation.navigate("AdminRegistration")
        }
    }

    const SocialButton = ({ icon, onPress }) => (
        <TouchableOpacity style={styles.socialButton} onPress={onPress}>
            <Icon name={icon} size={24} color="#fff" />
        </TouchableOpacity>
    )

    const signInWithGoogle = async () => {
        // try {
        //     const result = await Google.logInAsync({
        //         iosClientId: Constants.expo
        //     })
        // }
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {/* Welcome text */}
                    <View style={styles.welcomeSection}>
                        <Text style={styles.welcomeTitle}>Welcome back!</Text>
                        <Text style={styles.welcomeSubtitle}>Glad to see you, Again!</Text>
                    </View>
                    <Image
                        source={require('../assets/vibeszz.png')}
                        style={{
                            width: 100,
                            height: 100,
                            alignSelf: 'center' // Updated to center the image
                        }}
                    />

                    {/* Email input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Your Email"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password input */}
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
                            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                                <Icon name={showPassword ? "visibility-off" : "visibility"} size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Forgot password */}
                    <View style={styles.forgotPasswordContainer}>
                        <TouchableOpacity>
                            <Text style={styles.forgotPasswordText}>Forget Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Continue button */}
                    <TouchableOpacity style={styles.continueButton} onPress={handleSignIn}>
                        <Text style={styles.continueButtonText}>Continue</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or Sign in with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social login buttons */}
                    <View style={styles.socialButtonsContainer}>
                        <SocialButton icon="facebook" onPress={() => console.log("Facebook login")} />
                        {/*<SocialButton icon="google" onPress={() => console.log("Google login")} />*/}
                        <SocialButton icon="google" onPress={() => signInWithGoogle} />
                        <SocialButton icon="apple" onPress={() => console.log("Apple login")} />
                    </View>

                    {/* Sign up section */}
                    <View style={styles.signUpPrompt}>
                        <Text style={styles.signUpPromptText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => setShowSignUp(!showSignUp)}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign up options */}
                    {showSignUp && (
                        <View style={styles.signUpSection}>
                            <Text style={styles.signUpTitle}>Sign up as:</Text>
                            <View style={styles.radioGroup}>
                                <View style={styles.radioOption}>
                                    <RadioButton
                                        value="user"
                                        status={userType === "user" ? "checked" : "unchecked"}
                                        onPress={() => setUserType("user")}
                                        color="#A855F7"
                                        uncheckedColor="#6B7280"
                                    />
                                    <Text style={styles.radioLabel}>User</Text>
                                </View>

                                <View style={styles.radioOption}>
                                    <RadioButton
                                        value="owner"
                                        status={userType === "owner" ? "checked" : "unchecked"}
                                        onPress={() => setUserType("owner")}
                                        color="#A855F7"
                                        uncheckedColor="#6B7280"
                                    />
                                    <Text style={styles.radioLabel}>Restaurant/Club Owner</Text>
                                </View>

                                <View style={styles.radioOption}>
                                    <RadioButton
                                        value="admin"
                                        status={userType === "admin" ? "checked" : "unchecked"}
                                        onPress={() => setUserType("admin")}
                                        color="#A855F7"
                                        uncheckedColor="#6B7280"
                                    />
                                    <Text style={styles.radioLabel}>Admin</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                                <Text style={styles.signUpButtonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    scrollContent: {
        flexGrow: 1,
    },
    statusBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    statusText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    statusRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    signalBars: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 2,
    },
    bar: {
        width: 3,
        backgroundColor: "#fff",
        borderRadius: 1,
    },
    battery: {
        width: 24,
        height: 12,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 2,
        padding: 1,
    },
    batteryFill: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
        justifyContent:'center'
    },
    welcomeSection: {
        marginBottom: 32,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#D1D5DB",
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        color: "#fff",
        fontSize: 16,
        marginBottom: 8,
        fontWeight: "500",
    },
    input: {
        backgroundColor: "#374151",
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: "#fff",
        borderWidth: 1,
        borderColor: "#4B5563",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#374151",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#4B5563",
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: "#fff",
    },
    eyeButton: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    forgotPasswordContainer: {
        alignItems: "flex-end",
        marginBottom: 32,
    },
    forgotPasswordText: {
        color: "#A855F7",
        fontSize: 14,
    },
    continueButton: {
        backgroundColor: "#A855F7",
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 32,
    },
    continueButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#4B5563",
    },
    dividerText: {
        color: "#9CA3AF",
        fontSize: 14,
        paddingHorizontal: 16,
    },
    socialButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        flex: 1,
        backgroundColor: "#374151",
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#4B5563",
    },
    signUpPrompt: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    signUpPromptText: {
        color: "#9CA3AF",
        fontSize: 16,
    },
    signUpLink: {
        color: "#A855F7",
        fontSize: 16,
        fontWeight: "600",
    },
    signUpSection: {
        backgroundColor: "#111827",
        borderRadius: 12,
        padding: 20,
        marginTop: 16,
    },
    signUpTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
    radioGroup: {
        marginBottom: 20,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    radioLabel: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 8,
    },
    signUpButton: {
        backgroundColor: "#A855F7",
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: "center",
    },
    signUpButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
})

export default SignInScreen
