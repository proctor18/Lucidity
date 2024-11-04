import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const SessionDrawer = ({ visible, onClose, session }) => {
  const translateY = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
        speed: 14,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: height,
        useNativeDriver: true,
        bounciness: 0,
        speed: 14,
      }).start();
    }
  }, [visible]);

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
              <View style={styles.handle} />
              <View style={styles.header}>
                <Text style={styles.title}>Session Details</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              {session ? (
                <View style={styles.sessionDetails}>
                  <DetailItem label="Date" value={session.session_date} />
                  <DetailItem label="Subject" value={session.subject} />
                  <DetailItem 
                    label="Time" 
                    value={`${session.start_time} - ${session.end_time}`} 
                  />
                  <DetailItem label="Tutor ID" value={session.tutor_id} />
                  <DetailItem label="Session ID" value={session.session_id} />
                </View>
              ) : (
                <View style={styles.noSession}>
                  <Text style={styles.noSessionText}>No session selected</Text>
                </View>
              )}
            </SafeAreaView>
          </Animated.View>
        </TouchableOpacity>
      )}
    </>
  );
};

const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '90%',
    zIndex: 1001,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#3A3A3A',
    borderRadius: 2,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
  },
  sessionDetails: {
    gap: 16,
  },
  detailItem: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 12,
  },
  label: {
    color: '#808080',
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  noSession: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSessionText: {
    color: '#808080',
    fontSize: 16,
  },
});

export default SessionDrawer;
