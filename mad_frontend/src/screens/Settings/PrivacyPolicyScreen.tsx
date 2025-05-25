import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chính Sách Bảo Mật</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Thông tin thu thập</Text>
        <Text style={styles.text}>
          Ứng dụng thu thập thông tin như họ tên, email, ngày sinh, ảnh và các dữ liệu liên quan đến thành viên trong cây gia phả.
        </Text>

        <Text style={styles.sectionTitle}>2. Mục đích sử dụng</Text>
        <Text style={styles.text}>
          Thông tin được sử dụng để hiển thị cây gia phả, gửi thông báo sự kiện và cải thiện trải nghiệm người dùng.
        </Text>

        <Text style={styles.sectionTitle}>3. Bảo mật thông tin</Text>
        <Text style={styles.text}>
          Chúng tôi sử dụng các biện pháp bảo mật như mã hóa dữ liệu và truyền tải qua HTTPS để đảm bảo an toàn.
        </Text>

        <Text style={styles.sectionTitle}>4. Quyền của người dùng</Text>
        <Text style={styles.text}>
          Bạn có thể yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân bất cứ lúc nào.
        </Text>

        <Text style={styles.sectionTitle}>5. Liên hệ</Text>
        <Text style={styles.text}>
          Mọi thắc mắc vui lòng liên hệ qua email:
          {"\n"}
          duybinhh03@gmail.com
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    backgroundColor: '#f5f7fa',
    paddingBottom: 40,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    color: '#1e88e5',
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    shadowColor: '#1e88e5',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 12, 
    color: '#1e88e5',
    borderLeftWidth: 3,
    borderLeftColor: '#1e88e5',
    paddingLeft: 8,
    marginBottom: 2,
  },
  text: { 
    fontSize: 16, 
    lineHeight: 22, 
    marginTop: 4, 
    color: '#222',
  },
});

export default PrivacyPolicyScreen;