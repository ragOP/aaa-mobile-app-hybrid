import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import ScreenWrapper from '../../wrapper/ScreenWrapper';
const {width, height} = Dimensions.get('window');

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
    <ScreenWrapper>
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
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: width * 0.05,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: height * 0.03,
  },
  field: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: height * 0.01,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: '#DDD',
    padding: width * 0.03,
    fontSize: width * 0.04,
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.25,
  },
});

export default EngineerProfileScreen;
