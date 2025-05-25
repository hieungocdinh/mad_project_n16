import React, {useRef} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    Share,
    SafeAreaView,
} from 'react-native';
import {captureScreen} from 'react-native-view-shot';
import Person from "../../types/model/person";
import PersonCard from "../../components/PersonCard";
import ZoomableView from "../../components/ZoomableView";

interface DetailedFamilyTreeProps {
    people: Person[];
}

const DetailedFamilyTree = ({people}: DetailedFamilyTreeProps) => {
    const treeRef = useRef<View>(null);

    const onShareTree = async () => {
        try {
            const uri = await captureScreen({
                format: 'png',
                quality: 0.8,
            });
            await Share.share({
                title: 'Cây gia phả của tôi',
                message: 'Xem sơ đồ gia phả này nhé!',
                url: uri,
            });
        } catch (error) {
            console.warn('Không thể chia sẻ:', error);
        }
    };

    const findPerson = (id: number) =>
        people.find(p => p.id === id);

    const findCoupleChildren = (person: Person): Person[] => {
        const direct = people.filter(p => p.parentId === person.id);
        if (person.spouseId) {
            const spouseKids = people.filter(p => p.parentId === person.spouseId);
            return [
                ...direct,
                ...spouseKids.filter(k => !direct.some(d => d.id === k.id)),
            ];
        }
        return direct;
    };

    const renderCouple = (person: Person) => {
        if (person.spouseId && person.id > person.spouseId) return null;
        const spouse = person.spouseId && findPerson(person.spouseId);
        return (
            <View key={`couple-${person.id}`} style={styles.coupleContainer}>
                <View style={styles.personContainer}>
                    <PersonCard person={person} mode="detailed"/>
                </View>
                {spouse && (
                    <>
                        <View style={styles.spouseConnector}>
                            <View style={styles.horizontalLine}/>
                        </View>
                        <View style={styles.personContainer}>
                            <PersonCard person={spouse} mode="detailed"/>
                        </View>
                    </>
                )}
            </View>
        );
    };

    const renderFamilyTree = (person: Person): React.ReactNode => {
        if (person.spouseId && person.id > person.spouseId) return null;
        const children = findCoupleChildren(person).sort((a, b) => a.id - b.id);
        return (
            <View key={`family-${person.id}`} style={styles.familyContainer}>
                {renderCouple(person)}
                {children.length > 0 && (
                    <View style={styles.connectorWrapper}>
                        <View style={styles.verticalLine}/>
                        <View style={styles.horizontalLineLong}/>
                    </View>
                )}
                {children.length > 0 && (
                    <View style={styles.childrenRow}>
                        {children.map(child => (
                            <View key={child.id} style={styles.childTreeWrapper}>
                                {renderFamilyTree(child)}
                            </View>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    const rootPeople = people.filter(p => !p.parentId);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.outerContainer}>
                {/* Nút chia sẻ cố định */}
                <TouchableOpacity style={styles.shareButton} onPress={onShareTree}>
                    <Text style={styles.shareText}>Chia sẻ</Text>
                </TouchableOpacity>

                <ScrollView
                    horizontal
                    style={styles.flex}
                    contentContainerStyle={styles.flexGrow}
                >
                    <ScrollView
                        style={styles.flex}
                        contentContainerStyle={[styles.treeContainer, styles.flexGrow]}
                    >

                        <ZoomableView style={styles.flex}>
                            <View style={styles.rootRow}>
                                {rootPeople.map(root => renderFamilyTree(root))}
                            </View>
                        </ZoomableView>
                    </ScrollView>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    outerContainer: {
        flex: 1,
        position: 'relative', // để nút absolute nằm trên
    },
    flex: {
        flex: 1,
    },
    flexGrow: {
        flexGrow: 1,
    },
    treeContainer: {
        padding: 20,
        alignItems: 'center',
    },
    rootRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    familyContainer: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    coupleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    personContainer: {
        marginHorizontal: 5,
    },
    spouseConnector: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontalLine: {
        width: 20,
        height: 2,
        backgroundColor: '#888',
    },
    connectorWrapper: {
        alignItems: 'center',
    },
    verticalLine: {
        width: 2,
        height: 20,
        backgroundColor: '#888',
    },
    horizontalLineLong: {
        width: 100,
        height: 2,
        backgroundColor: '#888',
        marginTop: 2,
    },
    childrenRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    childTreeWrapper: {
        marginHorizontal: 10,
    },
    shareButton: {
        position: 'absolute',
        top: 0,
        left: 20,
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        zIndex: 10,
        elevation: 10,
        width: 85
    },
    shareText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default DetailedFamilyTree;
