import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

import type { FamilyTreeDetailTabParam } from '../../types/family-tree-detail-tab-param';
import type FamilyTreeResponse from '../../types/response/familyTree-response';
import type FamilyTreeFamilyResponse from '../../types/response/familyTree-family-response';
import FamilyApi from '../../api/familyApi';
import FamilyTreeApi from '../../api/familyTreeApi';

import type FamilyResponse from '../../types/response/family-response';
import type Person from '../../types/model/person';
import FamilyTreeView from '../../components/FamilyTreeView';
import ProfileApi from '../../api/profileApi';
import UserResponse from '../../types/response/user-response';

type Props = BottomTabScreenProps<FamilyTreeDetailTabParam, 'FamilyTreeEdit'>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FamilyTreeEditScreen({ route, navigation }: Props) {
    const { familyTreeId } = route.params;
    const { t } = useTranslation();

    const [tree, setTree] = useState<FamilyTreeResponse | null>(null);
    const [families, setFamilies] = useState<FamilyResponse[]>([]);
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const treeResp = await FamilyTreeApi.getFamilyTreeDetail(familyTreeId);
                const treeData = treeResp.data;
                setTree(treeData);

                const fams: FamilyResponse[] = await Promise.all(
                    treeData.families.map(async (f: FamilyTreeFamilyResponse) => {
                        const family = await FamilyApi.getFamilyById(f.familyId);
                        return family.data;
                    })
                );
                setFamilies(fams);

                const idsToFetch = new Set<number>();
                treeData.families.forEach((fMeta: FamilyTreeFamilyResponse, idx: number) => {
                    const fam = fams[idx];
                    if (fam.husband) idsToFetch.add(fam.husband.userId);
                    if (fam.wife) idsToFetch.add(fam.wife.userId);
                    (fam.childIds || []).forEach(id => idsToFetch.add(id));
                });

                const profiles = await Promise.all(
                    Array.from(idsToFetch).map(async userId => {
                        try {
                            const resp = await ProfileApi.getProfileDetail(userId);
                            return { userId, avatarUrl: resp.data.avatarUrl || '' };
                        } catch {
                            return { userId, avatarUrl: '' };
                        }
                    })
                );
                const avatarMap = new Map<number, string>(
                    profiles.map(p => [p.userId, p.avatarUrl])
                );

                const parentMapHusband = new Map<number, number>();
                const parentMapWife = new Map<number, number>();
                treeData.families.forEach((fMeta: FamilyTreeFamilyResponse, idx: number) => {
                    const fam = fams[idx];
                    const thisParentIdHusband = fam.husband?.userId ?? fam.wife?.userId;
                    const thisParentIdWife = fam.wife?.userId ?? fam.husband?.userId;
                    (fam.childIds || []).forEach(childId => {
                        parentMapHusband.set(childId, thisParentIdHusband);
                        parentMapWife.set(childId, thisParentIdWife);
                    });
                });

                const personsList: Person[] = [];
                treeData.families.forEach((fMeta: FamilyTreeFamilyResponse, idx: number) => {
                    const fam = fams[idx];
                    const gen = fMeta.generation;

                    if (fam.husband) {
                        personsList.push({
                            id: fam.husband.userId,
                            name: fam.husband.username,
                            avatarUrl: avatarMap.get(fam.husband.userId) || '',
                            generation: gen,
                            spouseId: fam.wife?.userId,
                            parentId: parentMapHusband.get(fam.husband.userId) ?? parentMapHusband.get(fam.wife?.userId),
                            childrenIds: fam.childIds || [],
                        });
                    }

                    if (fam.wife) {
                        personsList.push({
                            id: fam.wife.userId,
                            name: fam.wife.username,
                            avatarUrl: avatarMap.get(fam.wife.userId) || '',
                            generation: gen,
                            spouseId: fam.husband?.userId,
                            parentId: parentMapWife.get(fam.wife.userId) ?? parentMapWife.get(fam.husband?.userId),
                            childrenIds: fam.childIds || [],
                        });
                    }

                    (fam.childIds || []).forEach(childId => {
                        personsList.push({
                            id: childId,
                            name: String(childId),
                            avatarUrl: avatarMap.get(childId) || '',
                            generation: gen + 1,
                            spouseId: undefined,
                            parentId: parentMapHusband.get(childId) ?? parentMapWife.get(childId),
                            childrenIds: [],
                        });
                    });
                });

                const uniquePersons = Array.from(
                    new Map(personsList.map(p => [p.id, p])).values()
                );

                setPersons(uniquePersons);
                setLoading(false);
            } catch (e: any) {
                setError(e.message || t('Error loading data'));
                setLoading(false);
            }
        }

        loadData();
    }, [familyTreeId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>{t('Loading family tree...')}</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.statsButton}
                onPress={() => {
                    // console.log(persons);
                    navigation.navigate('FamilyStats', { persons })
                }}
            >
                <Text style={styles.statsText}>Thống kê</Text>
            </TouchableOpacity>

            <FamilyTreeView
                persons={persons}
                viewMode="detailed"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 10 , marginTop: 40},
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: { marginTop: 10, fontSize: 16, color: '#333' },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    errorText: { fontSize: 16, color: '#ff3b30', textAlign: 'center' },
    statsButton: {
        position: 'absolute',
        top: 10,
        left: 20,
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        zIndex: 10,
        elevation: 5,
    },
    statsText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
