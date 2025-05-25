import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

type Member = {
    name: string;
    role: string;
};

const TreeView: React.FC = () => {
    const {t} = useTranslation();

    const mockTree: Member[] = [
        {name: 'Ông A', role: 'Ông nội'},
        {name: 'Cha B', role: 'Bố'},
        {name: 'Bạn', role: 'Con'},
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{t('view_tree')}</Text>
            {mockTree.map((member, index) => (
                <View key={index} style={styles.memberCard}>
                    <Text style={styles.name}>{member.name}</Text>
                    <Text style={styles.role}>{member.role}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

export default TreeView;

const styles = StyleSheet.create({
    container: {padding: 20},
    header: {fontSize: 22, fontWeight: 'bold', marginBottom: 10},
    memberCard: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {fontSize: 18},
    role: {fontSize: 14, color: 'gray'},
});
