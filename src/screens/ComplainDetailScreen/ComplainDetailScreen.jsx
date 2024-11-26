import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';

const ComplainDetailScreen = ({route}) => {
  const {
    projectName,
    siteLocation,
    panelSectionName,
    issueDescription,
    images,
    activity,
    statusCode,
    severity,
    voiceNote,
  } = route.params.complaint;

  const handleCallEngineer = number => {
    console.log('number: ' + number);
    if (number == null) return;
    const phoneNumber = `tel:+91-${number}`;
    Linking.openURL(phoneNumber).catch(err =>
      console.error('Failed to open dialer', err),
    );
  };

  return (
    <View style={styles.container}>
      {/* Project Details Section */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Project Name:</Text>
          <Text style={styles.value}>{projectName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Panel Name:</Text>
          <Text style={styles.value}>{panelSectionName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{issueDescription}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{siteLocation}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Photos:</Text>
          <View style={styles.imageContainer}>
            {images.map((image, index) => (
              <Image key={index} source={{uri: image}} style={styles.image} />
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Severity:</Text>
          <Text style={[styles.value, styles[severity.toLowerCase()]]}>
            {severity}
          </Text>
        </View>
      </View>

      {/* Job Actions Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Job Actions</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Voice Note:</Text>
          <TouchableOpacity>
            {/* <FontAwesome name="microphone" size={24} color="#FF0000" /> */}
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Activity:</Text>
          <Text style={styles.value}>{activity}</Text>
        </View>

        {statusCode && (
          <View style={styles.row}>
            <Text style={styles.label}>Status Code:</Text>
            <Text style={styles.value}>{statusCode}</Text>
          </View>
        )}
      </View>

      {route.params.complaint?.technician && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Engineer Detail</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {route.params.complaint?.technician.name}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>
              {route.params.complaint?.technician.userName}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {route.params.complaint?.technician.email}
            </Text>
          </View>

          {statusCode && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() =>
                handleCallEngineer(
                  route.params.complaint?.technician?.phoneNumber,
                )
              }>
              <Text style={styles.buttonText}>Call Engineer</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 50,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    color: 'black',
  },
  value: {
    fontSize: 14,
    flex: 2,
    color: '#000',
  },
  link: {
    color: '#FF0000',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'red',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  codeInput: {
    width: 40,
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
  },
  completeButton: {
    backgroundColor: '#FF0000',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  low: {
    color: 'green',
  },
  medium: {
    color: 'orange',
  },
  high: {
    color: 'red',
  },
});

export default ComplainDetailScreen;
