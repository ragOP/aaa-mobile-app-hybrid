import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

// Import your local images here
import addIcon from '../../assets/icons/+.png'; 
import phoneIcon from '../../assets/icons/call.png'; 
import warningIcon from '../../assets/icons/Priority.png'; 
import checkCircleIcon from '../../assets/icons/Checkmark.png'; 

const ComplaintScreen = ({ route, navigation }) => {
  const { 
    projectName = "", 
    siteLocation = "" 
  } = route.params || {};

  // Conditional check for rendering complaint card
  const showComplaintCard = projectName && siteLocation; // Checks if both projectName and siteLocation are present

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Your Complaints</Text>

      {/* New Complaint Button */}
      <View style={styles.newComplaintButton}>
        <Text style={styles.newComplaintText}>New Complaint</Text>
        <TouchableOpacity style={styles.plusButton} onPress={() => navigation.navigate('NewComplaintScreen')}>
          <Image source={addIcon} style={styles.plusIcon} />
        </TouchableOpacity>
      </View>

      {/* Conditionally render the complaint card if data is available */}
      {showComplaintCard ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.panelText}>APFC Panel</Text>
            <Text style={styles.viewMoreText}>View More</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Project Name: {projectName}</Text>
            <Text style={styles.labelText}>Activity: <Text style={styles.ongoingText}>Ongoing</Text></Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.labelText}>Site Location: {siteLocation}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.statusText}>
            Current Status: <Text style={styles.statusCode}>On Site : Code 6210</Text>
          </Text>

          {/* Status Bar */}
          <View style={styles.statusBar}>
            <View style={styles.statusBarSectionComplete} />
            <View style={styles.statusBarSectionComplete} />
            <View style={styles.statusBarSectionComplete} />
            <View style={styles.statusBarSectionIncomplete} />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Image source={phoneIcon} style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>Call Technician</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Image source={warningIcon} style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>Raise Priority</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Image source={checkCircleIcon} style={styles.actionIcon} />
              <Text style={styles.actionButtonText}>Mark Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.noDataText}>No complaint data available</Text> // Optionally display a message if no data
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
  labelText: {
    fontSize: 16,
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
    fontSize: 16,
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
    shadowOffset: { width: 0, height: 2 },
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
});

export default ComplaintScreen;
