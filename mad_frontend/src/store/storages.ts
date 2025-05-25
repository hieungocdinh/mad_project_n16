import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_TOKEN_KEY = 'USER_TOKEN';
const USER_DATA_KEY = 'USER_DATA';

const storage = {
    save: async (key: string, value: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    },

    get: async (key: string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            if(value) {
                return JSON.parse(value);
            }
            return null;
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return null;
        }
    },

    remove: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
        }
    },
};

export const saveToken = async (token: string) => {
    await storage.save(USER_TOKEN_KEY, token);
};

export const getToken = async () => {
    return await storage.get(USER_TOKEN_KEY);
};

export const removeToken = async () => {
    await storage.remove(USER_TOKEN_KEY);
};

export const saveUserData = async (userData: any) => {
    await storage.save(USER_DATA_KEY, userData);
};

export const getUserData = async () => {
    return await storage.get(USER_DATA_KEY);
};