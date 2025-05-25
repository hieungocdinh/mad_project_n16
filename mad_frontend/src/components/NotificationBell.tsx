import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Notification = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  count?: number;
  notifications?: Notification[];
};

const NotificationBell: React.FC<Props> = ({ count = 0, notifications = [] }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setVisible(true)}>
        <Ionicons name="notifications-outline" size={28} color="#1e88e5" />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownTitle}>Thông báo mới</Text>
          {notifications.length === 0 ? (
            <Text style={styles.emptyText}>Không có thông báo mới</Text>
          ) : (
            <FlatList
              data={notifications.slice(0, )}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.notificationItem}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationContent}>{item.content}</Text>
                </View>
              )}
              style={{ maxHeight: 240 }}
            />
          )}
        </View>
      </Modal>
    </>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#1e88e5',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  dropdownTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1e88e5',
    marginBottom: 10,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    paddingVertical: 16,
  },
  notificationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  notificationTitle: {
    fontWeight: 'bold',
    color: '#1e88e5',
    fontSize: 14,
  },
  notificationContent: {
    color: '#222',
    fontSize: 13,
    marginTop: 2,
  },
});

export default NotificationBell;