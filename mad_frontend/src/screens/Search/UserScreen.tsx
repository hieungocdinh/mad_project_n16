import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/root-stack-param';
import userApi from '../../api/userApi';
import UserResponse from '../../types/response/user-response';
import profileApi from '../../api/profileApi';
import authApi from '../../api/authApi';

type SearchUserRouteProp = RouteProp<RootStackParamList, 'SearchUser'>;
type SearchUserNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchUser'>;

const defaultAvatar = require('../../../assets/default-avatar.png');

// Modal thêm user mới
const AddUserModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onUserCreated: (newUser: UserResponse) => void;
}> = ({ visible, onClose, onUserCreated }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!username.trim() || !email.trim()) {
      Alert.alert('Vui lòng nhập đủ username và email');
      return;
    }
    setLoading(true);
    try {
      const res = await userApi.saveUser({username, email});
      onUserCreated(res.data);
      setUsername('');
      setEmail('');
      onClose();
      Alert.alert('Tạo user thành công!');
    } catch (error) {
      Alert.alert('Lỗi khi tạo user. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Thêm User Mới</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.modalButton, loading && { backgroundColor: '#ccc' }]}
            onPress={handleCreateUser}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.modalButtonText}>Tạo</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Modal sửa user
const EditUserModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  user: UserResponse | null;
  onUserUpdated: (updatedUser: UserResponse) => void;
}> = ({ visible, onClose, user, onUserUpdated }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [loading, setLoading] = useState(false);

  // Khi user thay đổi (mở modal mới), cập nhật form
  useEffect(() => {
    setUsername(user?.username ?? '');
    setEmail(user?.email ?? '');
  }, [user]);

  const handleUpdateUser = async () => {
    if (!username.trim() || !email.trim()) {
      Alert.alert('Vui lòng nhập đủ username và email');
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      const res = await userApi.saveUser({ id: user.userId, username, email });
      onUserUpdated(res.data);
      onClose();
      Alert.alert('Cập nhật user thành công!');
    } catch (error) {
      Alert.alert('Lỗi khi cập nhật user. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Sửa User</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[styles.modalButton, loading && { backgroundColor: '#ccc' }]}
            onPress={handleUpdateUser}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.modalButtonText}>Lưu</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const UserItem: React.FC<{
  user: UserResponse;
  onDeleteUser: (userId: number) => void;
  onEditUser: (user: UserResponse) => void;
  currentUserId: number | null;
  navigation: any; // Thêm navigation
}> = ({ user, onDeleteUser, onEditUser, currentUserId, navigation }) => {
  const { t } = useTranslation();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (user.profileId) {
      setLoadingAvatar(true);
      profileApi.getProfileDetail(user.profileId)
        .then(res => {
          if (isMounted && res.data.avatarUrl) {
            setAvatarUrl(res.data.avatarUrl);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingAvatar(false));
    }
    return () => { isMounted = false; };
  }, [user.profileId]);

  const handleEdit = () => {
    onEditUser(user);
  };

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc muốn xoá user ${user.username}?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              await userApi.deleteUser(user.userId);
              Alert.alert('Xoá thành công user ' + user.username);
              onDeleteUser(user.userId);
            } catch {
              Alert.alert('Lỗi khi xoá user. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };


const handleGoToProfile = () => {
    if (user.profileId) {
      navigation.navigate('ProfileDetailView', { profileId: user.profileId });
    } else {
      Alert.alert('User này chưa có profile!');
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
        activeOpacity={0.7}
        onPress={handleGoToProfile}
      >
        {loadingAvatar ? (
          <ActivityIndicator style={styles.avatar} />
        ) : (
          <Image
            source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
            style={styles.avatar}
            resizeMode="cover"
          />
        )}
        <Text style={styles.username}>{user.username}</Text>
      </TouchableOpacity>
      <View style={styles.actionButtonsColumn}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.buttonText}>{t('edit')}</Text>
        </TouchableOpacity>
        {user.userId !== currentUserId && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>{t('delete')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const UserScreen: React.FC = () => {
  const navigation = useNavigation<SearchUserNavigationProp>();
  const route = useRoute<SearchUserRouteProp>();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userEditing, setUserEditing] = useState<UserResponse | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await authApi.getCurrentUser();
                setCurrentUserId(user.userId); 
            } catch (error) {
                setCurrentUserId(null);
            }
        };
        fetchCurrentUser();
    }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.searchUsers(searchTerm, 0, 10);
      const list = res.data.content ?? res.data;
      setUsers(sortUsers(list));
    } catch (err) {
      console.error('Search error:', err);
      Alert.alert(t('error_loading_users'));
    } finally {
      setLoading(false);
    }
  };

  const sortUsers = (data: UserResponse[]) => {
    return [...data].sort((a, b) => {
      const nameA = a.username.toLowerCase();
      const nameB = b.username.toLowerCase();
      return sortOrder === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setUsers(prev => sortUsers(prev));
  };

  const handleDeleteUser = (deletedUserId: number) => {
    setUsers(prevUsers => prevUsers.filter(user => user.userId !== deletedUserId));
  };

  const handleUserCreated = (newUser: UserResponse) => {
    setUsers(prev => sortUsers([...prev, newUser]));
  };

  const handleUserUpdated = (updatedUser: UserResponse) => {
    setUsers(prev =>
      sortUsers(
        prev.map(user => (user.userId === updatedUser.userId ? updatedUser : user))
      )
    );
  };

  const handleEditUser = (user: UserResponse) => {
    setUserEditing(user);
    setEditModalVisible(true);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.inputSearch}
            placeholder={t('search_by_username')}
            value={searchTerm}
            onChangeText={setSearchTerm}
            returnKeyType="search"
            onSubmitEditing={loadUsers}
            placeholderTextColor="#888"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Ionicons name="close-circle" size={18} color="#bbb" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={loadUsers}>
          <Text style={styles.buttonText}>{t('search')}</Text>
        </TouchableOpacity>
      </View>

      {/* Sắp xếp và nút tạo user mới trên cùng một hàng */}
      <View style={styles.sortAddRow}>
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>{t('sort_by_name')}</Text>
          <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
            <Ionicons
              name={sortOrder === 'asc' ? 'arrow-up-outline' : 'arrow-down-outline'}
              size={24}
              color="#1976d2"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={36} color="#1976d2" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1976d2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.userId.toString()}
          renderItem={({ item }) => (
            <UserItem
              user={item}
              onDeleteUser={handleDeleteUser}
              onEditUser={handleEditUser}
              currentUserId={currentUserId}
              navigation={navigation}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <AddUserModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onUserCreated={handleUserCreated}
      />

      <EditUserModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        user={userEditing}
        onUserUpdated={handleUserUpdated}
      />
    </View>
  );
}

export default UserScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 7,
    marginRight: 8,
    height: 40,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 6,
  },
  inputSearch: {
    flex: 1,
    fontSize: 11,
    color: '#222',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  searchButton: {
    flex: 3,
    backgroundColor: '#1e88e5',
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButtonsColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch', // Đảm bảo hai nút cùng chiều rộng
    gap: 8,
    marginLeft: 8,
    minWidth: 80, // Đảm bảo chiều rộng tối thiểu cho nút
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sortLabel: { fontSize: 14, marginRight: 10 },
  sortButton: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sortText: { fontSize: 16, color: '#333' },

  sortAddRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  username: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#1e88e5',
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: 6,
    marginRight: 0,
    alignItems: 'center',
    width: '100%', // Nút chiếm toàn bộ chiều rộng cột
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderRadius: 6,
    alignItems: 'center',
    width: '100%', // Nút chiếm toàn bộ chiều rộng cột
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  addButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalClose: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});