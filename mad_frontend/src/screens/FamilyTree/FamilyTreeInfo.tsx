// src/screens/FamilyTreeInfoScreen.tsx
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image,
    FlatList,
    Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';

import FamilyTreeRequest from '../../types/request/familyTree-request';
import {FamilyTreeDetailTabParam} from '../../types/family-tree-detail-tab-param';
import FamilyTreeApi from '../../api/familyTreeApi';
import FamilyResponse from '../../types/response/family-response';
import FamilyTreeFamily from "../../types/model/familyTree-family";
import Family from "../../types/model/family";
import UserResponse from "../../types/response/user-response";
import User from "../../types/model/user";
import ProfileApi from "../../api/profileApi";
import FamilyApi from "../../api/familyApi";
import FamilyTreeFamilyResponse from "../../types/response/familyTree-family-response";

type Props = BottomTabScreenProps<FamilyTreeDetailTabParam, 'FamilyTreeInfo'>;
const {width} = Dimensions.get('window');

const FamilyTreeInfoScreen: React.FC<Props> = ({navigation, route}) => {
    const {familyTreeId} = route.params;
    const {t} = useTranslation();

    // Form fields
    const [familyTreeAvatar, setFamilyTreeAvatar] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [generationNumbers, setGenerationNumbers] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(!!familyTreeId);

    // New: families per generation
    const [familiesByGen, setFamiliesByGen] = useState<FamilyTreeFamily[][]>([]);


    useEffect(() => {
        if (!familyTreeId) {
            setInitialLoading(false);
            return;
        }
        (async () => {
            try {
                const res = await FamilyTreeApi.getFamilyTreeDetail(familyTreeId);
                const tree = res.data;
                setName(tree.name);
                setAge(tree.age.toString());
                setGenerationNumbers(tree.generationNumbers?.toString() ?? '');
                setFamilyTreeAvatar(tree.avatarUrl ?? null);
                if (Array.isArray(tree.families)) {
                    const gens = tree.generationNumbers;
                    const init: FamilyTreeFamily[][] = Array.from({length: gens}, () => []);

                    const loadFamilies = async () => {
                        const fullFamilies = await Promise.all(
                            tree.families.map(async (ftfResp: FamilyTreeFamilyResponse): Promise<FamilyTreeFamily | null> => {
                                try {
                                    const res = await FamilyApi.getFamilyById(ftfResp.familyId);
                                    const family: FamilyResponse = res.data;
                                    // console.log(family)
                                    return {
                                        id: ftfResp.id,
                                        generation: ftfResp.generation,
                                        family: await mapFamilyResponse(family),
                                    };
                                } catch (error) {
                                    console.warn(`Lỗi khi lấy family ${ftfResp.familyId}:`, error);
                                    return null;
                                }
                            })
                        );

                        fullFamilies
                            .filter((ftf): ftf is FamilyTreeFamily => ftf !== null)
                            .forEach((ftf) => {
                                init[ftf.generation - 1]?.push(ftf);
                            });

                        setFamiliesByGen(init);
                    };

                    loadFamilies();
                }
                console.log(familiesByGen);
            } catch (err) {
                console.error('Load detail failed', err);
                Alert.alert(t('error_loading_detail', 'Không tải được chi tiết'));
            } finally {
                setInitialLoading(false);
            }
        })();
    }, [familyTreeId, t]);

    // Re-init familiesByGen when generationNumbers changes
    useEffect(() => {
        const num = parseInt(generationNumbers, 10);
        if (!isNaN(num) && num > 0) {
            setFamiliesByGen(prev => {
                const copy = prev.slice(0, num);
                while (copy.length < num) copy.push([]);
                return copy;
            });
        }
    }, [generationNumbers]);

    const validate = (): boolean => {
        if (!name.trim()) {
            Alert.alert(t('family_tree_create.name_required', 'Vui lòng nhập tên gia phả'));
            return false;
        }
        if (!age.trim() || isNaN(Number(age))) {
            Alert.alert(t('family_tree_create.age_required', 'Tuổi không hợp lệ'));
            return false;
        }
        const gen = Number(generationNumbers);
        if (!generationNumbers.trim() || isNaN(gen) || gen <= 0) {
            Alert.alert(t('family_tree_create.gen_required', 'Số thế hệ không hợp lệ'));
            return false;
        }
        return true;
    };

    const pickFamilyImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
        });
        if (!result.canceled) {
            setFamilyTreeAvatar(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!validate()) return;
        setLoading(true);

        const payload: FamilyTreeRequest = {
            id: familyTreeId ? Number(familyTreeId) : undefined,
            name: name.trim(),
            age: Number(age),
            avatarUrl: familyTreeAvatar ?? '',
            generationNumbers: Number(generationNumbers),
            family: familiesByGen.flat(),
        };

        try {
            await FamilyTreeApi.saveFamilyTree(payload);
            Alert.alert(t('family_tree_create.success', 'Lưu gia phả thành công'));
            navigation.goBack();
        } catch (err) {
            console.error(err);
            Alert.alert(t('family_tree_create.error', 'Có lỗi xảy ra, thử lại sau'));
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (genIdx: number) => {
        navigation.navigate('FamilySelect', {
            generationIdx: genIdx,
            onSelect: (familyResponse: FamilyResponse) => {
                handleFamilyResponse(genIdx, familyResponse);
            },
        });
    };

    const handleFamilyResponse = async (genIdx: number, familyResponse: FamilyResponse) => {
        const alreadyExists = familiesByGen.some(genList =>
            genList.some(f => f.family.id === familyResponse.id)
        );

        if (alreadyExists) {
            Alert.alert(
                'Không thể thêm',
                'Gia đình này đã được thêm vào cây gia phả và không thể thêm lại.'
            );
            return;
        }

        const familyObj: FamilyTreeFamily = {
            id: Date.now(),
            generation: genIdx + 1,
            family: await mapFamilyResponse(familyResponse),
        };

        setFamiliesByGen(prev => {
            const copy = [...prev];
            copy[genIdx] = [...copy[genIdx], familyObj];
            return copy;
        });
    };


    const mapFamilyResponse = async (resp: FamilyResponse): Promise<Family> => {
        return {
            id: resp.id,
            name: resp.name,
            husband: await mapUser(resp.husband),
            wife: await mapUser(resp.wife),
            avatarUrl: resp.avatarUrl,
            childIds: resp.childIds,
            status: 'ACCEPTED',
        };
    };

    const mapUser = async (userResp: UserResponse): Promise<User> => {
        const prof = await ProfileApi.getProfileDetail(userResp.profileId);
        return {
            id: userResp.userId,
            username: userResp.username,
            email: userResp.email,
            roles: userResp.roles,
            familyIds: userResp.familyIds,
            profileId: userResp.profileId,
            avatarUrl: prof.data?.avatarUrl || '',
        };
    };


    if (initialLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        {familyTreeId
                            ? t('family_tree_edit.title', 'Cập nhật gia phả')
                            : t('family_tree_create.title', 'Tạo mới gia phả')}
                    </Text>
                </View>

                {/* Avatar */}
                <TouchableOpacity style={styles.avatarBox} onPress={pickFamilyImage}>
                    {familyTreeAvatar ? (
                        <Image source={{uri: familyTreeAvatar}} style={styles.avatarImage}/>
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Icon name="image-outline" size={40} color="#999"/>
                            <Text style={styles.avatarText}>{t('family_tree_create.add_avatar', 'Thêm ảnh')}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Basic fields */}
                <View style={styles.formGroup}>
                    <Text style={styles.label}>{t('family_tree_create.name', 'Tên gia phả')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('family_tree_create.name_placeholder', 'Nhập tên')}
                        value={name}
                        onChangeText={setName}
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>{t('family_tree_create.age', 'Tuổi')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('family_tree_create.age_placeholder', 'Nhập tuổi')}
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>{t('family_tree_create.gen_numbers', 'Số thế hệ')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('family_tree_create.gen_numbers_placeholder', 'Nhập số thế hệ')}
                        value={generationNumbers}
                        onChangeText={setGenerationNumbers}
                        keyboardType="numeric"
                    />
                </View>

                {familiesByGen.map((list, idx) => (
                    <View key={idx} style={styles.addRow}>
                        <Text style={styles.genLabel}>{`Thế hệ ${idx + 1}`}</Text>
                        <FlatList
                            horizontal
                            data={list}
                            keyExtractor={ftf => ftf.family.id.toString()}
                            renderItem={({item: ftf}) => (
                                <View style={styles.avatarWrapper}>
                                    <Image
                                        source={{uri: ftf.family.avatarUrl}}
                                        style={styles.avatarThumb}
                                    />
                                    {/* nút xóa */}
                                    <TouchableOpacity
                                        style={styles.deleteIcon}
                                        onPress={() =>
                                            Alert.alert(
                                                'Xác nhận',
                                                'Bạn có chắc muốn xóa gia đình này?',
                                                [
                                                    {text: 'Hủy', style: 'cancel'},
                                                    {
                                                        text: 'Xóa',
                                                        style: 'destructive',
                                                        onPress: () =>
                                                            setFamiliesByGen(prev => {
                                                                const copy = [...prev];
                                                                copy[idx] = copy[idx].filter(f => f.id !== ftf.id);
                                                                return copy;
                                                            }),
                                                    },
                                                ]
                                            )
                                        }
                                    >
                                        <Icon name="close-circle" size={18} color="#f00"/>
                                    </TouchableOpacity>
                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                        />
                        <TouchableOpacity style={styles.addBtn} onPress={() => handleSelect(idx)}>
                            <Icon name="add-circle-outline" size={28} color="#007bff"/>
                        </TouchableOpacity>
                    </View>
                ))}


                {/* Save button */}
                {loading ? (
                    <ActivityIndicator size="large"/>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Icon name="save-outline" size={20} color="#fff"/>
                        <Text style={styles.buttonText}>
                            {familyTreeId
                                ? t('family_tree_edit.save', 'Cập nhật')
                                : t('family_tree_create.save', 'Lưu')}
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {flex: 1, backgroundColor: '#fff'},
    scroll: {flexGrow: 1},
    container: {padding: 16, backgroundColor: '#fff', flexGrow: 1, marginTop: 40},
    center: {flex: 1, justifyContent: 'center', alignItems: 'center'},

    header: {backgroundColor: '#007bff', paddingVertical: 14, alignItems: 'center', borderRadius: 4, marginBottom: 20},
    headerText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},

    avatarBox: {
        alignSelf: 'center',
        marginBottom: 20,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    avatarImage: {width: 120, height: 120},
    avatarPlaceholder: {justifyContent: 'center', alignItems: 'center'},
    avatarText: {marginTop: 6, color: '#999'},

    formGroup: {marginBottom: 16},
    label: {marginBottom: 6, fontSize: 14, fontWeight: '600'},
    input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8},

    addRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
    genLabel: {width: 90, fontSize: 16, fontWeight: '600'},
    avatarThumb: {width: 40, height: 40, borderRadius: 20, marginHorizontal: 4},
    addBtn: {marginLeft: 'auto'},

    button: {
        flexDirection: 'row',
        backgroundColor: '#FF8C00',
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24
    },
    buttonText: {color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8},
    avatarWrapper: {
        marginHorizontal: 4,
        position: 'relative',
    },
    deleteIcon: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
});

export default FamilyTreeInfoScreen;
