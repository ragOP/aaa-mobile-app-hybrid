import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width, height} = Dimensions.get('window');
import {OtpInput} from 'react-native-otp-entry';
import pause from '../../assets/icons/pause.png';
import play from '../../assets/icons/Play.png';
import mic from '../../assets/icons/mic.png';
import AudioRecord from 'react-native-audio-record';
import {useEffect, useState} from 'react';
import {requestMicrophonePermission} from '../../helper/permission';
import Sound from 'react-native-sound';
import {completeJob, startJob} from '../../store/api';
import Geolocation from '@react-native-community/geolocation';
import {Linking} from 'react-native';
import {Modal} from 'react-native-paper';
import ScreenWrapper from '../../wrapper/ScreenWrapper';

const JobDetailScreen = ({route, navigation}) => {
  const {
    _id,
    projectName,
    siteLocation,
    panelSectionName,
    issueDescription,
    images,
    activity,
    statusCode,
    severity,
    voiceNote,
    geoLatitude,
    geoLongitude,
  } = route.params.job;

  const isJobStarted = activity === 'Pending' ? true : false;
  // console.log('isJobStarted', isJobStarted, activity);
  const [audioIcons, setAudioIcons] = useState(play);
  const [recordAudioIcons, setRecordAudioIcons] = useState(mic);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [startCode, setStartCode] = useState('');
  const [happyCode, setHappyCode] = useState('');
  const [startCodeVerified, setStartCodeVerified] = useState(false);

  const [form, setForm] = useState({
    repairDescription: '',
    replacedParts: '',
    remarks: '',
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioPath, setAudioPath] = useState(null);
  const [recordingIcon, setRecordingIcon] = useState(play);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [newAudioPath, setNewAudioPath] = useState(null);
  const [submittingStartCode, setSubmittingStartCode] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [completingJob, setCompletingJob] = useState(false);

  const handleInputChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const handleOpenModal = image => {
    setSelectedImage(image);
    setImageModalVisible(true);
  };

  const handleCloseModal = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
  };

  const onStartJob = async () => {
    if (submittingStartCode) {
      return;
    }

    if (startCode?.length !== 4) {
      Alert.alert(
        'Invalid Job Code',
        'Please enter a complete 4-digit Job Code',
      );
      return;
    }

    if (startCode?.toString() !== statusCode?.toString()) {
      Alert.alert('Invalid Job Code', 'Please enter a valid 4-digit Job Code.');
      return;
    }

    try {
      setSubmittingStartCode(true);

      const formData = {
        statusCode: startCode,
      };

      const apiResponse = await startJob(_id, formData);

      if (apiResponse?.data?.success) {
        Alert.alert(
          'Job Started Successfully',
          'The job has been started with the provided Job Code.',
        );

        setStartCodeVerified(true);
      } else {
        Alert.alert(
          'Error',
          apiResponse?.data?.data?.message ||
            'There was an issue starting the job. Please try again.',
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'There was an issue starting the job. Please try again.',
      );
    } finally {
      setSubmittingStartCode(false);
    }
  };

  const onCompleteJob = async () => {
    if (completingJob) {
      return;
    }

    if (happyCode?.length !== 4) {
      Alert.alert(
        'Invalid Job Code',
        'Please enter a complete 4-digit Job Code',
      );
      return;
    }

    // if (!form || Object.values(form).some(value => !value)) {
    //   Alert.alert(
    //     'Missing Fields',
    //     'All fields are required. Please fill out the entire form.',
    //   );
    //   return;
    // }

    // if (!audioPath) {
    //   Alert.alert(
    //     'Missing Voice Note',
    //     'Please upload a voice note before completing the job.',
    //   );
    //   return;
    // }

    try {
      setCompletingJob(true);

      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      formData.append('statusCode', happyCode);

      if (audioPath) {
        formData.append('completedVoiceNote', {
          uri: `file://${audioPath}`,
          name: `voiceNote_${Date.now()}.mp3`,
          type: 'audio/mpeg',
        });
      }

      const apiResponse = await completeJob(_id, formData);

      if (apiResponse?.data?.success) {
        Alert.alert(
          'Job completed',
          'Job has been completed successfully',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'EngineerTabNavigation',
                      state: {
                        routes: [
                          {name: 'EngineerHomeScreen'},
                          {name: 'AllJobsScreen'},
                          {name: 'EngineerProfileScreen'},
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
      } else {
        Alert.alert(
          'Job completion failed',
          apiResponse?.data?.data?.message ||
            'Something went wrong. Please try again.',
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Invalid code', 'Please enter valid code.');
    } finally {
      setCompletingJob(false);
    }
  };

  const onHandleAudioPlay = () => {
    if (isPlaying) {
      if (sound) {
        sound.pause();
      }
      setAudioIcons(play);
      setIsPlaying(false);
      return;
    }

    if (sound) {
      sound.play(success => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.error('Playback failed due to audio decoding errors');
          Alert.alert('Audio playback failed');
        }
        setAudioIcons(play);
        setIsPlaying(false);
      });
      setAudioIcons(pause);
      setIsPlaying(true);
    } else {
      const newSound = new Sound(voiceNote, null, error => {
        if (error) {
          console.error('Failed to load the sound', error);
          Alert.alert('Failed to load audio file');
          return;
        }

        // Play only after sound is loaded
        newSound.play(success => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.error('Playback failed due to audio decoding errors');
            Alert.alert('Audio playback failed');
          }
          setAudioIcons(play);
          setIsPlaying(false);
        });

        // Update state after playback starts
        setSound(newSound);
        setAudioIcons(pause);
        setIsPlaying(true);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, [sound]);

  const onHandleAudioRecord = () => {
    if (isRecording) {
      stopRecording();
      setRecordAudioIcons(mic);
    } else {
      startRecording();
      setRecordAudioIcons(pause);
    }
  };

  const startRecording = () => {
    if (!isRecording) {
      AudioRecord.start();
      setIsRecording(true);
    }
  };

  const stopRecording = async () => {
    if (isRecording) {
      try {
        const filePath = await AudioRecord.stop();
        setAudioPath(filePath);
        setIsRecording(false);
      } catch (error) {
        console.error('Error stopping the recording:', error);
      }
    } else {
      console.log('Recording is not active.');
    }
  };

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

  const onRemoveRecording = () => {
    setAudioPath(null);
  };

  const onPlayRecordedAudio = () => {
    if (isPlayingRecording) {
      // Pause the audio
      if (newAudioPath) {
        newAudioPath.pause();
      }
      setRecordingIcon(play);
      setIsPlayingRecording(false);
    } else {
      if (newAudioPath) {
        newAudioPath.play(success => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.error('Playback failed due to audio decoding errors');
          }
          setRecordingIcon(play);
          setIsPlayingRecording(false);
        });
        setRecordingIcon(pause);
        setIsPlayingRecording(true);
      } else {
        // Create a new Sound instance
        const newSound = new Sound(audioPath, null, error => {
          if (error) {
            console.error('Failed to load the sound', error);
            return;
          }
          newSound.play(success => {
            if (success) {
              console.log('Successfully finished playing');
            } else {
              console.error('Playback failed due to audio decoding errors');
            }
            setRecordingIcon(play);
            setIsPlayingRecording(false);
          });
          setNewAudioPath(newSound);
          setRecordingIcon(pause);
          setIsPlayingRecording(true);
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (newAudioPath) {
        newAudioPath.release();
      }
    };
  }, [newAudioPath]);

  // const fetchGeocode = async location => {
  //   console.log('location', location);
  //   const response = await fetch(
  //     `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
  //       location,
  //     )}&format=json&limit=1`,
  //   );

  //   const data = await response.json();

  //   if (data.length > 0) {
  //     const {lat, lon} = data[0];
  //     return {latitude: parseFloat(lat), longitude: parseFloat(lon)};
  //   } else {
  //     console.error('Failed to fetch location details');
  //     throw new Error('Failed to fetch location details');
  //   }
  // };

  const handleGetSiteLocation = async () => {
    console.log('Current Location >>>>>', geoLatitude, geoLongitude);
    try {
      // const {latitude: siteLatitude, longitude: siteLongitude} =
      //   await fetchGeocode(siteLocation);
      setLoadingLocation(true);

      Geolocation.getCurrentPosition(
        position => {
          // const {latitude, longitude} = position.coords;

          // const siteLocationLatitude = 18.922;
          // const siteLocationLongitude = 72.8347;

          console.log('Current Location >>>>>', geoLatitude, geoLongitude);

          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${geoLatitude},${geoLongitude}&destination=${geoLatitude},${geoLongitude}`;

          console.log('>>> ' + googleMapsUrl);

          Linking.openURL(googleMapsUrl).catch(err => {
            Alert.alert('Error', 'Unable to open Google Maps');
          });

          setLoadingLocation(false);
        },
        error => {
          Alert.alert(
            'Location Error',
            `${error.message} Please ensure location services are also enabled.`,
          );
          setLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await requestPermission();
      if (granted !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'We need location permissions to show directions.',
        );
      }
    } else {
      // For iOS, handle permission request differently (usually, iOS asks for permission automatically)
      // This might be sufficient, depending on iOS version
    }
  };
  return (
    <>
      <ScreenWrapper>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={{
                zIndex: 10,
                paddingHorizontal: 4,
              }}
              onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={28} color="#FF0000" />
            </TouchableOpacity>
            <Text style={styles.title}>
              Job Details : <Text style={styles.repairText}>Repair</Text>
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.projectTopRow}>
                <View style={styles.column}>
                  <Text style={styles.label}>Project Name:</Text>
                  <Text style={styles.value}>{projectName || ''}</Text>
                </View>
              </View>

              <TouchableOpacity onPress={handleGetSiteLocation}>
                <Text style={styles.siteDirectionTitle}>
                  Get Site Directions
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.projectColumn}>
              <Text style={styles.label}>Panel Name:</Text>
              <Text style={styles.value}>{panelSectionName || ''}</Text>
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Description:</Text>
              <View style={styles.descriptionRow}>
                <Text style={styles.descriptionValue}>
                  {issueDescription || '-'}
                </Text>
                {voiceNote && (
                  <TouchableOpacity
                    style={styles.playIconContainer}
                    onPress={onHandleAudioPlay}>
                    <Image source={audioIcons} style={styles.micIcon} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.projectColumn}>
              <Text style={styles.label}>Address -</Text>
              <Text style={styles.value}>
                {siteLocation || 'No Address Found'}
              </Text>
            </View>

            <View style={styles.photoContainerRows}>
              <Text style={styles.label}>Photos:</Text>
              <View style={styles.photoRows}>
                {images &&
                  images?.length > 0 &&
                  images.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleOpenModal(image)}>
                      <Image
                        source={{uri: image}}
                        style={styles.photoPlaceholder}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            </View>

            <View style={styles.projectRow}>
              <Text style={styles.label}>Severity:</Text>
              <Text style={styles.severityValue}>{severity || ''}</Text>
            </View>
          </View>

          {isJobStarted && (
            <View style={styles.startCodeBox}>
              <Text style={styles.label}>Enter start code</Text>
              <View style={styles.startCodeInnerBox}>
                <OtpInput
                  numberOfDigits={4}
                  autoFocus={false}
                  onTextChange={text => setStartCode(text)}
                  focusColor={'#404969'}
                  theme={{
                    containerStyle: styles.otpMainContainer,
                    pinCodeContainerStyle: styles.pinCodeContainer,
                  }}
                />

                <TouchableOpacity
                  style={{
                    ...styles.button,
                    backgroundColor:
                      startCode?.length === 4
                        ? 'rgba(255, 0, 0, 1)'
                        : 'rgba(255, 0, 0, 0.4)',
                  }}
                  onPress={onStartJob}>
                  <Text style={styles.buttonText}>Start Job</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(!isJobStarted || startCodeVerified) && activity !== 'Closed' && (
            <View style={{...styles.card, marginTop: 8}}>
              <Text style={styles.label}>Job Actionssss</Text>

              <View style={styles.column}>
                <Text style={styles.label}>Repair Description</Text>
                <View style={styles.descriptionRow}>
                  <TextInput
                    value={form.repairDescription}
                    style={{maxWidth: '67%', color: '#000'}}
                    placeholderTextColor={'gray'}
                    multiline={true}
                    numberOfLines={1}
                    onChangeText={text =>
                      handleInputChange('repairDescription', text)
                    }
                    placeholder="Enter Repair Description"
                  />
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                    {/* {!audioPath ? ( */}
                    <TouchableOpacity
                      style={styles.playIconContainer}
                      onPress={onHandleAudioRecord}>
                      <Image source={recordAudioIcons} style={styles.micIcon} />
                    </TouchableOpacity>
                    {/* ) : (
                    <TouchableOpacity
                      style={styles.playIconContainer}
                      onPress={onPlayRecordedAudio}>
                      <Image source={recordingIcon} style={styles.micIcon} />
                    </TouchableOpacity>
                  )} */}
                    {/* {isRecording && <Text>Recording</Text>} */}
                    {audioPath && (
                      <TouchableOpacity onPress={onRemoveRecording}>
                        <Text>Record again</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              <View style={{...styles.column, gap: 4}}>
                <Text style={styles.label}>Parts Replaced</Text>
                <TextInput
                  style={{maxWidth: '70%', color: '#000'}}
                  placeholderTextColor={'gray'}
                  multiline={true}
                  numberOfLines={1}
                  value={form.replacedParts}
                  onChangeText={text =>
                    handleInputChange('replacedParts', text)
                  }
                  placeholder="Enter Repair Description"
                />
              </View>

              <View style={{...styles.column, gap: 4}}>
                <Text style={styles.label}>Pending Remarks </Text>

                <TextInput
                  value={form.remarks}
                  style={{maxWidth: '70%', color: '#000'}}
                  placeholderTextColor={'gray'}
                  multiline={true}
                  numberOfLines={1}
                  onChangeText={text => handleInputChange('remarks', text)}
                  placeholder="Enter Repair Description"
                />
              </View>

              <View style={{...styles.startCodeBox, marginTop: 0}}>
                <Text style={styles.label}>Enter Happy Code</Text>
                <View style={styles.startCodeInnerBox}>
                  <OtpInput
                    numberOfDigits={4}
                    autoFocus={false}
                    onTextChange={text => setHappyCode(text)}
                    focusColor={'#404969'}
                    theme={{
                      containerStyle: styles.otpMainContainer,
                      pinCodeContainerStyle: styles.pinCodeContainer,
                      pinCodeTextStyle: {color: '#000000'},
                    }}
                  />

                  <TouchableOpacity
                    style={{
                      ...styles.button,
                      width: '55%',
                      backgroundColor:
                        happyCode?.length === 4
                          ? 'rgba(255, 0, 0, 1)'
                          : 'rgba(255, 0, 0, 0.4)',
                    }}
                    onPress={onCompleteJob}>
                    <Text style={styles.buttonText}>Complete Job</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </ScreenWrapper>
      <Modal
        transparent={true}
        animationType="fade"
        visible={loadingLocation}
        onRequestClose={() => setLoadingLocation(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Setting location...</Text>
          </View>
        </View>
      </Modal>

      <Modal
        visible={imageModalVisible}
        onRequestClose={handleCloseModal}
        transparent={true}
        animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Image source={{uri: selectedImage}} style={styles.modalImage} />
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default JobDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F5FD',
    paddingHorizontal: width * 0.05,
    gap: height * 0.003,
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
  repairText: {
    color: '#FF0000',
    fontSize: width * 0.06,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.015,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: height * 0.001},
    shadowOpacity: 0.25,
    shadowRadius: width * 0.02,
    elevation: 4,
    gap: height * 0.02,
  },
  projectTopRow: {
    flexDirection: 'column',
    gap: height * 0.02,
    flex: 1,
  },
  column: {
    flexDirection: 'column',
  },
  descriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: width * 0.01,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.03,
    flex: 1,
  },
  projectColumn: {
    flexDirection: 'column',
    gap: height * 0.003,
    flex: 1,
  },
  label: {
    fontWeight: 'bold',
    fontSize: width * 0.035,
    color: '#404969',
  },
  value: {
    fontSize: width * 0.035,
    color: '#000',
    whiteSpace: 'nowrap',
  },
  siteDirectionTitle: {
    flexDirection: 'column',
    color: '#FF0000',
    fontSize: width * 0.035,
    lineHeight: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
    width: '70%',
  },
  descriptionValue: {
    fontSize: width * 0.035,
    color: '#000',
    width: '70%',
  },
  playIconContainer: {
    backgroundColor: '#FF0000',
    padding: width * 0.03,
    borderRadius: width * 0.125,
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.13,
    height: width * 0.13,
  },
  playIcon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: '#FFFFFF',
  },
  photoContainerRows: {
    flexDirection: 'row',
    gap: width * 0.025,
    alignItems: 'center',
  },
  photoRows: {
    flexDirection: 'row',
    gap: width * 0.015,
    flexWrap: 'wrap',
    width: '80%',
  },
  photoPlaceholder: {
    width: width * 0.1,
    height: width * 0.1,
    backgroundColor: '#d3d3d3',
  },
  severityValue: {
    color: '#FF0000',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  startCodeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: height * 0.02,
    marginTop: height * 0.045,
  },
  startCodeInnerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: height * 0.015,
    width: '100%',
  },
  otpMainContainer: {
    width: '60%',
  },
  pinCodeContainer: {
    backgroundColor: '#fff',
    height: height * 0.05,
    width: width * 0.1,
    marginRight: width * 0.005,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: height * 0.005},
    shadowOpacity: 0.25,
    shadowRadius: width * 0.02,
    elevation: 4,
  },
  button: {
    backgroundColor: '#FF0000',
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  micIcon: {
    width: width * 0.06,
    height: width * 0.06,
    tintColor: '#FFFFFF',
  },
  modalOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    padding: width * 0.05,
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: height * 0.012,
    fontSize: width * 0.04,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: height * 0.015,
    right: width * 0.025,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: width * 0.02,
    borderRadius: width * 0.05,
  },
  closeButtonText: {
    color: 'white',
    fontSize: width * 0.04,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.02,
    padding: width * 0.02,
    fontSize: width * 0.035,
    backgroundColor: '#f9f9f9',
  },
});
