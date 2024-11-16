import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { initDatabase, registerUser, loginUser } from './utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        initDatabase()
        checkLoginStatus()
    }, [])

    const checkLoginStatus = async () => {
        const status = await AsyncStorage.getItem('isLoggedIn')
        if (status === 'true') {
            setIsLoggedIn(true)
        }
    }

    const handleSubmit = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please fill up the required fields')
            return
        }

        try {
            if (isLogin) {
                const success = await loginUser(username, password)
                if (success) {
                    await AsyncStorage.setItem('isLoggedIn', 'true')
                    setIsLoggedIn(true)
                    Alert.alert('Success', 'Logged in successfully')
                } else {
                    Alert.alert('Error', 'Invalid credentials')
                }
            } else {
                await registerUser(username, password)
                Alert.alert('Success', 'Registration successful')
                setIsLogin(true)
            }
        } catch (error) {
            Alert.alert('Error', error.message)
        }
    }

    const handleLogout = async () => {
        await AsyncStorage.removeItem('isLoggedIn')
        setIsLoggedIn(false)
        setUsername('')
        setPassword('')
    }

    if (isLoggedIn) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loggedInContainer}>
                    <Image
                        source={require('./assets/avatar.png')}
                        style={styles.avatar}
                    />
                    <Text style={styles.welcomeTitle}>
                        Welcome, {username}!
                    </Text>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.formContainer}>
                    <Image
                        source={require('./assets/icon.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            placeholderTextColor="#BCBCBC"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#BCBCBC"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.mainButton}
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => setIsLogin(!isLogin)}
                    >
                        <Text style={styles.switchText}>
                            {isLogin
                                ? "Don't have an account? Sign up for free "
                                : 'Already have an account? Sign in'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <StatusBar style="auto" />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 50,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mainButton: {
    backgroundColor: '#0047AB',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 8,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    padding: 10,
  },
  switchText: {
    color: '#0096FF',
    fontSize: 16,
    fontWeight: '600',
  },
  loggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});