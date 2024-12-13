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
} from 'react-native';
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
import axios from 'axios';

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
  } = route.params.job;

  const isJobStarted = activity === 'Pending' ? true : false;
  const [audioIcons, setAudioIcons] = useState(play);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [startCode, setStartCode] = useState('');
  const [happyCode, setHappyCode] = useState('');

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
        'Invalid Status Code',
        'Please enter a complete 4-digit status code',
      );
      return;
    }

    if (startCode !== statusCode) {
      Alert.alert(
        'Invalid Status Code',
        'Please enter a valid 4-digit status code.',
      );
      return;
    }

    try {
      setSubmittingStartCode(true);

      const form = {
        statusCode: startCode,
      };
      const apiResponse = await startJob(_id, form);

      if (apiResponse?.response?.success) {
        Alert.alert(
          'Job Started Successfully',
          'The job has been started with the provided status code.',
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
        'Invalid Status Code',
        'Please enter a complete 4-digit status code',
      );
      return;
    }

    if (!form || Object.values(form).some(value => !value)) {
      Alert.alert(
        'Missing Fields',
        'All fields are required. Please fill out the entire form.',
      );
      return;
    }

    if (!audioPath) {
      Alert.alert(
        'Missing Voice Note',
        'Please upload a voice note before completing the job.',
      );
      return;
    }

    try {
      setCompletingJob(true);

      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      formData.append('statusCode', happyCode);

      if (audioPath) {
        formData.append('completedVoiceNote', {
          uri: audioPath,
          name: `voiceNote_${Date.now()}.mp3`,
          type: 'audio/mpeg',
        });
      }

      // const apiResponse = await completeJob(_id, formData);

      const apiResponse = await axios.post(
        `/api/engineer/completed-job/${_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('apiResponse >>', apiResponse);

      if (apiResponse?.response?.success) {
        Alert.alert(
          'Job completed',
          'Job has been completed successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('AllJobScreen'),
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          'Job completion failed',
          apiResponse?.response?.message ||
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
    } else {
      if (sound) {
        sound.play(success => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.error('Playback failed due to audio decoding errors');
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
            return;
          }
          newSound.play(success => {
            if (success) {
              console.log('Successfully finished playing');
            } else {
              console.error('Playback failed due to audio decoding errors');
            }
            setAudioIcons(play);
            setIsPlaying(false);
          });
          setSound(newSound);
          setAudioIcons(pause);
          setIsPlaying(true);
        });
      }
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
    } else {
      startRecording();
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

  const handleGetSiteLocation = async () => {
    try {
      setLoadingLocation(true);
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;

          const siteLocationLatitude = 18.922;
          const siteLocationLongitude = 72.8347;

          const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${siteLocationLatitude},${siteLocationLongitude}`;

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
      <ScrollView style={styles.container}>
        <Text style={styles.title}>
          Job Details : <Text style={styles.repairText}>Repair</Text>
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.projectTopRow}>
              <View style={styles.column}>
                <Text style={styles.label}>Project Name:</Text>
                <Text style={styles.value}>{projectName || ''}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleGetSiteLocation}>
              <Text style={styles.siteDirectionTitle}>Get Site Directions</Text>
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
              <TouchableOpacity
                style={styles.playIconContainer}
                onPress={onHandleAudioPlay}>
                <Image source={audioIcons} style={styles.playIcon} />
              </TouchableOpacity>
            </View>
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

        {!isJobStarted && (
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

        {isJobStarted && (
          <View style={{...styles.card, marginTop: 8}}>
            <Text style={styles.label}>Job Actions</Text>

            <View style={styles.column}>
              <Text style={styles.label}>Repair Description</Text>
              <View style={styles.descriptionRow}>
                <TextInput
                  value={form.repairDescription}
                  style={{maxWidth: '67%'}}
                  multiline={true}
                  numberOfLines={1}
                  onChangeText={text =>
                    handleInputChange('repairDescription', text)
                  }
                  placeholder="Enter Repair Description"
                />
                {/* <Text style={styles.descriptionValue}>
                  {issueDescription || ''}
                </Text> */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                  }}>
                  {!audioPath ? (
                    <TouchableOpacity
                      style={styles.playIconContainer}
                      onPress={onHandleAudioRecord}>
                      <Image
                        source={require('../../assets/icons/mic.png')}
                        style={styles.micIcon}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.playIconContainer}
                      onPress={onPlayRecordedAudio}>
                      <Image source={recordingIcon} style={styles.micIcon} />
                    </TouchableOpacity>
                  )}
                  {isRecording && <Text>Recording...</Text>}
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
                style={{maxWidth: '70%'}}
                multiline={true}
                numberOfLines={1}
                value={form.replacedParts}
                onChangeText={text => handleInputChange('replacedParts', text)}
                placeholder="Enter Repair Description"
              />
            </View>

            <View style={{...styles.column, gap: 4}}>
              <Text style={styles.label}>Pending Remarks </Text>

              <TextInput
                value={form.remarks}
                style={{maxWidth: '70%'}}
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
    paddingHorizontal: 20,
    gap: 3,
  },

  // Title
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3a3a3a',
    marginVertical: 20,
  },
  repairText: {
    color: '#FF0000',
    fontSize: 24,
    fontWeight: 'bold',
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    display: 'flex',
    gap: 16,
  },
  projectTopRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    flex: 1,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  descriptionRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  projectRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  projectColumn: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#404969',
  },
  value: {
    fontSize: 14,
    color: '#000',
    // width: "30%",
    whiteSpace: 'nowrap',
  },
  siteDirectionTitle: {
    display: 'flex',
    flexDirection: 'column',
    color: '#FF0000',
    fontSize: 14,
    lineHeight: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
    width: '70%',
  },
  descriptionValue: {
    fontSize: 14,
    color: '#000',
    width: '70%',
  },
  playIconContainer: {
    backgroundColor: '#FF0000',
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  playIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  photoContainerRows: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  photoRows: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    width: '80%',
  },
  photoPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#d3d3d3',
  },
  severityValue: {
    color: '#FF0000',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Start code
  startCodeBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 36,
  },
  startCodeInnerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },

  // OTP
  otpMainContainer: {
    width: '60%',
  },
  pinCodeContainer: {
    backgroundColor: '#fff',
    height: 43,
    width: 43,
    marginRight: 2,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  button: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Job Actions
  micIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },

  modalOverlay: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    padding: 20,
    display: 'flex',
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    // width: '80%',
    // height: '80%',
    height: 400,
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
});
