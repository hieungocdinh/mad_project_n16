// ZoomableView.tsx
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import {
    Gesture,
    GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    AnimateStyle,
} from 'react-native-reanimated';

interface ZoomableViewProps {
    children: React.ReactNode;
    style?: AnimateStyle<ViewStyle>[] | AnimateStyle<ViewStyle>;
}

const ZoomableView: React.FC<ZoomableViewProps> = ({ children, style }) => {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            offsetX.value = translateX.value;
            offsetY.value = translateY.value;
        })
        .onUpdate(e => {
            translateX.value = offsetX.value + e.translationX;
            translateY.value = offsetY.value + e.translationY;
        });

    const pinchGesture = Gesture.Pinch()
        .onUpdate(e => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    const gesture = Gesture.Simultaneous(panGesture, pinchGesture);

    const animatedStyle = useAnimatedStyle<AnimateStyle<ViewStyle>>(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale:      scale.value      },
        ],
    }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View
                style={[styles.container, style as any, animatedStyle]}
            >
                {children}
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ZoomableView;
