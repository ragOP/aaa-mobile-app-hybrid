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
} from 'react-native';
import addIcon from '../../assets/icons/+.png';
import phoneIcon from '../../assets/icons/Call.png';
import warningIcon from '../../assets/icons/Priority.png';
import checkCircleIcon from '../../assets/icons/Checkmark.png';
import {getComplaintsApi, raisePrority} from '../../store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

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
                  complaint?.activity === 'Pending'
                    ? styles.statusBarSectionComplete
                    : styles.statusBarSectionIncomplete
                }
              />
              <View
                style={
                  complaint?.activity === 'Ongoing'
                    ? styles.statusBarSectionComplete
                    : styles.statusBarSectionIncomplete
                }
              />
              <View
                style={
                  complaint?.activity === 'Ongoing'
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FD',
    paddingHorizontal: 20,
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
  noDataText: {
    fontSize: 18,
    color: '#4f4f4f',
    textAlign: 'center',
    marginTop: 20,
  },
  activityIndicatorStyles: {
    marginTop: 160,
  },
});

export default ComplaintScreen;
