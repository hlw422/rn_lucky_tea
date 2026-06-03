import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../../constants/colors';

export default function LoginMethodScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>欢迎来到瑞幸咖啡</Text>
        <Text style={styles.subtitle}>选择登录方式继续</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.wechatButton}
          onPress={() => {
            // 微信登录未实现
          }}
        >
          <Text style={styles.wechatIcon}>💬</Text>
          <Text style={styles.wechatText}>微信一键登录</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>或</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.emailButton}
          onPress={() => router.push('/login/mail')}
        >
          <Text style={styles.emailIcon}>📧</Text>
          <Text style={styles.emailText}>邮箱登录</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          登录即表示同意
          <Text 
            style={styles.linkText}
            onPress={() => router.push('/agreement')}
          >
            《用户协议》
          </Text>
          和
          <Text style={styles.linkText}>《隐私政策》</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 100,
    paddingBottom: 50,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: BrandColors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: BrandColors.textSecondary,
  },
  content: {
    paddingHorizontal: 30,
  },
  wechatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07C160',
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 30,
  },
  wechatIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  wechatText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: BrandColors.border,
  },
  dividerText: {
    marginHorizontal: 15,
    color: BrandColors.textSecondary,
    fontSize: 14,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.primary,
    paddingVertical: 14,
    borderRadius: 25,
  },
  emailIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  emailText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: BrandColors.textSecondary,
  },
  linkText: {
    color: BrandColors.primary,
  },
});
