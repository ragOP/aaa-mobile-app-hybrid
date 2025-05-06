import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import Swiper from 'react-native-swiper';
import PaperText from '../../ui/PaperText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAllJobsApi} from '../../store/api';
const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const [jobs, setJobs] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isFetchingJobs, setIsFetchingJobs] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('aaa_user');
    await AsyncStorage.removeItem('aaa_user_type');
    await AsyncStorage.removeItem('aaa_token');
    navigation.replace('AuthNavigation');
  };

  const getUserDetails = async () => {
    return JSON.parse(await AsyncStorage.getItem('aaa_user'));
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);

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
  }, [refresh]);

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

      <ScrollView
        style={styles.assignedJobSection}
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }>
        <View style={styles.assignedJobCard}>
          <View style={styles.assignedJobHeader}>
            <Text style={styles.assignedJobTitle}>Assigned Jobs</Text>
            <View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('AllJobScreen')}>
                <Text style={styles.viewMore}>View More</Text>
              </TouchableOpacity>
            </View>
          </View>

          {jobs?.length === 0 && isFetchingJobs && (
            <View style={styles.activityIndicatorStyles}>
              <ActivityIndicator size="large" />
            </View>
          )}

          {jobs && (
            <Swiper showsPagination={true} autoplay={true} loop={true}>
              {jobs.map((job, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1}
                  style={styles.jobsContent}
                  onPress={() => navigation.navigate('JobDetailScreen', {job})}>
                  <Text style={styles.panelType}>{job?.projectName}</Text>
                  <View style={styles.tokenStatusRow}>
                    <Text style={styles.tokenText}>
                      Job Code:{' '}
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
      </ScrollView>

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
    padding: width * 0.04,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.1,
    resizeMode: 'contain',
  },
  userInfo: {
    alignItems: 'center',
    paddingRight: width * 0.03,
  },
  profileImage: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    marginBottom: height * 0.01,
  },
  assignedJobSection: {
  },
  userName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userPhone: {
    color: '#FFFFFF',
    paddingRight: width * 0.02,
  },
  assignedJobCard: {
    backgroundColor: '#fff',
    margin: width * 0.03,
    borderRadius: width * 0.025,
    padding: width * 0.04,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: height * 0.005},
    shadowOpacity: 0.1,
    shadowRadius: width * 0.03,
    elevation: 5,
    height: height * 0.33,
  },
  assignedJobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  assignedJobTitle: {
    fontSize: width * 0.055,
    fontWeight: '700',
    color: '#404969',
  },
  viewMore: {
    fontSize: width * 0.04,
    fontWeight: '700',
    color: '#404969',
  },
  jobsContent: {
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: height * 0.005},
    shadowOpacity: 0.1,
    shadowRadius: width * 0.03,
    elevation: 8,
    padding: width * 0.03,
    margin: width * 0.01,
    height: height * 0.22,
  },
  panelType: {
    color: '#f02b2b',
    fontSize: width * 0.04,
    fontWeight: '700',
    marginBottom: height * 0.01,
  },
  tokenStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  tokenText: {
    fontSize: width * 0.04,
    color: '#404969',
    fontWeight: '700',
  },
  tokenNumber: {
    color: '#4285F4',
  },
  status: {
    fontSize: width * 0.035,
    color: '#404969',
    fontWeight: '700',
  },
  ongoing: {
    color: 'orange',
  },
  detailText: {
    fontSize: width * 0.035,
    color: '#404969',
    fontWeight: '700',
    marginVertical: height * 0.01,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.05,
  },
  gridItem: {
    width: '46%',
    height: height * 0.2,
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: height * 0.005},
    shadowOpacity: 0.1,
    shadowRadius: width * 0.03,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridImage: {
    width: '30%',
    height: '30%',
    borderRadius: width * 0.02,
    resizeMode: 'contain',
  },
  gridText: {
    color: 'black',
    fontWeight: '500',
    fontSize: width * 0.035,
    marginTop: height * 0.01,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    padding: width * 0.05,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: height * 0.015,
    borderRadius: width * 0.02,
    width: '100%',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: height * 0.015,
    borderRadius: width * 0.02,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    color: '#404969',
    fontWeight: 'bold',
  },
  activityIndicatorStyles: {
    marginTop: height * 0.08,
  },
});

export default HomeScreen;
