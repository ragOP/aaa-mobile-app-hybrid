import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

const EngineerProfileScreen = () => {
  const [engineer, setEngineer] = useState(null);
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);

  const getEngineerDetail = async () => {
    return JSON.parse(await AsyncStorage.getItem('aaa_user'));
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsFetchingCustomer(true);
        const data = await getEngineerDetail();
        setEngineer(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsFetchingCustomer(false);
      }
    };

    fetchCustomerData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Profile</Text>
      {isFetchingCustomer ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <>
          <View style={styles.field}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              value={engineer?.userName || ''}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={engineer?.email || ''}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={engineer?.name || ''}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Phone number:</Text>
            <TextInput
              style={styles.input}
              value={engineer?.phoneNumber || '-'}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Employee Id:</Text>
            <TextInput
              style={styles.input}
              value={engineer?.employeeId || ''}
              editable={false}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
});

export default EngineerProfileScreen;
