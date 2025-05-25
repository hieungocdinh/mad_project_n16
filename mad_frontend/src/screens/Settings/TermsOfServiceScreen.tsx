import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const TermsOfServiceScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Điều Khoản Sử Dụng</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Giới thiệu</Text>
        <Text style={styles.text}>
          Ứng dụng cây gia phả cho phép người dùng tạo, quản lý và chia sẻ cây gia đình của mình một cách dễ dàng.
        </Text>

        <Text style={styles.sectionTitle}>2. Quyền và trách nhiệm</Text>
        <Text style={styles.text}>
          Người dùng chịu trách nhiệm về nội dung đã nhập. Không được sử dụng ứng dụng cho mục đích bất hợp pháp hoặc gây rối.
        </Text>

        <Text style={styles.sectionTitle}>3. Sở hữu nội dung</Text>
        <Text style={styles.text}>
          Bạn giữ quyền sở hữu dữ liệu cá nhân. Chúng tôi không chia sẻ thông tin của bạn với bên thứ ba khi chưa được phép.
        </Text>

        <Text style={styles.sectionTitle}>4. Chấm dứt tài khoản</Text>
        <Text style={styles.text}>
          Người dùng có thể xóa tài khoản bất kỳ lúc nào. Chúng tôi có quyền khóa tài khoản nếu vi phạm điều khoản.
        </Text>

        <Text style={styles.sectionTitle}>5. Cập nhật điều khoản</Text>
        <Text style={styles.text}>
          Chúng tôi có thể thay đổi điều khoản sử dụng và sẽ thông báo đến bạn khi cần thiết.
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

export default TermsOfServiceScreen;