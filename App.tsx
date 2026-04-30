import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { LayoutDashboard, ReceiptText, PackageSearch, Wallet } from 'lucide-react-native';

import { COLORS } from './src/constants/theme';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionEntryScreen from './src/screens/TransactionEntryScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import BalanceHistoryScreen from './src/screens/BalanceHistoryScreen';
import Header from './src/components/Header';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: '#0F172A', // Dark navy to match theme
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
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

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#C6FF00" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#C6FF00' },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
