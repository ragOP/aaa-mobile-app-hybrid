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
import {getMyProfile} from '../../store/api';
import ScreenWrapper from '../../wrapper/ScreenWrapper';

const {width, height} = Dimensions.get('window');

const ProfileScreen = () => {
  const [customer, setCustomer] = useState(null);
  const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsFetchingCustomer(true);
        const data = await getMyProfile();
        setCustomer(data.data.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsFetchingCustomer(false);
      }
    };

    fetchCustomerData();
  }, []);

  return (
    <ScreenWrapper contentContainerStyle={styles.scrollContent}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
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
                value={customer?.userName || ''}
                editable={false}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={customer?.email || ''}
                editable={false}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                value={customer?.name || ''}
                editable={false}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Address:</Text>
              <TextInput
                style={styles.input}
                value={customer?.address || ''}
                editable={false}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>GST:</Text>
              <TextInput
                style={styles.input}
                value={customer?.gst || ''}
                editable={false}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Contact Person:</Text>
              <TextInput
                style={styles.input}
                value={customer?.contactPerson || ''}
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
    marginBottom: height * 0.02,
  },
  field: {
    marginBottom: height * 0.015,
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
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
});

export default ProfileScreen;
