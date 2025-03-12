import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

type DeliveryPartnerBottomNavigationProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function DeliveryPartnerBottomNavigation({ 
  activeTab, 
  setActiveTab 
}: DeliveryPartnerBottomNavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'orders', label: 'Orders', icon: 'assignment' },
    { id: 'tracking', label: 'Tracking', icon: 'map' },
    { id: 'payments', label: 'Payments', icon: 'account-balance-wallet' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => setActiveTab(tab.id)}
        >
          <MaterialIcons
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.id ? '#4A80F0' : '#64748b'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.id && styles.activeTabLabel,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    height: 60,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#4A80F0',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    color: '#64748b',
  },
  activeTabLabel: {
    color: '#4A80F0',
    fontWeight: '500',
  },
});