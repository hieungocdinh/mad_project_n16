import React, {useCallback} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Share,
    StyleSheet,
    Image,
    FlatList,
    ListRenderItemInfo,
} from 'react-native';
import {captureScreen} from 'react-native-view-shot';
import Person from '../../types/model/person';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/root-stack-param';
import {RouteProp} from '@react-navigation/native';
import {useTranslation} from "react-i18next";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'FamilyStats'>;
    route: RouteProp<RootStackParamList, 'FamilyStats'>;
};

const FamilyStatsScreen: React.FC<Props> = ({navigation, route}) => {
    const {persons} = route.params;
    const totalMembers = persons.length;
    const {t} = useTranslation();
    // Phân bố theo thế hệ
    const generationCounts = persons.reduce<Record<number, number>>((acc, p) => {
        acc[p.generation] = (acc[p.generation] || 0) + 1;
        return acc;
    }, {});

    // Giá trị lớn nhất để tính tỷ lệ
    const maxCount =
        Object.values(generationCounts).length > 0
            ? Math.max(...Object.values(generationCounts))
            : 1;

    // Số thế hệ tối đa
    const maxGeneration =
        persons.length > 0 ? Math.max(...persons.map(p => p.generation)) : 0;

    // Chụp và chia sẻ báo cáo
    const onShareReport = useCallback(async () => {
        try {
            const uri = await captureScreen({format: 'png', quality: 0.9});
            await Share.share({
                title: 'Báo cáo thống kê gia phả',
                message: 'Hãy xem báo cáo thống kê cây gia phả của tôi!',
                url: uri,
            });
        } catch (err) {
            console.warn('Không thể chia sẻ báo cáo:', err);
        }
    }, []);

    // Render mỗi thành viên
    const renderPerson = ({item}: ListRenderItemInfo<Person>) => (
        <View style={styles.personCard}>
            <Image source={{uri: item.avatarUrl}} style={styles.avatar}/>
            <View style={styles.personInfo}>
                <Text style={styles.personName}>{item.name}</Text>
                <Text style={styles.personGen}>{t('generationLabel', { gen: item.generation })}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>‹ Trở lại</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('familyStatsTitle')}</Text>
                <TouchableOpacity onPress={onShareReport} style={styles.shareHeaderBtn}>
                    <Text style={styles.shareHeaderText}>{t('share')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Stats Summary */}
                <View style={[styles.card, styles.statsCard]}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalMembers}</Text>
                        <Text style={styles.statLabel}>{t('members')}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{maxGeneration + 1}</Text>
                        <Text style={styles.statLabel}>{t('generations')}</Text>
                    </View>
                </View>

                {/* Generation Distribution */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t('distributionByGeneration')}</Text>
                    <View style={styles.distribution}>
                        {Object.entries(generationCounts).map(([gen, count]) => (
                            <View key={gen} style={styles.distributionItem}>
                                <Text style={styles.distLabel}>{t('genLabel', { gen })}</Text>
                                <View style={styles.distBarContainer}>
                                    <View
                                        style={[
                                            styles.distBar,
                                            {width: `${(count / maxCount) * 100}%`},
                                        ]}
                                    />
                                </View>
                                <Text style={styles.distCount}>{count}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Member List */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>{t('memberList')}</Text>
                    <FlatList
                        data={persons}
                        keyExtractor={p => p.id.toString()}
                        renderItem={renderPerson}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#EFEFF4'},
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        elevation: 4,
    },
    backButton: {padding: 8},
    backText: {fontSize: 16, color: '#007AFF'},
    headerTitle: {fontSize: 18, fontWeight: '600'},
    shareHeaderBtn: {padding: 8},
    shareHeaderText: {fontSize: 16, color: '#007AFF'},
    content: {padding: 16, paddingBottom: 32},
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    statsCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {alignItems: 'center'},
    statValue: {fontSize: 28, fontWeight: '700', color: '#333'},
    statLabel: {fontSize: 14, color: '#666'},
    cardTitle: {fontSize: 16, fontWeight: '600', marginBottom: 12},
    distribution: {marginTop: 8},
    distributionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    distLabel: {width: 50, fontSize: 14, color: '#333'},
    distBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        marginHorizontal: 8,
        overflow: 'hidden',
    },
    distBar: {
        height: '100%',
        backgroundColor: '#007AFF',
    },
    distCount: {width: 30, textAlign: 'right', fontSize: 14, color: '#333'},
    personCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {width: 48, height: 48, borderRadius: 24, marginRight: 12},
    personInfo: {flex: 1},
    personName: {fontSize: 16, fontWeight: '600', color: '#333'},
    personGen: {fontSize: 13, color: '#999'},
});

export default FamilyStatsScreen;