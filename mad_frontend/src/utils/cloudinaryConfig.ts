import { Platform } from 'react-native';

import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET} from "@env";

export const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
    try {
        // URL tải lên của Cloudinary
        const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

        // Chuẩn bị form data
        const formData = new FormData();

        // Xử lý URI cho phù hợp với iOS và Android
        const uri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;

        // Lấy tên và loại file
        const filename = uri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Thêm file vào form data
        formData.append('file', {
            uri,
            name: filename,
            type,
        } as any);

        // Thêm upload preset - điều này cho phép tải lên mà không cần API key trực tiếp trong mã
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        // Tùy chọn: thêm các tham số khác nếu cần
        formData.append('folder', 'family_stories');

        // Gửi yêu cầu tải lên
        const response = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        });

        // Phân tích kết quả
        const data = await response.json();

        // Kiểm tra lỗi
        if (!response.ok) {
            throw new Error(data.error?.message || 'Lỗi khi tải lên Cloudinary');
        }

        // Trả về URL của ảnh đã tải lên
        return data.secure_url;
    } catch (error) {
        console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
        throw error;
    }
};