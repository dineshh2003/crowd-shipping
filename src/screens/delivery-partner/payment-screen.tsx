import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '../../components/Card';

// Mock transaction data
const mockTransactions = [
  {
    id: '1',
    type: 'earning',
    description: 'Order #1001 Completed',
    amount: 24.50,
    date: 'Mar 15, 2023',
  },
  {
    id: '2',
    type: 'withdrawal',
    description: 'Withdrawal to Bank',
    amount: -50.00,
    date: 'Mar 12, 2023',
  },
  {
    id: '3',
    type: 'earning',
    description: 'Order #1002 Completed',
    amount: 18.75,
    date: 'Mar 10, 2023',
  },
  {
    id: '4',
    type: 'earning',
    description: 'Order #1003 Completed',
    amount: 32.00,
    date: 'Mar 5, 2023',
  },
  {
    id: '5',
    type: 'withdrawal',
    description: 'Withdrawal to Bank',
    amount: -70.00,
    date: 'Mar 1, 2023',
  },
];

export default function PaymentScreen() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
  const [filterType, setFilterType] = useState<'all' | 'earnings' | 'withdrawals'>('all');

  const availableBalance = 125.25;

  const filteredTransactions = mockTransactions.filter(transaction => {
    if (filterType === 'all') return true;
    if (filterType === 'earnings') return transaction.type === 'earning';
    if (filterType === 'withdrawals') return transaction.type === 'withdrawal';
    return true;
  });

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amount > availableBalance) {
      Alert.alert('Error', 'Withdrawal amount exceeds available balance');
      return;
    }

    Alert.alert(
      'Confirm Withdrawal',
      `Are you sure you want to withdraw $${amount.toFixed(2)}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Withdraw',
          onPress: () => {
            // Here you would process the withdrawal
            Alert.alert('Success', `$${amount.toFixed(2)} withdrawal initiated!`);
            setWithdrawAmount('');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${availableBalance.toFixed(2)}</Text>
          <View style={styles.withdrawalForm}>
            <Text style={styles.withdrawalLabel}>Withdraw Funds</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="attach-money" size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.withdrawalLabel}>Payment Method</Text>
            <View style={styles.paymentMethodsContainer}>
              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'bank' && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setSelectedPaymentMethod('bank')}
              >
                <MaterialIcons
                  name="account-balance"
                  size={20}
                  color={selectedPaymentMethod === 'bank' ? '#4A80F0' : '#64748b'}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === 'bank' && styles.paymentMethodTextActive,
                  ]}
                >
                  Bank Account
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'card' && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setSelectedPaymentMethod('card')}
              >
                <MaterialIcons
                  name="credit-card"
                  size={20}
                  color={selectedPaymentMethod === 'card' ? '#4A80F0' : '#64748b'}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === 'card' && styles.paymentMethodTextActive,
                  ]}
                >
                  Debit Card
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethodButton,
                  selectedPaymentMethod === 'paypal' && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setSelectedPaymentMethod('paypal')}
              >
                <MaterialIcons
                  name="payment"
                  size={20}
                  color={selectedPaymentMethod === 'paypal' ? '#4A80F0' : '#64748b'}
                />
                <Text
                  style={[
                    styles.paymentMethodText,
                    selectedPaymentMethod === 'paypal' && styles.paymentMethodTextActive,
                  ]}
                >
                  PayPal
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.withdrawButton}
              onPress={handleWithdraw}
            >
              <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <View style={styles.transactionFilters}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => setFilterType('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'all' && styles.filterButtonTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === 'earnings' && styles.filterButtonActive,
              ]}
              onPress={() => setFilterType('earnings')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'earnings' && styles.filterButtonTextActive,
                ]}
              >
                Earnings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === 'withdrawals' && styles.filterButtonActive,
              ]}
              onPress={() => setFilterType('withdrawals')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterType === 'withdrawals' && styles.filterButtonTextActive,
                ]}
              >
                Withdrawals
              </Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.transactionsCard}>
            {filteredTransactions.map(transaction => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIconContainer}>
                  <MaterialIcons
                    name={transaction.type === 'earning' ? 'arrow-downward' : 'arrow-upward'}
                    size={20}
                    color={transaction.type === 'earning' ? '#10b981' : '#ef4444'}
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'earning'
                      ? styles.transactionEarning
                      : styles.transactionWithdrawal,
                  ]}
                >
                  {transaction.type === 'earning' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </Text>
              </View>
            ))}

            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Transactions</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#4A80F0" />
            </TouchableOpacity>
          </Card>
        </View>

        <Card style={styles.paymentMethodsCard}>
          <View style={styles.paymentMethodsHeader}>
            <Text style={styles.paymentMethodsTitle}>Payment Methods</Text>
            <TouchableOpacity style={styles.addPaymentMethodButton}>
              <MaterialIcons name="add" size={20} color="#4A80F0" />
              <Text style={styles.addPaymentMethodText}>Add New</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.savedPaymentMethod}>
            <View style={styles.savedPaymentMethodIcon}>
              <MaterialIcons name="credit-card" size={24} color="#4A80F0" />
            </View>
            <View style={styles.savedPaymentMethodDetails}>
              <Text style={styles.savedPaymentMethodTitle}>Visa ending in 4242</Text>
              <Text style={styles.savedPaymentMethodExpiry}>Expires 04/25</Text>
            </View>
            <TouchableOpacity style={styles.savedPaymentMethodAction}>
              <MaterialIcons name="more-vert" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View style={styles.savedPaymentMethod}>
            <View style={styles.savedPaymentMethodIcon}>
              <MaterialIcons name="account-balance" size={24} color="#4A80F0" />
            </View>
            <View style={styles.savedPaymentMethodDetails}>
              <Text style={styles.savedPaymentMethodTitle}>Bank Account</Text>
              <Text style={styles.savedPaymentMethodExpiry}>Chase ****6789</Text>
            </View>
            <TouchableOpacity style={styles.savedPaymentMethodAction}>
              <MaterialIcons name="more-vert" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
        </Card>
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
  balanceCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  balanceTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  withdrawalForm: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  withdrawalLabel: {
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
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  paymentMethodsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 4,
  },
  paymentMethodButtonActive: {
    backgroundColor: '#e0e7ff',
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  paymentMethodTextActive: {
    color: '#4A80F0',
    fontWeight: '500',
  },
  withdrawButton: {
    backgroundColor: '#4A80F0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionsContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  transactionFilters: {
    flexDirection: 'row',
    marginBottom: 10,
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
  transactionsCard: {
    padding: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#64748b',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionEarning: {
    color: '#10b981',
  },
  transactionWithdrawal: {
    color: '#ef4444',
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
  paymentMethodsCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  paymentMethodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  addPaymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPaymentMethodText: {
    fontSize: 14,
    color: '#4A80F0',
    marginLeft: 4,
  },
  savedPaymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  savedPaymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  savedPaymentMethodDetails: {
    flex: 1,
  },
  savedPaymentMethodTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 2,
  },
  savedPaymentMethodExpiry: {
    fontSize: 12,
    color: '#64748b',
  },
  savedPaymentMethodAction: {
    padding: 8,
  },
});