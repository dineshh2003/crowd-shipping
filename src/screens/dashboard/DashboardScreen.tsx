import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/Card';

type StatisticProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
};

const Statistic = ({ title, value, icon, change }: StatisticProps) => (
  <Card style={styles.statCard}>
    <View style={styles.statHeader}>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statIconContainer}>{icon}</View>
    </View>
    {change && (
      <Text style={styles.statChange}>
        <MaterialIcons name="trending-up" size={14} color="#16a34a" /> {change}
      </Text>
    )}
  </Card>
);

type ActivityItemProps = {
  title: string;
  time: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: React.ReactNode;
};

const ActivityItem = ({ title, time, status, icon }: ActivityItemProps) => (
  <View style={styles.activityItem}>
    <View style={styles.activityIconContainer}>{icon}</View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
    <View
      style={[
        styles.activityStatus,
        status === 'completed'
          ? styles.statusCompleted
          : status === 'in-progress'
          ? styles.statusInProgress
          : styles.statusPending,
      ]}
    >
      <Text
        style={[
          styles.activityStatusText,
          status === 'completed'
            ? styles.statusCompletedText
            : status === 'in-progress'
            ? styles.statusInProgressText
            : styles.statusPendingText,
        ]}
      >
        {status === 'completed'
          ? 'Completed'
          : status === 'in-progress'
          ? 'In Progress'
          : 'Pending'}
      </Text>
    </View>
  </View>
);

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    deliveries: '24',
    active: '3',
    earnings: '$342',
  });

  const isDeliveryPartner = user?.userType === 'partner';

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => logout(),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialIcons name="account-circle" size={40} color="#4A80F0" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.statsContainer}>
          <Statistic
            title="Total Deliveries"
            value={stats.deliveries}
            icon={<FontAwesome5 name="box" size={20} color="#4A80F0" />}
            change="12% from last month"
          />
          <Statistic
            title={isDeliveryPartner ? "Active Orders" : "Active Shipments"}
            value={stats.active}
            icon={<FontAwesome5 name="shipping-fast" size={20} color="#4A80F0" />}
          />
          <Statistic
            title={isDeliveryPartner ? "Total Earnings" : "Total Spent"}
            value={stats.earnings}
            icon={<MaterialIcons name="attach-money" size={24} color="#4A80F0" />}
            change="8% from last month"
          />
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="add-location" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>
                {isDeliveryPartner ? "Mark Delivery Area" : "Request Pickup"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="history" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>
                {isDeliveryPartner ? "View Available Orders" : "Track Shipment"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard}>
            <ActivityItem
              title="Order #1001 Delivered"
              time="2 hours ago"
              status="completed"
              icon={<FontAwesome5 name="box" size={16} color="#4A80F0" />}
            />
            <ActivityItem
              title="Order #1002 In Transit"
              time="Yesterday"
              status="in-progress"
              icon={<FontAwesome5 name="truck" size={16} color="#4A80F0" />}
            />
            <ActivityItem
              title="Order #1003 Accepted"
              time="2 days ago"
              status="pending"
              icon={<MaterialIcons name="pending-actions" size={16} color="#4A80F0" />}
            />
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Activity</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#4A80F0" />
            </TouchableOpacity>
          </Card>
        </View>

        {isDeliveryPartner && (
          <View style={styles.earningsContainer}>
            <Text style={styles.sectionTitle}>Earnings Overview</Text>
            <Card style={styles.earningsCard}>
              <View style={styles.earningsSummary}>
                <View style={styles.earningsItem}>
                  <Text style={styles.earningsLabel}>Today</Text>
                  <Text style={styles.earningsValue}>$42</Text>
                </View>
                <View style={styles.earningsDivider} />
                <View style={styles.earningsItem}>
                  <Text style={styles.earningsLabel}>This Week</Text>
                  <Text style={styles.earningsValue}>$185</Text>
                </View>
                <View style={styles.earningsDivider} />
                <View style={styles.earningsItem}>
                  <Text style={styles.earningsLabel}>This Month</Text>
                  <Text style={styles.earningsValue}>$342</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.withdrawButton}>
                <Text style={styles.withdrawButtonText}>Withdraw Earnings</Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    padding: 5,
  },
  logoutButton: {
    padding: 8,
    marginRight: 10,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    padding: 15,
  },
  statCard: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
  },
  statHeader: {
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statChange: {
    marginTop: 8,
    fontSize: 12,
    color: '#16a34a',
  },
  actionsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1e293b',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4A80F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  recentActivityContainer: {
    padding: 15,
  },
  activityCard: {
    padding: 0,
    borderRadius: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
  },
  statusInProgress: {
    backgroundColor: '#dbeafe',
  },
  statusPending: {
    backgroundColor: '#fef9c3',
  },
  activityStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusCompletedText: {
    color: '#166534',
  },
  statusInProgressText: {
    color: '#1e40af',
  },
  statusPendingText: {
    color: '#854d0e',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A80F0',
    marginRight: 5,
  },
  earningsContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  earningsCard: {
    padding: 15,
    borderRadius: 12,
  },
  earningsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  earningsItem: {
    flex: 1,
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  earningsValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  earningsDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  withdrawButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});