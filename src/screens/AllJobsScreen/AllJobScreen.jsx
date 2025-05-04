import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import phoneIcon from '../../assets/icons/Call.png';
import warningIcon from '../../assets/icons/Priority.png';
import checkCircleIcon from '../../assets/icons/Checkmark.png';
import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
import {getAllJobsApi, raisePrority} from '../../store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const AllJobsScreen = ({route, navigation}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUserDetails = async () => {
    return JSON.parse(await AsyncStorage.getItem('aaa_user'));
  };


  const handleCallTechnician = number => {
    if (number == null) return;
    const phoneNumber = `tel:+91-${number}`;
    Linking.openURL(phoneNumber).catch(err =>
      console.error('Failed to open dialer', err),
    );
  };

  const handleRaisePriority = async id => {
    try {
      const response = await raisePrority(id);
    } catch (error) {
      console.error('Failed to open dialer', error);
    }
  };


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          console.log(await AsyncStorage.getItem('token'))
          const user = await getUserDetails();
          if (user?._id) {
            const response = await getAllJobsApi(user._id);
            setJobs(response?.data?.data?.user);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []),
  );

  return (
    <ScrollView style={styles.container}>
      {/* Title */}

      <Text style={styles.title}>All Jobs</Text>

      {/* Conditionally render the job card if data is available */}
      {loading ? (
        <View style={styles.activityIndicatorStyles}>
          <ActivityIndicator size="large" />
        </View>
      ) : jobs && jobs.length > 0 ? (
        jobs.map((job, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            style={styles.jobsContent}
            onPress={() => navigation.navigate('JobDetailScreen', {job})}>
            <Text style={styles.panelType}>{job?.projectName}</Text>
            <View style={styles.tokenStatusRow}>
              {job.activity === 'Pending' && <Text style={styles.tokenText}>
                Job Code{' '}
                <Text style={styles.tokenNumber}>{job?.statusCode || '-'}</Text>
              </Text>}
              <Text style={styles.status}>
                Status:{" "}
                <Text
                  style={[
                    styles.ongoing,
                    job.activity === 'Closed' ? {color: 'red'} : {},
                  ]}>
                  {job?.activity}
                </Text>
              </Text>
            </View>
            <Text style={styles.detailText}>{job?.projectName || ''}</Text>
            <Text style={styles.detailText}>{job?.siteLocation || ''}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No jobs found</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FD',
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginVertical: height * 0.02,
  },
  jobsContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    padding: width * 0.04,
    margin: width * 0.02,
    height: height * 0.25,
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
    marginVertical: height * 0.005,
  },
  noDataContainer: {
    flex: 1,
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
  },
  noDataText: {
    fontSize: width * 0.045,
    color: '#4f4f4f',
    textAlign: 'center',
    marginTop: height * 0.02,
  },
  activityIndicatorStyles: {
    marginTop: height * 0.2,
  },
});

export default AllJobsScreen;
