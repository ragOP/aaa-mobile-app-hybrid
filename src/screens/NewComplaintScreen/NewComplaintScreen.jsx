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
  Dimensions,
  Platform,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import Slider from '@react-native-community/slider';
import RNPickerSelect from 'react-native-picker-select';
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
import ScreenWrapper from '../../wrapper/ScreenWrapper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
  const [isProjectsFetched, setIsProjectsFetched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isCreatingComplaint, setIsCreatingComplaint] = useState(false);
  const [geoLatitude, setGeoLatitude] = useState(0);
  const [geoLongitude, setGeoLongitude] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestMicrophonePermission();
    }
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
      setGeoLatitude(latitude);
      setGeoLongitude(longitude);
      console.log('Location >>>', geoLatitude, geoLongitude);
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
      !selectedProject ||
      !selectedPanel ||
      !siteLocation ||
      !issuedescription ||
      !audioPath ||
      images?.length === 0
    );
  };

  const handleSubmit = async () => {
    if (isCreatingComplaint) {
      return;
    }

    try {
      setIsCreatingComplaint(true);
      const selectedProjectName = selectedProject?.title || '';
      const selectedPanelName = selectedPanel || '';
      const severityText = getSeverityText();
      const user = JSON.parse(await AsyncStorage.getItem('aaa_user'));

      const formData = new FormData();
      formData.append('customerId', user._id);
      formData.append('projectName', selectedProjectName);
      formData.append('siteLocation', siteLocation);
      formData.append('panelSectionName', selectedPanelName);
      formData.append('severity', severityText);
      formData.append('issueDescription', issuedescription);
      formData.append('geoLatitude', geoLatitude);
      formData.append('geoLongitude', geoLongitude);

      if (!selectedProjectName || !selectedPanelName) {
        Alert.alert(
          'Project and Panel are required',
          'Please select a project and panel.',
        );
        return;
      }

      if (audioPath) {
        console.log('audioPath');
        formData.append('voiceNote', {
          uri: `file://${audioPath}`,
          type: 'audio/wav',
          name: 'audio.wav',
        });
      }

      images.forEach((image, index) => {
        console.log('Image object >>>>>>>', image);
        formData.append('images', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: `image_${index}.jpg`,
        });
      });
      console.log('FormData >>> ', formData);

      const response = await newComplaintApi(user._id, formData);
      console.log('Response >>>', response);

      if (response?.data?.success) {
        setSelectedProject('');
        setSelectedPanel('');
        setSeverity(0);
        setIssueDescription('');
        setSiteLocation('');
        setImages([]);
        setAudioPath('');
        setAudioIcons(play);

        Alert.alert(
          'Success',
          'New complaint added successfully!',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'BottomTabNavigation',
                      state: {
                        routes: [
                          {name: 'HomeScreen'},
                          {name: 'ComplaintScreen'},
                          {name: 'ProjectScreen'},
                          {name: 'ProfileScreen'},
                        ],
                        index: 1,
                      },
                    },
                  ],
                }),
            },
          ],
          {cancelable: false},
        );
        navigation.reset({
          index: 0,
          routes: [{name: 'ComplaintScreen'}],
        });
      } else {
        console.log(11111);
        Alert.alert(
          'Create failed',
          response?.data?.data?.message || 'New complaint create failed',
        );
      }
    } catch (error) {
      console.log('Error submitting complaint:', error);
      console.error(
        'Error submitting complaint:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert(
        'Create failed',
        error?.message || 'Server error, please try later.',
      );
    } finally {
      setIsCreatingComplaint(false);
    }
  };

  const getUserDetails = async () => {
    return JSON.parse(await AsyncStorage.getItem('aaa_user'));
  };

  const fetchAllProjects = async () => {
    try {
      setIsFetching(true);
      const data = await getUserDetails();
      const response = await getProjectsApi(data._id);

      if (response?.data?.success) {
        setProjects(response?.data?.data?.data || []);
        setIsProjectsFetched(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!isProjectsFetched) {
      fetchAllProjects();
    }
  }, []);

  return (
    <ScreenWrapper style={{flex: 1, backgroundColor: '#f0f4fc'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 100}}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{
              zIndex: 10,
              paddingHorizontal: 4,
            }}
            onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={28} color="#FF0000" />
          </TouchableOpacity>
          <Text style={styles.title}>New Complaint</Text>
        </View>

        {/*
        <Picker
          selectedValue={selectedProject}
          onValueChange={itemValue => {
            setSelectedProject(itemValue);
            setPanels(itemValue.panels);
            setSelectedPanel('');
          }}
          itemStyle={{width: "100%"}}
          style={styles.picker}
          dropdownIconColor="red">
          <Picker.Item
            label={isFetching ? 'Fetching projects...' : 'Project Name :'}
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
        */}
        <RNPickerSelect
          onValueChange={value => {
            setSelectedProject(projects.find(p => p._id === value) || '');
            const selected = projects.find(p => p._id === value);
            setPanels(selected ? selected.panels : []);
            setSelectedPanel('');
          }}
          items={projects.map(project => ({
            label: project.title,
            value: project._id,
            key: project._id,
          }))}
          value={selectedProject?._id || ''}
          placeholder={{
            label: isFetching ? 'Fetching projects...' : 'Project Name :',
            value: '',
            color: '#A9A9A9',
          }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          disabled={isFetching}
        />

        <View style={styles.locationContainer}>
          <View style={[styles.inputContainer1, styles.flexContainer]}>
            <TextInput
              placeholder="Add Site Location:"
              placeholderTextColor="#A9A9A9"
              value={siteLocation}
              onChangeText={setSiteLocation}
              style={styles.address}
            />
          </View>

          {isFetchingLocation ? (
            <View style={styles.autoLocationButton}>
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

        {/*
        <Picker
          selectedValue={selectedPanel}
          onValueChange={itemValue => setSelectedPanel(itemValue)}
          style={styles.picker}
          enabled={panels?.length > 0}
          dropdownIconColor="red">
          <Picker.Item label="Panel/Section Name :" value="" />
          {panels &&
            panels?.length > 0 &&
            panels?.map((panel, index) => (
              <Picker.Item key={index} label={panel} value={panel} />
            ))}
        </Picker>
        */}
        <RNPickerSelect
          onValueChange={value => setSelectedPanel(value)}
          items={panels.map((panel, idx) => ({
            label: panel,
            value: panel,
            key: idx,
          }))}
          value={selectedPanel}
          placeholder={{
            label: 'Panel/Section Name :',
            value: '',
            color: '#A9A9A9',
          }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          disabled={panels.length === 0}
        />

        <View style={styles.descriptionContainer}>
          <Text style={styles.label}>Describe Your Issue :</Text>
          <TextInput
            style={styles.descriptionInput}
            multiline
            placeholder="Describe the issue in detail to help us assist you better..."
            value={issuedescription}
            onChangeText={setIssueDescription}
            placeholderTextColor="#A9A9A9"
          />
          <View>
            <TouchableOpacity onPress={handlePress} style={styles.micButton}>
              <Image source={audioIcons} style={styles.micIcon} />
            </TouchableOpacity>
            {audioPath && (
              <Text
                style={{
                  position: 'absolute',
                  right: -5,
                  bottom: -8,
                  fontSize: 10,
                }}>
                Record again
              </Text>
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
        <TouchableOpacity style={[styles.submitButton]} onPress={handleSubmit}>
          {isCreatingComplaint && <ActivityIndicator size="small" />}
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4fc',
    paddingHorizontal: width * 0.05,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginVertical: height * 0.02,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    padding: width * 0.04,
    marginVertical: height * 0.01,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: height * 0.002},
    shadowRadius: width * 0.02,
    elevation: 3,
  },
  uploadedPhotosContainer: {
    width: '48%',
    marginVertical: 10,
    borderRadius: width * 0.025,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: height * 0.002},
    shadowRadius: width * 0.02,
    elevation: 3,
    backgroundColor: '#fff',
    alignContent: 'center  ',
    padding: 10,
  },
  inputContainer1: {
    flex: 1, // ✅ Let it take available space
    minWidth: '60%',
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    padding: width * 0.04,
    marginVertical: height * 0.01,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: height * 0.002},
    shadowRadius: width * 0.02,
    elevation: 3,
    width: '60%',
    color: 'black',
  },
  label: {
    fontSize: width * 0.04,
    color: 'black',
  },
  photosPreview: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadedPhotosText: {
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginBottom: 5,
    textAlign: 'center',
  },
  siteLocationInput: {
    width: '80%',
    height: height * 0.05,
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    paddingLeft: width * 0.025,
    fontSize: width * 0.035,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  locationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // ✅ allow wrapping on smaller screens
    gap: width * 0.02,
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },

  autoLocationButton: {
    flex: 1,
    minWidth: '35%',
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    padding: width * 0.025,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: height * 0.002},
    shadowRadius: width * 0.02,
    elevation: 3,
    marginLeft: width * 0.01,
    marginRight: 0,
    marginVertical: height * 0.01,
    justifyContent: 'center',
    width: '100%',
  },
  autoLocationText: {
    color: '#4f4f4f',
    marginLeft: width * 0.01,
    fontWeight: 'bold',
    marginTop: height * 0.01,
    fontSize: width * 0.033,
  },
  descriptionContainer: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    padding: width * 0.04,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: height * 0.002},
    shadowRadius: width * 0.02,
    elevation: 3,
  },
  descriptionInput: {
    height: height * 0.07,
    width: '80%',
    color: '#4f4f4f',
    marginBottom: height * 0.02,
  },
  micButton: {
    position: 'absolute',
    right: width * 0.001,
    bottom: height * 0.015,
    backgroundColor: '#FF0000',
    borderRadius: width * 0.055,
    padding: width * 0.025,
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: height * 0.015,
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: height * 0.002},
    shadowRadius: width * 0.02,
    elevation: 3,
    width: '48%',
  },
  addPhotosButton: {
    borderRadius: width * 0.025,
    padding: width * 0.025,
    alignItems: 'center',
  },
  addPhotosText: {
    color: '#4f4f4f',
    fontWeight: 'bold',
    marginTop: height * 0.01,
    textAlign: 'center',
  },
  photoPlaceholder: {
    width: width * 0.1,
    height: width * 0.1,
    backgroundColor: '#d3d3d3',
    borderRadius: width * 0.0125,
  },
  severityContainer: {
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    padding: width * 0.04,
    marginVertical: height * 0.01,
  },
  severityLabel: {
    fontWeight: 'bold',
    color: '#3a3a3a',
    fontSize: width * 0.04,
  },
  slider: {
    width: '96%',
    height: height * 0.05,
    borderRadius: width * 0.025,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.03,
    backgroundColor: '#FF0000',
    borderRadius: width * 0.05,
    padding: width * 0.04,
    marginTop: height * 0.02,
    marginBottom: height * 0.03,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  icon: {
    width: width * 0.08,
    height: width * 0.08,
  },
  micIcon: {
    width: width * 0.06,
    height: width * 0.06,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: width * 0.02,
  },
  pickerInput: {
    height: 44,
    fontSize: width * 0.04,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: height * 0.06,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.04,
    marginVertical: height * 0.01,
    color: 'black',
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#d3d3d3',
  },
  inputAndroid: {
    height: height * 0.06,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.04,
    marginVertical: height * 0.01,
    color: 'black',
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: '#d3d3d3',
  },
  placeholder: {
    color: '#A9A9A9',
  },
});

export default NewComplaintScreen;
