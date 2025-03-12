import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Card } from '../../components/Card';

type OrderFormData = {
  id: string;
  pickupLocation: string;
  deliveryLocation: string;
  size: 'small' | 'medium' | 'large';
  price: string;
  notes: string;
};

const initialOrderForm: OrderFormData = {
  id: '',
  pickupLocation: '',
  deliveryLocation: '',
  size: 'medium',
  price: '',
  notes: '',
};

export default function OrderAssignmentScreen() {
  const [bulkMode, setBulkMode] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderFormData>(initialOrderForm);
  const [bulkOrders, setBulkOrders] = useState<OrderFormData[]>([]);

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setOrderForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSizeChange = (size: 'small' | 'medium' | 'large') => {
    setOrderForm(prev => ({ ...prev, size }));
  };

  const handleAddOrder = () => {
    // Validate form
    if (!orderForm.pickupLocation || !orderForm.deliveryLocation || !orderForm.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (bulkMode) {
      // Add to bulk orders
      const newOrder = {
        ...orderForm,
        id: `temp-${Date.now()}`, // Temporary ID until saved to backend
      };
      setBulkOrders(prev => [...prev, newOrder]);
      setOrderForm(initialOrderForm); // Reset form
    } else {
      // Submit single order
      Alert.alert(
        'Confirm Order',
        'Are you sure you want to create this order?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Create',
            onPress: () => {
              // Here you would submit to your backend
              Alert.alert('Success', 'Order created successfully!');
              setOrderForm(initialOrderForm); // Reset form
            },
          },
        ]
      );
    }
  };

  const handleSubmitBulkOrders = () => {
    if (bulkOrders.length === 0) {
      Alert.alert('Error', 'No orders to submit');
      return;
    }

    Alert.alert(
      'Confirm Bulk Orders',
      `Are you sure you want to create ${bulkOrders.length} orders?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Create All',
          onPress: () => {
            // Here you would submit to your backend
            Alert.alert('Success', `${bulkOrders.length} orders created successfully!`);
            setBulkOrders([]); // Reset bulk orders
          },
        },
      ]
    );
  };

  const handleRemoveBulkOrder = (id: string) => {
    setBulkOrders(prev => prev.filter(order => order.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Assignment</Text>
        <View style={styles.bulkModeContainer}>
          <Text style={styles.bulkModeLabel}>Bulk Mode</Text>
          <Switch
            value={bulkMode}
            onValueChange={setBulkMode}
            trackColor={{ false: '#cbd5e1', true: '#bfdbfe' }}
            thumbColor={bulkMode ? '#4A80F0' : '#f4f4f5'}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>
            {bulkMode ? 'Add Multiple Orders' : 'Create New Order'}
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Pickup Location*</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="location-on" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter pickup address"
                value={orderForm.pickupLocation}
                onChangeText={(value) => handleInputChange('pickupLocation', value)}
              />
            </View>
            <TouchableOpacity style={styles.mapButton}>
              <MaterialIcons name="map" size={16} color="#4A80F0" />
              <Text style={styles.mapButtonText}>Select on Map</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Delivery Location*</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="location-on" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter delivery address"
                value={orderForm.deliveryLocation}
                onChangeText={(value) => handleInputChange('deliveryLocation', value)}
              />
            </View>
            <TouchableOpacity style={styles.mapButton}>
              <MaterialIcons name="map" size={16} color="#4A80F0" />
              <Text style={styles.mapButtonText}>Select on Map</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Package Size</Text>
            <View style={styles.sizeButtons}>
              <TouchableOpacity
                style={[
                  styles.sizeButton,
                  orderForm.size === 'small' && styles.sizeButtonActive,
                ]}
                onPress={() => handleSizeChange('small')}
              >
                <FontAwesome5
                  name="box"
                  size={16}
                  color={orderForm.size === 'small' ? '#4A80F0' : '#64748b'}
                />
                <Text
                  style={[
                    styles.sizeButtonText,
                    orderForm.size === 'small' && styles.sizeButtonTextActive,
                  ]}
                >
                  Small
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sizeButton,
                  orderForm.size === 'medium' && styles.sizeButtonActive,
                ]}
                onPress={() => handleSizeChange('medium')}
              >
                <FontAwesome5
                  name="box"
                  size={18}
                  color={orderForm.size === 'medium' ? '#4A80F0' : '#64748b'}
                />
                <Text
                  style={[
                    styles.sizeButtonText,
                    orderForm.size === 'medium' && styles.sizeButtonTextActive,
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sizeButton,
                  orderForm.size === 'large' && styles.sizeButtonActive,
                ]}
                onPress={() => handleSizeChange('large')}
              >
                <FontAwesome5
                  name="box"
                  size={20}
                  color={orderForm.size === 'large' ? '#4A80F0' : '#64748b'}
                />
                <Text
                  style={[
                    styles.sizeButtonText,
                    orderForm.size === 'large' && styles.sizeButtonTextActive,
                  ]}
                >
                  Large
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Price*</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="attach-money" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter price"
                value={orderForm.price}
                onChangeText={(value) => handleInputChange('price', value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Enter any special instructions"
                value={orderForm.notes}
                onChangeText={(value) => handleInputChange('notes', value)}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddOrder}>
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>
              {bulkMode ? 'Add to Bulk' : 'Create Order'}
            </Text>
          </TouchableOpacity>
        </Card>

        {bulkMode && bulkOrders.length > 0 && (
          <Card style={styles.bulkOrdersCard}>
            <View style={styles.bulkOrdersHeader}>
              <Text style={styles.bulkOrdersTitle}>Bulk Orders ({bulkOrders.length})</Text>
              <TouchableOpacity style={styles.submitBulkButton} onPress={handleSubmitBulkOrders}>
                <Text style={styles.submitBulkButtonText}>Submit All</Text>
              </TouchableOpacity>
            </View>

            {bulkOrders.map((order, index) => (
              <View key={order.id} style={styles.bulkOrderItem}>
                <View style={styles.bulkOrderInfo}>
                  <Text style={styles.bulkOrderNumber}>Order #{index + 1}</Text>
                  <Text style={styles.bulkOrderDetail}>
                    From: {order.pickupLocation}
                  </Text>
                  <Text style={styles.bulkOrderDetail}>
                    To: {order.deliveryLocation}
                  </Text>
                  <Text style={styles.bulkOrderDetail}>
                    Size: {order.size.charAt(0).toUpperCase() + order.size.slice(1)} | Price: ${order.price}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeBulkButton}
                  onPress={() => handleRemoveBulkOrder(order.id)}
                >
                  <MaterialIcons name="close" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </Card>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  bulkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulkModeLabel: {
    marginRight: 8,
    fontSize: 14,
    color: '#64748b',
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  formCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  mapButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#4A80F0',
  },
  sizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  sizeButtonActive: {
    backgroundColor: '#e0e7ff',
  },
  sizeButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748b',
  },
  sizeButtonTextActive: {
    color: '#4A80F0',
    fontWeight: '500',
  },
  textAreaContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  bulkOrdersCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  bulkOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  bulkOrdersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  submitBulkButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  submitBulkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  bulkOrderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  bulkOrderInfo: {
    flex: 1,
  },
  bulkOrderNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  bulkOrderDetail: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  removeBulkButton: {
    padding: 8,
  },
});