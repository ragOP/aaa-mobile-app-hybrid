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
      ) : jobs.length > 0 ? (
        jobs.map((job, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            style={styles.jobsContent}
            onPress={() => navigation.navigate('JobDetailScreen', {job})}>
            <Text style={styles.panelType}>{job?.projectName}</Text>
            <View style={styles.tokenStatusRow}>
              <Text style={styles.tokenText}>
                Token No.{' '}
                <Text style={styles.tokenNumber}>{job?.statusCode || '-'}</Text>
              </Text>
              <Text style={styles.status}>
                Status:
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
    paddingHorizontal: 20,
  },
  repairText: {
    color: '#FF0000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginVertical: 20,
  },
  newComplaintButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  newComplaintText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
  },
  plusButton: {
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 15,
    padding: 14,
    width: 100,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  plusIcon: {
    width: 22,
    height: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0000',
  },
  viewMoreText: {
    color: '#4f4f4f',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  row: {
    flexDirection: 'row',
  },
  labelText: {
    fontSize: 14,
    color: '#3a3a3a',
  },
  ongoingText: {
    color: 'green',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#d3d3d3',
    marginVertical: 10,
  },
  statusText: {
    fontSize: 14,
    marginVertical: 10,
  },
  statusCode: {
    color: '#FF8400',
    fontWeight: 'bold',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  statusBarSectionComplete: {
    flex: 1,
    height: 6,
    backgroundColor: 'green',
    marginHorizontal: 2,
    borderRadius: 3,
  },
  statusBarSectionIncomplete: {
    flex: 1,
    height: 6,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 2,
    borderRadius: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    width: '31%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
  },
  actionButtonText: {
    marginLeft: 5,
    color: '#4f4f4f',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 6,
  },
  actionIcon: {
    width: 22,
    height: 22,
  },
  noDataContainer: {
    flex: 1,
    minHeight: '100%',
    alignItems: 'center',
    marginTop: '70%',
  },
  noDataText: {
    fontSize: 18,
    color: '#4f4f4f',
    textAlign: 'center',
    marginTop: 20,
  },
  activityIndicatorStyles: {
    marginTop: 160,
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
});

export default AllJobsScreen;
