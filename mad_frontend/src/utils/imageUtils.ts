import * as ImagePicker from 'expo-image-picker';
import {AlertType, useAlert} from "../context/alertContext";

// Hàm showAlert bạn có thể thay bằng hàm showAlert hiện tại của bạn

// Hàm xin quyền truy cập thư viện ảnh
export const requestGalleryPermission = async (
    onDenied?: () => void
): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const {showAlert} = useAlert();
    if (status !== 'granted') {
        if (onDenied) onDenied();
        else
            showAlert(
                'Error',
                'You need to grant gallery permission to select images.',
                AlertType.ERROR
            );
        return false;
    }
    return true;
};

// Hàm chọn ảnh từ thư viện, trả về URI ảnh hoặc null nếu huỷ
export const pickImageFromGallery = async (
    options?: Partial<ImagePicker.ImagePickerOptions>
): Promise<string | null> => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        ...options,
    });

    if (result.canceled) {
        console.log('User cancelled image selection');
        return null;
    }

    if (result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
    }

    return null;
};
