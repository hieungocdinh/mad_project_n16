import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Person from "../types/model/person";
import DetailedFamilyTree from "../screens/FamilyTree/DetailedFamilyTree";
import SimpleFamilyTree from "../screens/FamilyTree/SimpleFamilyTree";

interface FamilyTreeViewProps {
    persons: Person[];
    viewMode: 'detailed' | 'simple';
}

const FamilyTreeView = ({ persons, viewMode }: FamilyTreeViewProps) => {
    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
        >
            {viewMode === 'detailed' ? (
                <DetailedFamilyTree people={persons} />
            ) : (
                <SimpleFamilyTree people={persons} />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginTop: 40
    },
    scrollContent: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default FamilyTreeView;