import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar, View, Animated, Easing } from 'react-native';
import { LayoutDashboard, ReceiptText, PackageSearch, Wallet, Loader2 } from 'lucide-react-native';

import { COLORS } from './src/constants/theme';
import { storage } from './src/utils/storage';
import apiClient from './src/api/client';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionEntryScreen from './src/screens/TransactionEntryScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import BalanceHistoryScreen from './src/screens/BalanceHistoryScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import InventoryConfirmationScreen from './src/screens/InventoryConfirmationScreen';
import Header from './src/components/Header';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: '#0F172A', // Dark navy to match theme
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: COLORS.primary, // Brand Lime Green
        tabBarInactiveTintColor: '#64748B',
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === 'Dashboard') icon = <LayoutDashboard size={size} color={color} />;
          else if (route.name === 'Transactions') icon = <ReceiptText size={size} color={color} />;
          else if (route.name === 'Inventory') icon = <PackageSearch size={size} color={color} />;
          else if (route.name === 'Balance') icon = <Wallet size={size} color={color} />;
          return icon;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionEntryScreen} />
      <Tab.Screen 
        name="Inventory" 
        component={InventoryScreen} 
        options={{
          tabBarBadge: 1,
          tabBarBadgeStyle: { backgroundColor: COLORS.error, color: COLORS.white, fontSize: 10 }
        }}
      />
      <Tab.Screen name="Balance" component={BalanceHistoryScreen} />
    </Tab.Navigator>
  );
}

const DynamicLoadingIcon = () => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Loader2 size={48} color={COLORS.primary} />
    </Animated.View>
  );
};

function Navigation() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center' }}>
        <DynamicLoadingIcon />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F172A' },
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="InventoryConfirmation" component={InventoryConfirmationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
