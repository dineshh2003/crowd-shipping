import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Card } from '../../components/Card';

// Mock data for delivery partners
const mockDeliveryPartners = [
  {
    id: '1',
    name: 'John Doe',
    vehicle: 'Electric Bike',
    rating: 4.8,
    orders: 3,
    carbonSaved: 12.5,
    points: 125,
    status: 'active',
    location: { lat: 37.7749, lng: -122.4194 },
  },
  {
    id: '2',
    name: 'Jane Smith',
    vehicle: 'Hybrid Car',
    rating: 4.9,
    orders: 2,
    carbonSaved: 8.3,
    points: 83,
    status: 'active',
    location: { lat: 37.7833, lng: -122.4167 },
  },
  {
    id: '3',
    name: 'Mike Johnson',
    vehicle: 'Electric Scooter',
    rating: 4.7,
    orders: 1,
    carbonSaved: 5.2,
    points: 52,
    status: 'inactive',
    location: { lat: 37.7694, lng: -122.4862 },
  },
];

export default function TrackingScreen() {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredPartners = mockDeliveryPartners.filter(partner => {
    if (filterStatus === 'all') return true;
    return partner.status === filterStatus;
  });

  const totalCarbonSaved = mockDeliveryPartners.reduce(
    (total, partner) => total + partner.carbonSaved,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delivery Partner Tracking</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mockDeliveryPartners.length}</Text>
              <Text style={styles.statLabel}>Total Partners</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {mockDeliveryPartners.filter(p => p.status === 'active').length}
              </Text>
              <Text style={styles.statLabel}>Active Now</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCarbonSaved.toFixed(1)}kg</Text>
              <Text style={styles.statLabel}>CO₂ Saved</Text>
            </View>
          </View>
        </Card>

        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Live Map</Text>
          <Card style={styles.mapCard}>
            {/* This would be replaced with an actual map component */}
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Map View</Text>
              <MaterialIcons name="map" size={48} color="#cbd5e1" />
            </View>
            <View style={styles.mapFilters}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filterStatus === 'all' && styles.filterButtonActive,
                ]}
                onPress={() => setFilterStatus('all')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === 'all' && styles.filterButtonTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filterStatus === 'active' && styles.filterButtonActive,
                ]}
                onPress={() => setFilterStatus('active')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === 'active' && styles.filterButtonTextActive,
                  ]}
                >
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filterStatus === 'inactive' && styles.filterButtonActive,
                ]}
                onPress={() => setFilterStatus('inactive')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterStatus === 'inactive' && styles.filterButtonTextActive,
                  ]}
                >
                  Inactive
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        <View style={styles.partnersContainer}>
          <Text style={styles.sectionTitle}>Delivery Partners</Text>
          {filteredPartners.map(partner => (
            <Card
              key={partner.id}
              style={[
                styles.partnerCard,
                selectedPartner === partner.id && styles.partnerCardSelected,
              ]}
            >
              <TouchableOpacity
                style={styles.partnerCardContent}
                onPress={() => setSelectedPartner(
                  selectedPartner === partner.id ? null : partner.id
                )}
              >
                <View style={styles.partnerHeader}>
                  <View style={styles.partnerInfo}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <View style={styles.partnerDetails}>
                      <Text style={styles.partnerVehicle}>{partner.vehicle}</Text>
                      <View style={styles.partnerRating}>
                        <MaterialIcons name="star" size={14} color="#f59e0b" />
                        <Text style={styles.partnerRatingText}>{partner.rating}</Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.partnerStatus,
                      partner.status === 'active'
                        ? styles.statusActive
                        : styles.statusInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.partnerStatusText,
                        partner.status === 'active'
                          ? styles.statusActiveText
                          : styles.statusInactiveText,
                      ]}
                    >
                      {partner.status === 'active' ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>

                {selectedPartner === partner.id && (
                  <View style={styles.partnerExpandedContent}>
                    <View style={styles.partnerStats}>
                      <View style={styles.partnerStatItem}>
                        <Text style={styles.partnerStatValue}>{partner.orders}</Text>
                        <Text style={styles.partnerStatLabel}>Orders</Text>
                      </View>
                      <View style={styles.partnerStatItem}>
                        <Text style={styles.partnerStatValue}>
                          {partner.carbonSaved.toFixed(1)}kg
                        </Text>
                        <Text style={styles.partnerStatLabel}>CO₂ Saved</Text>
                      </View>
                      <View style={styles.partnerStatItem}>
                        <Text style={styles.partnerStatValue}>{partner.points}</Text>
                        <Text style={styles.partnerStatLabel}>Points</Text>
                      </View>
                    </View>

                    <View style={styles.partnerActions}>
                      <TouchableOpacity style={styles.partnerActionButton}>
                        <MaterialIcons name="message" size={16} color="#4A80F0" />
                        <Text style={styles.partnerActionText}>Message</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.partnerActionButton}>
                        <MaterialIcons name="call" size={16} color="#4A80F0" />
                        <Text style={styles.partnerActionText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.partnerActionButton}>
                        <MaterialIcons name="directions" size={16} color="#4A80F0" />
                        <Text style={styles.partnerActionText}>Track</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        <View style={styles.carbonContainer}>
          <Text style={styles.sectionTitle}>Carbon Footprint Savings</Text>
          <Card style={styles.carbonCard}>
            <View style={styles.carbonHeader}>
              <Text style={styles.carbonTitle}>Total CO₂ Saved This Month</Text>
              <Text style={styles.carbonValue}>{totalCarbonSaved.toFixed(1)}kg</Text>
            </View>
            <View style={styles.carbonProgress}>
              <View style={styles.carbonProgressBar}>
                <View
                  style={[
                    styles.carbonProgressFill,
                    { width: `${Math.min((totalCarbonSaved / 50) * 100, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.carbonProgressText}>
                {Math.min((totalCarbonSaved / 50) * 100, 100).toFixed(0)}% of monthly goal (50kg)
              </Text>
            </View>
            <View style={styles.carbonBenefits}>
              <View style={styles.carbonBenefit}>
                <MaterialIcons name="eco" size={24} color="#10b981" />
                <Text style={styles.carbonBenefitText}>
                  Equivalent to planting {Math.floor(totalCarbonSaved / 2)} trees
                </Text>
              </View>
              <View style={styles.carbonBenefit}>
                <MaterialIcons name="directions-car" size={24} color="#10b981" />
                <Text style={styles.carbonBenefitText}>
                  Saved {Math.floor(totalCarbonSaved * 4)} km of car emissions
                </Text>
              </View>
            </View>
          </Card>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  statsCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  mapContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  mapCard: {
    padding: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
  },
  mapFilters: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#f1f5f9',
  },
  filterButtonActive: {
    backgroundColor: '#e0e7ff',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#4A80F0',
    fontWeight: '500',
  },
  partnersContainer: {
    marginBottom: 15,
  },
  partnerCard: {
    marginBottom: 10,
    padding: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  partnerCardSelected: {
    borderWidth: 1,
    borderColor: '#4A80F0',
  },
  partnerCardContent: {
    padding: 15,
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  partnerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerVehicle: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 8,
  },
  partnerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerRatingText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 2,
  },
  partnerStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
  },
  statusInactive: {
    backgroundColor: '#fee2e2',
  },
  partnerStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusActiveText: {
    color: '#166534',
  },
  statusInactiveText: {
    color: '#b91c1c',
  },
  partnerExpandedContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  partnerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  partnerStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  partnerStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  partnerStatLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  partnerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  partnerActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  partnerActionText: {
    fontSize: 12,
    color: '#4A80F0',
    marginLeft: 4,
  },
  carbonContainer: {
    marginBottom: 30,
  },
  carbonCard: {
    padding: 15,
    borderRadius: 12,
  },
  carbonHeader: {
    marginBottom: 15,
  },
  carbonTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  carbonValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  carbonProgress: {
    marginBottom: 15,
  },
  carbonProgressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  carbonProgressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  carbonProgressText: {
    fontSize: 12,
    color: '#64748b',
  },
  carbonBenefits: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
  },
  carbonBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  carbonBenefitText: {
    fontSize: 14,
    color: '#1e293b',
    marginLeft: 8,
  },
});