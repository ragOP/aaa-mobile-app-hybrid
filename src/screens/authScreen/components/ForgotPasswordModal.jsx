import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import toastFunction from '../../../functions/toastFunction';
import {
  customerForgetPassword,
  engineerForgetPassword,
} from '../../../store/api';

const ForgotPasswordModal = ({showModal, setShowModal, userType}) => {
  const [modalVisible, setModalVisible] = useState(showModal);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    // console.log(`Username: ${username}, Password: ${email}`);
    if (username.length === 0 || email.length === 0) {
      toastFunction('Fields Empty', 'Please enter both username and email');
      Alert.alert('Fields Empty', 'Please enter both username and email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toastFunction('Invalid Email', 'Please enter a valid email address');
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    try {
      const body = {userName: username, email: email};
      const response =
        userType === 'engineer'
          ? await engineerForgetPassword(body)
          : await customerForgetPassword(body);

      // console.log("response >>>>>", response.data);
      if (response?.data?.success) {
        toastFunction(
          'Request Sent Successfully!',
          'You will soon receive call from admin',
        );
        Alert.alert(
          'Request Sent Successfully!',
          'You will soon receive call from admin',
        );
      } else {
        toastFunction('Failed to send request!');
        Alert.alert(
          'Failed to send request!',
          'Please enter correct credentials',
        );
      }
    } catch (error) {
      console.error('ERROR', error);
      Alert.alert('Something Went Wrong', 'Please enter correct credentials');
      toastFunction('Something Went Wrong', 'Please enter correct credentials');
    } finally {
      setModalVisible(false);
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setShowModal(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleForgotPassword}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    border: 'none',
    paddingTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default ForgotPasswordModal;
