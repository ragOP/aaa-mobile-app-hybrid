import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Swiper from 'react-native-swiper';
import PaperText from '../../ui/PaperText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getComplaintsApi} from '../../store/api';
import phoneIcon from '../../assets/icons/Call.png';
import checkCircleIcon from '../../assets/icons/Checkmark.png';
// import gridImage1 from '../../assets/icons/call.png';  // Replace with your image path
// import gridImage2 from '../../assets/icons/Settings.png'; // Replace with your image path
const HomeScreen = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const handleCallTechnician = number => {
    console.log('number: ' + number);
    if (number == null) return;
    const phoneNumber = `tel:+91-${number}`;
    Linking.openURL(phoneNumber).catch(err =>
      console.error('Failed to open dialer', err),
    );
  };

  const getUserDetails = async () => {
    return JSON.parse(await AsyncStorage.getItem('aaa_user'));
  };

  useEffect(() => {
    const fetchAllComplaints = async () => {
      try {
        const data = await getUserDetails();
        const response = await getComplaintsApi(data._id);
        console.log('challaaa');
        setComplaints(response.data.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAllComplaints();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logobg.png')}
          style={styles.logo}
        />
        <View style={styles.userInfo}>
          <Image
            source={require('../../assets/images/avatar.png')}
            style={styles.profileImage}
          />
          <PaperText
            text="Farish"
            variant="titleSmall"
            fontStyling={styles.userName}
          />
          <PaperText
            text="98989898"
            variant="titleSmall"
            fontStyling={styles.userPhone}
          />
        </View>
      </View>

      <View style={styles.complaintsSection}>
        <View style={styles.complaintsCard}>
          <View style={styles.complaintsHeader}>
            <Text style={styles.complaintsTitle}>Your Complaints</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('ViewMoreComplaints')}>
              <Text style={styles.viewMore}>View More</Text>
            </TouchableOpacity>
          </View>

          {complaints && (
            <Swiper showsPagination={false} autoplay={false} loop={false}>
              {complaints.map((complaint, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1}
                  style={styles.complaintsContent}
                  onPress={() =>
                    navigation.navigate('ComplainDetailScreen', {complaint})
                  }>
                  <Text style={styles.panelType}>APFC Panel</Text>
                  <View style={styles.tokenStatusRow}>
                    <Text style={styles.tokenText}>
                      Token No. <Text style={styles.tokenNumber}>88</Text>
                    </Text>
                    <Text style={styles.status}>
                      Status:
                      <Text
                        style={[
                          styles.ongoing,
                          complaint.activity === 'Closed' ? {color: 'red'} : {},
                        ]}>
                        {complaint.activity}
                      </Text>
                    </Text>
                  </View>
                  <Text style={styles.detailText}>{complaint.projectName}</Text>
                  <Text style={styles.detailText}>
                    {complaint.siteLocation}
                  </Text>
                </TouchableOpacity>
              ))}
            </Swiper>
          )}
        </View>
      </View>

      <View style={styles.grid}>
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
      </View>
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
  complaintsSection: {
    // backgroundColor: 'red',
  },

  complaintsCard: {
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

  complaintsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  complaintsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#404969',
  },
  viewMore: {
    fontSize: 15,
    fontWeight: '700',
    color: '#404969',
  },
  complaintsContent: {
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
});

export default HomeScreen;
