import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Person from "../../types/model/person";
import PersonCard from "../../components/PersonCard";

interface SimpleFamilyTreeProps {
    people: Person[];
}

const SimpleFamilyTree = ({ people }: SimpleFamilyTreeProps) => {
    // --- 1. Group by generation ---
    const generations: { [gen: number]: Person[] } = {};
    let maxGen = 1;
    people.forEach(p => {
        if (!generations[p.generation]) generations[p.generation] = [];
        generations[p.generation].push(p);
        if (p.generation > maxGen) maxGen = p.generation;
    });

    // Helper: tìm Person theo id
    const find = (id: number) => people.find(p => p.id === id);

    // --- 2. Cho mỗi generation, build mảng các couple ---
    const buildCouples = (gen: number) => {
        const row = generations[gen] || [];
        const used = new Set<number>();
        const couples: Array<[Person, Person?]> = [];

        row.forEach(p => {
            if (used.has(p.id)) return;
            if (p.spouseId) {
                const s = find(p.spouseId);
                if (s) {
                    used.add(p.id);
                    used.add(s.id);
                    // đảm bảo chỉ tạo khi p.id < s.id để tránh duplicate
                    if (p.id < s.id) couples.push([p, s]);
                }
            } else {
                used.add(p.id);
                couples.push([p, undefined]);
            }
        });

        return couples;
    };

    // Render một hàng generation
    const renderGeneration = (gen: number) => {
        const couples = buildCouples(gen);

        return (
            <View key={`gen-${gen}`} style={styles.generationRow}>
                {couples.map(([p, s]) => (
                    <View key={p.id} style={styles.coupleContainer}>
                        <PersonCard person={p} mode="simple" />
                        {s && (
                            <>
                                <View style={styles.spouseConnector}>
                                    <View style={styles.horizontalLine} />
                                </View>
                                <PersonCard person={s} mode="simple" />
                            </>
                        )}
                    </View>
                ))}
            </View>
        );
    };

    // Render connector đứng xuống thế hệ sau
    const renderVerticalConnectors = (gen: number) => {
        const couples = buildCouples(gen);
        // nếu không couple nào có con thì không render
        if (!couples.some(([p, s]) => {
            const kidsP = people.filter(c => c.parentId === p.id);
            const kidsS = s ? people.filter(c => c.parentId === s.id) : [];
            return (kidsP.length + kidsS.length) > 0;
        })) return null;

        return (
            <View key={`conn-${gen}`} style={styles.connectorsRow}>
                {couples.map((_, idx) => (
                    <View key={idx} style={styles.verticalConnector} />
                ))}
            </View>
        );
    };

    // Build toàn bộ tree
    const tree: React.ReactNode[] = [];
    for (let i = 1; i <= maxGen; i++) {
        tree.push(renderGeneration(i));
        if (i < maxGen) {
            const vc = renderVerticalConnectors(i);
            if (vc) tree.push(vc);
        }
    }

    return <View style={styles.simpleFamilyTree}>{tree}</View>;
};

const styles = StyleSheet.create({
    simpleFamilyTree: {
        alignItems: 'center',
        paddingVertical: 16,
        width: '100%',
    },
    generationRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    coupleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        position: 'relative',
    },
    // nối ngang giữa hai người trong couple
    spouseConnector: {
        width: 24,
        height: 2,
        marginHorizontal: 4,
    },
    horizontalLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#FF0000',  // màu đỏ giống design
    },
    // hàng container cho các connector đứng, căn giữa mỗi couple
    connectorsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    verticalConnector: {
        width: 2,
        height: 24,
        backgroundColor: '#888',
        marginHorizontal:  12,
    },
});

export default SimpleFamilyTree;
