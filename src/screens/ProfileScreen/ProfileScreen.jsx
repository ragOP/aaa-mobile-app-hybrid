import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet, ScrollView} from 'react-native';
import {getMyProfile} from '../../store/api';

const ProfileScreen = () => {
  const [customer, setCustomer] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const data = await getMyProfile();
        setCustomer(data.data.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCustomerData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Profile</Text>
      {customer && (
        <>
          <View style={styles.field}>
            <Text style={styles.label}>Username:</Text>
            <TextInput
              style={styles.input}
              value={customer.userName}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={customer.email}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={customer.name}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Address:</Text>
            <TextInput
              style={styles.input}
              value={customer.address}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>GST:</Text>
            <TextInput
              style={styles.input}
              value={customer.gst}
              editable={false}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Contact Person:</Text>
            <TextInput
              style={styles.input}
              value={customer.contactPerson}
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
});

export default ProfileScreen;
