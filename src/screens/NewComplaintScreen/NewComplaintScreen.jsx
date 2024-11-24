import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {newComplaintApi} from '../../store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioRecord from 'react-native-audio-record';
import {requestMicrophonePermission} from "../../helper/permission"
import {getLocation} from "../../helper/getLocation";
import { getAddressFromCoordinates } from "../../helper/getAddress"
const NewComplaintScreen = () => {
  const navigation = useNavigation();

  const [selectedProject, setSelectedProject] = useState('');
  const [selectedPanel, setSelectedPanel] = useState('');
  const [severity, setSeverity] = useState(0);
  const [description, setDescription] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [images, setImages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState('');
  const projects = [
    {id: '1', name: 'Project A'},
    {id: '2', name: 'Project B'},
    {id: '3', name: 'Project C'},
  ];

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
  try {
    const { latitude, longitude } = await getLocation();
    const fullAddress = await getAddressFromCoordinates(latitude, longitude);
    setSiteLocation(fullAddress);
    console.log('User Location:', `Lat: ${latitude}, Lon: ${longitude} -- ${fullAddress}`);
  } catch (error) {
    console.error('Error fetching location:', error.message);
  }
 }
  const handlePress = () => {
    console.log(audioPath);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const panels = {
    1: ['Panel A1', 'Panel A2', 'Panel A3'],
    2: ['Panel B1', 'Panel B2'],
    3: ['Panel C1', 'Panel C2', 'Panel C3'],
  };
  const availablePanels = panels[selectedProject] || [];

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
    return !selectedProject || !selectedPanel || !siteLocation || !description;
  };
  const handleSubmit = async () => {
    // Dynamically fetch project, panel, and severity information
    const selectedProjectName =
      projects.find(project => project.id === selectedProject)?.name ||
      'No project selected';

    const selectedPanelName =
      panels[selectedProject]?.find(panel => panel === selectedPanel) ||
      'No panel selected';

    const severityText = getSeverityText();

    const user = JSON.parse(await AsyncStorage.getItem('aaa_user'));

    // Dynamically create FormData
    const formData = new FormData();
    formData.append('customerId', user._id);
    formData.append('projectName', selectedProjectName);
    formData.append('siteLocation', siteLocation);
    formData.append('panelSectionName', selectedPanelName);
    formData.append('severity', severityText);
    formData.append('description', description);
    formData.append('voiceNote', {
      uri: `file://${audioPath}`, // Add `file://` prefix
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
    console.log(formData, 'image');
    try {
      const response = await newComplaintApi(user._id, formData);
      console.log('Complaint submitted successfully:', response.data);
      navigation.navigate('ComplaintScreen', {
        projectName: selectedProjectName,
        panelName: selectedPanelName,
        severity: severityText,
        description,
        siteLocation,
        images,
        activity: response.data.data.activity,
      });
    } catch (error) {
      console.error(
        'Error submitting complaint:',
        error.response ? error.response.data : error.message,
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>New Complaint</Text>

      <Picker
        selectedValue={selectedProject}
        onValueChange={itemValue => {
          setSelectedProject(itemValue);
          setSelectedPanel('');
        }}
        style={styles.picker}
        dropdownIconColor="red">
        <Picker.Item label="Project Name :" value="" />
        {projects.map(project => (
          <Picker.Item
            key={project.id}
            label={project.name}
            value={project.id}
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
        <TouchableOpacity style={styles.autoLocationButton} onPress={getYourCurrentLocation}>
      <Image
        source={require('../../assets/icons/location.png')}
        style={styles.icon}
      />
      <Text style={styles.autoLocationText}>Auto Location</Text>
    </TouchableOpacity>
      </View>

      <Picker
        selectedValue={selectedPanel}
        onValueChange={itemValue => setSelectedPanel(itemValue)}
        style={styles.picker}
        enabled={availablePanels.length > 0}
        dropdownIconColor="red">
        <Picker.Item label="Panel/Section Name :" value="" />
        {availablePanels.map((panel, index) => (
          <Picker.Item key={index} label={panel} value={panel} />
        ))}
      </Picker>

      <View style={styles.descriptionContainer}>
        <Text style={styles.label}>Describe Your Issue :</Text>
        <TextInput
          style={styles.descriptionInput}
          multiline
          placeholder="A Product of AAA SWITCH GEAR PVT LTD\nAll Rights Reserved."
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="black"
        />
        <TouchableOpacity onPress={handlePress} style={styles.micButton}>
          <Image
            source={require('../../assets/icons/mic.png')}
            style={styles.micIcon}
          />
        </TouchableOpacity>
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
  },
  autoLocationText: {
    color: '#4f4f4f',
    marginLeft: 5,
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 15,
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
    bottom: 10,
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
