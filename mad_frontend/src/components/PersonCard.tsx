import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Person from "../types/model/person";


interface PersonCardProps {
    person: Person;
    mode: 'detailed' | 'simple';
}

const PersonCard = ({ person, mode }: PersonCardProps) => {
    return (
        <View style={[
            styles.personCard,
            mode === 'simple' ? styles.simpleCard : styles.detailedCard
        ]}>
            <Image source={{ uri: person.avatarUrl }} style={styles.avatar} />

            {person.nickname && (
                <Text style={styles.nickname}>{person.nickname}</Text>
            )}

            <Text style={styles.name}>{person.name}</Text>

            {person.birthYear && (
                <View style={styles.ageContainer}>
                    <Text style={styles.birthYear}>{person.birthYear}</Text>
                    {person.age && <Text style={styles.age}>{person.age} tuổi</Text>}
                </View>
            )}

            {mode === 'detailed' && (
                <>
                    <TouchableOpacity style={[styles.addButton, styles.addButtonTop]}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.addButton, styles.addButtonRight]}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.addButton, styles.addButtonBottom]}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.addButton, styles.addButtonLeft]}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    personCard: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        position: 'relative',
    },
    detailedCard: {
        borderWidth: 1,
        borderColor: '#FFD700',
        width: 120,
        height: 160,
        backgroundColor: 'white',
    },
    simpleCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        width: 100,
        height: 140,
        backgroundColor: '#fff',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 5,
    },
    nickname: {
        fontSize: 12,
        color: '#FFD700',
        marginBottom: 2,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    ageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    birthYear: {
        fontSize: 12,
        color: '#888',
    },
    age: {
        fontSize: 10,
        color: '#888',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 10,
    },
    addButton: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonTop: {
        top: -10,
        left: '50%',
        marginLeft: -10,
    },
    addButtonRight: {
        right: -10,
        top: '50%',
        marginTop: -10,
    },
    addButtonBottom: {
        bottom: -10,
        left: '50%',
        marginLeft: -10,
    },
    addButtonLeft: {
        left: -10,
        top: '50%',
        marginTop: -10,
    },
    addButtonText: {
        fontSize: 16,
        color: '#888',
    },
});

export default PersonCard;