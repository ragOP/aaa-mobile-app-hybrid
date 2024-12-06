import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import warrantyImage from '../..//assets/icons/Settings.png';
import amcImage from '../../assets/icons/doc.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProjectsApi} from '../../store/api';
import {ActivityIndicator} from 'react-native-paper';
const ProjectCard = ({
  projectName,
  panels,
  activity,
  location,
  warrantyStatus,
  amcStatus,
  warrantyLink,
  amcLink,
}) => {
  const handleDownload = async type => {
    try {
      const url = type === 'warranty' ? warrantyLink : amcLink;

      const fileName = url.split('/').pop();
      if (!url) {
        Alert.alert('Error', 'Download link not available.');
        return;
      }

      const downloadPath = `${RNFS.ExternalDirectoryPath}/${fileName}`;

      // Start downloading the file
      const download = RNFS.downloadFile({
        fromUrl: url,
        toFile: downloadPath,
      });

      const result = await download.promise;

      if (result.statusCode === 200) {
        Alert.alert('Download Complete', `File saved to ${downloadPath}`);
      } else {
        Alert.alert(
          'Download Failed',
          'Something went wrong while downloading the file.',
        );
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', 'Failed to download the file.');
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.projectName}>{projectName || '-'}</Text>
        {/* <TouchableOpacity>
          <Text style={styles.viewMore}>View More</Text>
        </TouchableOpacity> */}
      </View>
      <View style={styles.detailTextRow}>
        <Text style={styles.panelText}>No. Of Panels: {panels}</Text>
        <Text style={[styles.label, styles.activityText]}>
          Activity:{' '}
          <Text
            style={[
              styles.status,
              activity === 'Ongoing' ? styles.ongoing : styles.delivered,
            ]}>
            {activity}
          </Text>
        </Text>
      </View>

      <Text style={styles.detailText}>Site Location: {location}</Text>

      <View style={styles.divider} />

      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={styles.statusBox}
          onPress={() => handleDownload('warranty')}>
          <Image source={warrantyImage} style={styles.statusImage} />
          <Text style={styles.statusTitle}>Warranty</Text>
          <Text style={styles.statusText}>{warrantyStatus}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statusBox}
          onPress={() => handleDownload('AMC')}>
          <Image source={amcImage} style={styles.statusImage} />
          <Text style={styles.statusTitle}>AMC</Text>
          <Text style={styles.statusText}>{amcStatus}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ProjectScreen = () => {
  const [projects, setProjects] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const getUserDetails = async () => {
    return JSON.parse(await AsyncStorage.getItem('aaa_user'));
  };

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setIsFetching(true);
        const data = await getUserDetails();
        const response = await getProjectsApi(data._id);

        setProjects(response?.data?.data?.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchAllProjects();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.screenTitle}>My Projects</Text>

      {isFetching ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : projects && projects.length > 0 ? (
        projects.map(project => (
          <ProjectCard
            key={project?._id}
            projectName={project?.title || ''}
            panels={project?.panels?.length || 0}
            activity={project?.activity}
            location={project?.siteLocation}
            warrantyStatus="Active: 81 days left"
            amcStatus="Not Applicable"
            warrantyLink={project?.warraty}
            amcLink={project?.AMC}
          />
        ))
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>No projects found.</Text>
        </View>
      )}
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
    shadowOffset: {width: 0, height: 1},
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
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 5,
    elevation: 4,
    borderBottomEndRadius: 12,
    borderBottomStartRadius: 12,
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
    justifyContent: 'space-between',
  },
  panelText: {
    color: 'black',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  notFoundText: {
    fontSize: 16,
    color: '#888',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
});

export default ProjectScreen;
