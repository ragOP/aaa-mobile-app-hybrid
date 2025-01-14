import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');
import RNFS from 'react-native-fs';
import warrantyImage from '../..//assets/icons/Settings.png';
import amcImage from '../../assets/icons/doc.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProjectsApi } from '../../store/api';
import { ActivityIndicator } from 'react-native-paper';

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

      if (!url) {
        Alert.alert('File not present', `The ${type} file is not added.`);
        return;
      }

      const fileName = url.split('/').pop();

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
            warrantyLink={project?.warrantyPdf}
            amcLink={project?.amcPdf}
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
    padding: width * 0.05, 
    backgroundColor: '#F3F6FC',
    flexGrow: 1,
  },
  screenTitle: {
    fontSize: width * 0.06, 
    fontWeight: 'bold',
    marginBottom: height * 0.02, 
    color: '#333',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.03,
    padding: width * 0.04, 
    marginBottom: height * 0.02,
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
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#D64541',
  },
  viewMore: {
    color: '#000',
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: width * 0.04,
    color: '#000',
    marginVertical: height * 0.005,
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
    backgroundColor: '#000',
    marginVertical: height * 0.015,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: height * 0.02,
  },
  statusBox: {
    alignItems: 'center',
    padding: height * 0.015, 
    backgroundColor: '#FFF',
    width: '40%',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 4,
    borderBottomEndRadius: width * 0.03,
    borderBottomStartRadius: width * 0.03,
  },
  statusTitle: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#333',
    marginTop: height * 0.01,
  },
  statusText: {
    fontSize: width * 0.03,
    color: '#555',
    marginTop: height * 0.005,
  },
  statusImage: {
    width: width * 0.08,
    height: width * 0.08, 
    marginBottom: height * 0.01, 
  },
  detailTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: width * 0.04, 
    color: '#D64541',
    marginVertical: height * 0.005,
  },
  panelText: {
    color: '#000',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  notFoundText: {
    fontSize: width * 0.04,
    color: '#888',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.04,
  },
});


export default ProjectScreen;
