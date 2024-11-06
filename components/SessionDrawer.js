import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const { height } = Dimensions.get('window');

const SessionDrawer = ({ visible, onClose, session = {}, onUpdateTime, onCancelSession }) => {
  const translateY = React.useRef(new Animated.Value(height)).current;
  const [isStartPickerVisible, setStartPickerVisible] = React.useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = React.useState(false);

  React.useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : height,
      useNativeDriver: true,
      bounciness: 0,
      speed: 14,
    }).start();
  }, [visible]);

  const handleStartTimeConfirm = (date) => {
    onUpdateTime('start_time', date);
    setStartPickerVisible(false);
  };

  const handleEndTimeConfirm = (date) => {
    onUpdateTime('end_time', date);
    setEndPickerVisible(false);
  };

  return (
    <>
      {visible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <SafeAreaView edges={['bottom']} style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.subTitle}>Graduate Level</Text>
                <Text style={styles.title}>{session.subject || 'Topology'}</Text>
              </View>

              <View style={styles.sessionDetails}>
                <TouchableOpacity 
                  style={styles.timeSelector}
                  onPress={() => setStartPickerVisible(true)}
                >
                  <Text style={styles.label}>Start Time</Text>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{session.start_time || '12:45 AM'}</Text>
                    <Text style={styles.arrowIcon}>›</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.timeSelector}
                  onPress={() => setEndPickerVisible(true)}
                >
                  <Text style={styles.label}>End Time</Text>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{session.end_time || '12:45 AM'}</Text>
                    <Text style={styles.arrowIcon}>›</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.notesSection}>
                  <Text style={styles.notesTitle}>Course Notes</Text>
                  {[{ title: 'Intro', file: 'Introduction.pdf' }, { title: 'Note', file: 'This.pdf' }].map((note, index) => (
                    <View key={index} style={styles.noteItem}>
                      <Text style={styles.noteNumber}>{index + 1}</Text>
                      <View>
                        <Text style={styles.noteTitle}>{note.title}</Text>
                        <Text style={styles.noteSubtitle}>{note.file}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={onCancelSession}
                  accessibilityLabel="Cancel session"
                >
                  <Text style={styles.cancelButtonText}>Cancel Session</Text>
                </TouchableOpacity>
              </View>

              <DateTimePickerModal
                isVisible={isStartPickerVisible}
                mode="time"
                onConfirm={handleStartTimeConfirm}
                onCancel={() => setStartPickerVisible(false)}
              />
              <DateTimePickerModal
                isVisible={isEndPickerVisible}
                mode="time"
                onConfirm={handleEndTimeConfirm}
                onCancel={() => setEndPickerVisible(false)}
              />
            </SafeAreaView>
          </Animated.View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 12,
    color: '#A1A1A1',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sessionDetails: {
    marginBottom: 20,
  },
  timeSelector: {
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#A1A1A1',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  arrowIcon: {
    fontSize: 16,
    color: '#A1A1A1',
  },
  notesSection: {
    marginTop: 20,
  },
  notesTitle: {
    fontSize: 14,
    color: '#A1A1A1',
    marginBottom: 8,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  noteNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
  noteTitle: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  noteSubtitle: {
    fontSize: 12,
    color: '#A1A1A1',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SessionDrawer;
