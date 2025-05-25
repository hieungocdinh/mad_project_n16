// screens/HistoryScreen.tsx

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const HistoryScreen: React.FC = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Lịch sử gia đình</Text>
            <Text style={styles.text}>
                Đây là nơi bạn có thể xem các sự kiện hoặc câu chuyện trong lịch sử gia đình.
            </Text>

            {/* Ví dụ về danh sách các sự kiện trong lịch sử */}
            <View style={styles.historyItem}>
                <Text style={styles.eventTitle}>Sự kiện 1</Text>
                <Text style={styles.eventDate}>Ngày: 01/01/2023</Text>
                <Text style={styles.eventDescription}>
                    Đây là mô tả về sự kiện 1 trong lịch sử gia đình.
                </Text>
            </View>

            <View style={styles.historyItem}>
                <Text style={styles.eventTitle}>Sự kiện 2</Text>
                <Text style={styles.eventDate}>Ngày: 05/05/2023</Text>
                <Text style={styles.eventDescription}>
                    Đây là mô tả về sự kiện 2 trong lịch sử gia đình.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        color: '#777',
        marginBottom: 30,
    },
    historyItem: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    eventTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    eventDate: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    eventDescription: {
        fontSize: 14,
        color: '#444',
    },
});

export default HistoryScreen;
