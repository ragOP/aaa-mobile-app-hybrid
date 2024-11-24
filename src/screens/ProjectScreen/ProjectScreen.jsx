import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView ,Image} from 'react-native';
import warrantyImage from '../..//assets/icons/Settings.png'; 
import amcImage from '../../assets/icons/doc.png'; 
const ProjectCard = ({ projectName, panels, activity, location, warrantyStatus, amcStatus }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.projectName}>Project Name :</Text>
        <TouchableOpacity>
          <Text style={styles.viewMore}>View More</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailTextRow}>
  <Text style={styles.panelText}>No. Of Panels: {panels}</Text>
  <Text style={[styles.label, styles.activityText]}>
    Activity: <Text style={[styles.status, activity === 'Ongoing' ? styles.ongoing : styles.delivered]}>{activity}</Text>
  </Text>
</View>

      <Text style={styles.detailText}>Site Location: {location}</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.statusContainer}>
        <View style={styles.statusBox}>
        <Image source={warrantyImage} style={styles.statusImage} />
        <Text style={styles.statusTitle}>Warranty</Text>
          <Text style={styles.statusText}>{warrantyStatus}</Text>
        </View>
        <View style={styles.statusBox}>
        <Image source={amcImage} style={styles.statusImage} />
        <Text style={styles.statusTitle}>AMC</Text>
          <Text style={styles.statusText}>{amcStatus}</Text>
        </View>
      </View>
    </View>
  );
};

const ProjectScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.screenTitle}>My Projects</Text>
      <ProjectCard
        projectName="Project 1"
        panels="50"
        activity="Ongoing"
        location="Location A"
        warrantyStatus="Active: 81 days left"
        amcStatus="Not Applicable"
      />
      <ProjectCard
        projectName="Project 2"
        panels="100"
        activity="Delivered"
        location="Location B"
        warrantyStatus="Expired"
        amcStatus="Not Applicable"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F3F6FC',
    flexGrow: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D64541',
  },
  viewMore: {
    color: 'black',
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: 'black',
    marginVertical: 3,
  },
  status: {
    fontWeight: 'bold',
  },
  ongoing: {
    color: '#4CAF50',
  },
  delivered: {
    color: '#6D6D6D',
  },
  divider: {
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,

  },
  

  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statusBox: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    width: '40%',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 4,
    borderBottomEndRadius:12,
borderBottomStartRadius:12
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#555',
    marginTop: 3,
  },
  statusImage: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  detailTextRow: {
    flexDirection: 'row', // Makes the text appear in a row
    fontSize: 14,
    color: 'red',
    marginVertical: 3,
    justifyContent:'space-between',
  },
  panelText: {
    color:"black"
  }
});

export default ProjectScreen;
