import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import addIcon from '../../assets/icons/+.png';
import phoneIcon from '../../assets/icons/Call.png';
import warningIcon from '../../assets/icons/Priority.png';
import checkCircleIcon from '../../assets/icons/Checkmark.png';
import {getComplaintsApi, raisePrority} from '../../store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import ScreenWrapper from '../../wrapper/ScreenWrapper';
const {width, height} = Dimensions.get('window');

const ComplaintScreen = ({route, navigation}) => {
  const [complaints, setComplaints] = useState([]);
  const [fetchingComplaints, setFetchingComplaints] = useState([]);

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
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setFetchingComplaints(true);
          const user = await getUserDetails();
          if (user?._id) {
            const response = await getComplaintsApi(user._id);
            setComplaints(response.data.data.data);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setFetchingComplaints(false);
        }
      };
      fetchData();
    }, []),
  );

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Your Complaints</Text>

        {/* New Complaint Button */}
        <View style={styles.newComplaintButton}>
          <Text style={styles.newComplaintText}>New Complaint</Text>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={() => navigation.navigate('NewComplaintScreen')}>
            <Image source={addIcon} style={styles.plusIcon} />
          </TouchableOpacity>
        </View>

        {/* Conditionally render the complaint card if data is available */}
        {fetchingComplaints ? (
          <View style={styles.activityIndicatorStyles}>
            <ActivityIndicator size="large" />
          </View>
        ) : complaints && complaints?.length > 0 ? (
          complaints.map((complaint, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.panelText}>{complaint?.projectName}</Text>
                <Text
                  style={styles.viewMoreText}
                  onPress={() =>
                    navigation.navigate('ComplainDetailScreen', {complaint})
                  }>
                  View More
                </Text>
              </View>

              {/* <View style={styles.infoRow}> */}
              <Text style={styles.labelText}>
                Project Name: {complaint?.projectName || '-'}
              </Text>
              <View style={styles.row}>
                <Text style={styles.labelText}>Activity: </Text>
                <Text style={styles.statusCode}>
                  {' '}
                  {complaint?.activity || '-'}
                </Text>
              </View>
              {/* </View> */}

              <Text style={styles.labelText}>
                Site Location: {complaint?.siteLocation || '-'}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.statusText}>
                <Text style={styles.labelText}>Current Status: </Text>
                <Text style={styles.statusCode}>
                  {complaint?.activity || '-'}
                </Text>
                {complaint.statusCode && (
                  <Text style={styles.statusCode}>
                    {' '}
                    : {complaint?.statusCode || '-'}
                  </Text>
                )}
              </Text>

              {/* Status Bar */}
              <View style={styles.statusBar}>
                <View
                  style={
                    complaint?.activity === 'Pending' ||
                    complaint?.activity === 'Ongoing' ||
                    complaint?.activity === 'Closed'
                      ? styles.statusBarSectionComplete
                      : styles.statusBarSectionIncomplete
                  }
                />
                <View
                  style={
                    complaint?.activity === 'Ongoing' ||
                    complaint?.activity === 'Closed'
                      ? styles.statusBarSectionComplete
                      : styles.statusBarSectionIncomplete
                  }
                />
                <View
                  style={
                    complaint?.activity === 'Ongoing' ||
                    complaint?.activity === 'Closed'
                      ? styles.statusBarSectionComplete
                      : styles.statusBarSectionIncomplete
                  }
                />
                <View
                  style={
                    complaint?.activity === 'Closed'
                      ? styles.statusBarSectionComplete
                      : styles.statusBarSectionIncomplete
                  }
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    handleCallTechnician(complaint?.technician?.phoneNumber)
                  }>
                  <Image source={phoneIcon} style={styles.actionIcon} />
                  <Text style={styles.actionButtonText}>Call Technician</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRaisePriority(complaint._id)}>
                  <Image source={warningIcon} style={styles.actionIcon} />
                  <Text style={styles.actionButtonText}>Raise Priority</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Image source={checkCircleIcon} style={styles.actionIcon} />
                  <Text style={styles.actionButtonText}>Mark Complete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No complaint data available</Text>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FD',
    paddingHorizontal: width * 0.05, // Dynamic horizontal padding
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginVertical: height * 0.02, // Dynamic vertical margin
  },
  newComplaintButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: width * 0.05,
    padding: width * 0.03,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: height * 0.005},
    shadowOpacity: 0.8,
    shadowRadius: width * 0.03,
    elevation: 5,
  },
  newComplaintText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: width * 0.05,
  },
  plusButton: {
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: width * 0.04,
    padding: height * 0.015,
    width: width * 0.25,
    height: height * 0.06,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: height * 0.005},
    shadowOpacity: 0.8,
    shadowRadius: width * 0.03,
    elevation: 5,
  },
  plusIcon: {
    width: width * 0.055,
    height: width * 0.055,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    padding: width * 0.04,
    marginVertical: height * 0.01,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: height * 0.005},
    shadowRadius: width * 0.03,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelText: {
    fontSize: width * 0.045,
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
    marginVertical: height * 0.005,
  },
  row: {
    flexDirection: 'row',
  },
  labelText: {
    fontSize: width * 0.035,
    color: '#3a3a3a',
  },
  ongoingText: {
    color: 'green',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#d3d3d3',
    marginVertical: height * 0.01,
  },
  statusText: {
    fontSize: width * 0.035,
    marginVertical: height * 0.01,
  },
  statusCode: {
    color: '#FF8400',
    fontWeight: 'bold',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: height * 0.01,
  },
  statusBarSectionComplete: {
    flex: 1,
    height: height * 0.007,
    backgroundColor: 'green',
    marginHorizontal: width * 0.005,
    borderRadius: width * 0.02,
  },
  statusBarSectionIncomplete: {
    flex: 1,
    height: height * 0.007,
    backgroundColor: '#d3d3d3',
    marginHorizontal: width * 0.005,
    borderRadius: width * 0.02,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.02,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: height * 0.012,
    borderRadius: width * 0.06,
    width: width * 0.25,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: height * 0.005},
    shadowRadius: width * 0.03,
    elevation: 3,
  },
  actionButtonText: {
    marginLeft: width * 0.012,
    color: '#4f4f4f',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: width * 0.03,
    marginTop: height * 0.008,
  },
  actionIcon: {
    width: width * 0.055,
    height: width * 0.055,
  },
  noDataText: {
    fontSize: width * 0.045,
    color: '#4f4f4f',
    textAlign: 'center',
    marginTop: height * 0.025,
  },
  activityIndicatorStyles: {
    marginTop: height * 0.2,
  },
});

export default ComplaintScreen;
