import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Swiper from 'react-native-swiper';
import PaperText from '../../ui/PaperText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAllJobsApi, getComplaintsApi} from '../../store/api';

const HomeScreen = ({navigation}) => {
  const [jobs, setJobs] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isFetchingJobs, setIsFetchingJobs] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('aaa_user');
    await AsyncStorage.removeItem('aaa_user_type');
    await AsyncStorage.removeItem('aaa_token');
    navigation.replace('AuthNavigation');
  };

  const getUserDetails = async () => {
    return JSON.parse(await AsyncStorage.getItem('aaa_user'));
  };

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setIsFetchingJobs(true);
        const data = await getUserDetails();
        setUserDetails(data);

        const response = await getAllJobsApi(data._id);
        setJobs(response?.data?.data?.user);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsFetchingJobs(false);
      }
    };
    fetchAllJobs();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logobg.png')}
          style={styles.logo}
        />
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.userInfo}>
          <Image
            source={require('../../assets/images/avatar.png')}
            style={styles.profileImage}
          />
          <PaperText
            text={userDetails?.userName || ''}
            variant="titleSmall"
            fontStyling={styles.userName}
          />
          <PaperText
            text={userDetails?.phoneNumber || '-'}
            variant="titleSmall"
            fontStyling={styles.userPhone}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.assignedJobSection}>
        <View style={styles.assignedJobCard}>
          <View style={styles.assignedJobHeader}>
            <Text style={styles.assignedJobTitle}>Assigned Jobs</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('AllJobScreen')}>
              <Text style={styles.viewMore}>View More</Text>
            </TouchableOpacity>
          </View>

          {jobs?.length === 0 && isFetchingJobs && (
            <View style={styles.activityIndicatorStyles}>
              <ActivityIndicator size="large" />
            </View>
          )}

          {jobs && (
            <Swiper showsPagination={false} autoplay={false} loop={false}>
              {jobs.map((job, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1}
                  style={styles.jobsContent}
                  onPress={() => navigation.navigate('JobDetailScreen', {job})}>
                  <Text style={styles.panelType}>{job?.projectName}</Text>
                  <View style={styles.tokenStatusRow}>
                    <Text style={styles.tokenText}>
                      Token No.{' '}
                      <Text style={styles.tokenNumber}>
                        {job?.statusCode || '-'}
                      </Text>
                    </Text>
                    <Text style={styles.status}>
                      Status:{' '}
                      <Text
                        style={[
                          styles.ongoing,
                          job.activity === 'Closed' ? {color: 'red'} : {},
                        ]}>
                        {job?.activity}
                      </Text>
                    </Text>
                  </View>
                  <Text style={styles.detailText}>
                    {job?.projectName || ''}
                  </Text>
                  <Text style={styles.detailText}>
                    {job?.siteLocation || ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </Swiper>
          )}
        </View>
      </View>

      {/* <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} activeOpacity={1}>
          <Image source={phoneIcon} style={styles.gridImage} />
          <Text style={styles.gridText}>Call Support</Text>
        </TouchableOpacity>
        <View style={styles.gridItem}>
          <Image source={checkCircleIcon} style={styles.gridImage} />
          <Text style={styles.gridText}>Warranty & AMC</Text>
        </View>
        <View style={styles.gridItem} />
        <View style={styles.gridItem} />
      </View> */}

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile Options</Text>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF0000',
  },
  logo: {
    width: 220,
    height: 160,
    resizeMode: 'contain',
  },
  userInfo: {
    alignItems: 'center',
    paddingRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  userName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userPhone: {
    color: '#FFFFFF',
    paddingRight: 4,
  },
  assignedJobSection: {
    // backgroundColor: 'red',
  },

  assignedJobCard: {
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    height: 260,
  },

  assignedJobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  assignedJobTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#404969',
  },
  viewMore: {
    fontSize: 15,
    fontWeight: '700',
    color: '#404969',
  },
  jobsContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    padding: 10,
    margin: 4,
    height: 170,
  },
  panelType: {
    color: '#f02b2b',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  tokenStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tokenText: {
    fontSize: 16,
    color: '#404969',
    fontWeight: '700',
  },
  tokenNumber: {
    color: '#4285F4',
  },
  status: {
    fontSize: 14,
    color: '#404969',
    fontWeight: '700',
  },
  ongoing: {
    color: 'orange',
  },
  detailText: {
    fontSize: 14,
    color: '#404969',
    fontWeight: '700',
    marginVertical: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: '5%',
  },
  gridItem: {
    width: '46%',
    height: 150,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridImage: {
    width: '30%', // Adjust to fit the grid item width
    height: '30%', // Adjust to fit the grid item height
    borderRadius: 8, // Optional: rounds the image corners
    resizeMode: 'fit', // Ensures the image covers the grid item area
  },
  gridText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#404969',
    fontWeight: 'bold',
  },
  activityIndicatorStyles: {
    marginTop: 60,
  },
});

export default HomeScreen;
