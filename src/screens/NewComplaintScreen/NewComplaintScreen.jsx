import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {getProjectsApi, newComplaintApi} from '../../store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecord from 'react-native-audio-record';
import {requestMicrophonePermission} from '../../helper/permission';
import {getLocation} from '../../helper/getLocation';
import {getAddressFromCoordinates} from '../../helper/getAddress';
import pause from '../../assets/icons/pause.png';
import play from '../../assets/icons/mic.png';
import {ActivityIndicator} from 'react-native-paper';
const NewComplaintScreen = () => {
  const navigation = useNavigation();

  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPanel, setSelectedPanel] = useState('');
  const [severity, setSeverity] = useState(0);
  const [issuedescription, setIssueDescription] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [images, setImages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const [audioIcons, setAudioIcons] = useState(play);
  const [projects, setProjects] = useState([]);
  const [panels, setPanels] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  useEffect(() => {
    requestMicrophonePermission();
    AudioRecord.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
      wavFile: 'audio.wav',
    });
  }, []);

  const startRecording = () => {
    if (!isRecording) {
      AudioRecord.start();
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    const filePath = await AudioRecord.stop();
    setAudioPath(filePath);
    setIsRecording(false);
  };

  const getYourCurrentLocation = async () => {
    if (isFetchingLocation) {
      return;
    }

    try {
      setIsFetchingLocation(true);
      const {latitude, longitude} = await getLocation();
      const fullAddress = await getAddressFromCoordinates(latitude, longitude);
      setSiteLocation(fullAddress);
    } catch (error) {
      console.error('Error fetching location:', error.message);
      Alert.alert('Error', JSON.stringify(error.message));
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handlePress = () => {
    if (isRecording) {
      stopRecording();
      setAudioIcons(play);
    } else {
      startRecording();
      setAudioIcons(pause);
    }
  };

  const getSeverityText = () => {
    if (severity < 0.3) return 'Low';
    if (severity < 0.6) return 'Medium';
    return 'High';
  };

  const getSeverityColor = () => {
    if (severity < 0.3) return '#34A853';
    if (severity < 0.6) return 'orange';
    return 'red';
  };
  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 3,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Image Picker Error: ', response.errorMessage);
        } else {
          setImages(response.assets);
        }
      },
    );
  };
  const isSubmitDisabled = () => {
    return (
      !selectedProject || !selectedPanel || !siteLocation || !issuedescription
    );
  };

  const handleSubmit = async () => {
    if (isSubmitDisabled()) {
      Alert.alert(
        'Missing Fields',
        'Please fill all the required fields before submitting.',
        [{text: 'OK'}],
        {cancelable: false},
      );
      return;
    }

    const selectedProjectName = selectedProject?.title || '';
    const selectedPanelName = selectedPanel || '';
    const severityText = getSeverityText();
    const user = JSON.parse(await AsyncStorage.getItem('aaa_user'));

    // Dynamically create FormData
    const formData = new FormData();
    formData.append('customerId', user._id);
    formData.append('projectName', selectedProjectName);
    formData.append('siteLocation', siteLocation);
    formData.append('panelSectionName', selectedPanelName);
    formData.append('severity', severityText);
    formData.append('issuedescription', issuedescription);
    formData.append('voiceNote', {
      uri: `file://${audioPath}`,
      type: 'audio/wav',
      name: 'audio.wav',
    });

    // Dynamically append images (if any)
    images.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        type: image.type,
        name: `image_${index}.jpg`,
      });
    });
    try {
      const response = await newComplaintApi(user._id, formData);
      if (response?.data?.success) {
        setSelectedProject('');
        setSelectedPanel('');
        setSeverity(0);
        setIssueDescription('');
        setSiteLocation('');
        setImages([]);
        setAudioPath('');
        setAudioIcons(play);

        // Show alert
        Alert.alert(
          'Success',
          'New complaint added successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ComplaintScreen'),
            },
          ],
          {cancelable: false},
        );
        navigation.navigate('ComplaintScreen');
      }
    } catch (error) {
      console.error(
        'Error submitting complaint:',
        error.response ? error.response.data : error.message,
      );
    }
  };

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
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>New Complaint</Text>

      <Picker
        selectedValue={selectedProject}
        onValueChange={itemValue => {
          setSelectedProject(itemValue);
          setPanels(itemValue.panels);
          setSelectedPanel('');
        }}
        style={styles.picker}
        dropdownIconColor="red">
        <Picker.Item
          label="Project Name :"
          value={selectedProject?.title || ''}
        />
        {projects.map(project => (
          <Picker.Item
            key={project._id}
            label={project.title}
            value={project}
          />
        ))}
      </Picker>

      <View style={styles.locationContainer}>
        <View style={[styles.inputContainer1, styles.flexContainer]}>
          <TextInput
            placeholder="Add Site Location:"
            value={siteLocation}
            onChangeText={setSiteLocation}
            style={styles.address}
            placeholderTextColor="black"
          />
        </View>

        {isFetchingLocation ? (
          <View
            style={{
              ...styles.autoLocationButton,
              flex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.autoLocationButton}
            onPress={getYourCurrentLocation}>
            <Image
              source={require('../../assets/icons/location.png')}
              style={styles.icon}
            />
            <Text style={styles.autoLocationText}>Auto Location</Text>
          </TouchableOpacity>
        )}
      </View>

      <Picker
        selectedValue={selectedPanel}
        onValueChange={itemValue => setSelectedPanel(itemValue)}
        style={styles.picker}
        enabled={panels.length > 0}
        dropdownIconColor="red">
        <Picker.Item label="Panel/Section Name :" value="" />
        {panels.map((panel, index) => (
          <Picker.Item key={index} label={panel} value={panel} />
        ))}
      </Picker>

      <View style={styles.descriptionContainer}>
        <Text style={styles.label}>Describe Your Issue :</Text>
        <TextInput
          style={styles.descriptionInput}
          multiline
          placeholder="A Product of AAA SWITCH GEAR PVT LTD\nAll Rights Reserved."
          value={issuedescription}
          onChangeText={setIssueDescription}
          placeholderTextColor="black"
        />
        <View>
          <TouchableOpacity onPress={handlePress} style={styles.micButton}>
            <Image source={audioIcons} style={styles.micIcon} />
          </TouchableOpacity>
          {audioPath && (
            <Text style={{position: 'absolute', right: -5, bottom: -8}}>Record again</Text>
          )}
        </View>
      </View>

      {/* Add Photos and Uploaded Photos */}
      <View style={styles.grid}>
        <View style={styles.photosContainer}>
          <TouchableOpacity
            style={styles.addPhotosButton}
            onPress={handleImagePicker}>
            <Image
              source={require('../../assets/icons/cam.png')}
              style={styles.camicon}
            />
            <Text style={styles.addPhotosText}>Add Photos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadedPhotosContainer}>
          <Text style={styles.uploadedPhotosText}>Uploaded Photos</Text>
          <View style={styles.photosPreview}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{uri: image.uri}}
                style={styles.photoPlaceholder}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Severity Slider */}
      <View style={styles.severityContainer}>
        <Text style={styles.severityLabel}>Severity</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor={getSeverityColor()}
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor={getSeverityColor()}
          value={severity}
          onValueChange={value => setSeverity(value)}
        />
        <Text style={[styles.severityText, {color: getSeverityColor()}]}>
          {getSeverityText()}
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitDisabled() && {opacity: 0.5}]}
        onPress={handleSubmit}
        disabled={isSubmitDisabled()}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4fc',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginVertical: 20,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
  },
  inputContainer1: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
    width: '60%',
    color: 'black',
  },
  label: {
    fontSize: 16,
    color: 'black',
  },
  siteLocationInput: {
    width: '80%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  autoLocationButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
    marginLeft: 5,
    marginRight: 0,
    marginTop: 5,
    marginBottom: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  autoLocationText: {
    color: '#4f4f4f',
    marginLeft: 5,
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 13,
  },
  descriptionContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
  },
  descriptionInput: {
    height: 100,
    color: '#4f4f4f',
    marginBottom: 20,
  },
  micButton: {
    position: 'absolute',
    right: 15,
    bottom: 12,
    backgroundColor: '#FF0000',
    borderRadius: 22,
    padding: 10,
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
    alignContent: 'center  ',
    width: '47%',
  },
  addPhotosButton: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  addPhotosText: {
    color: '#4f4f4f',
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  uploadedPhotosContainer: {
    width: '47%',
    marginVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
    alignContent: 'center  ',
    padding: 10,
  },
  uploadedPhotosText: {
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginBottom: 5,
  },
  photosPreview: {
    flexDirection: 'row',
    gap: 10,
  },
  photoPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
  },
  severityContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    display: 'flex',
  },
  severityLabel: {
    fontWeight: 'bold',
    color: '#3a3a3a',
    fontSize: 16,
  },
  slider: {
    marginTop: 10,
    width: '96%',
    height: 50,
    borderRadius: 10,
  },
  severityText: {
    fontSize: 15,
    color: '#4f4f4f',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#FF0000',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    width: 30,
    height: 30,
  },
  camicon: {
    width: 40,
    height: 40,
  },
  micIcon: {
    width: 25,
    height: 25,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: '2%',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
    color: 'black',
  },
  address: {
    color: 'black',
  },
});

export default NewComplaintScreen;
