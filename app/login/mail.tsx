import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../../constants/colors';
import { useAuthStore } from '../../stores/auth-store';
import { Button } from '../../components/ui/Button';

export default function LoginMailScreen() {
  const router = useRouter();
  const { login, register, isLoading, error, clearError } = useAuthStore();
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('提示', '请填写邮箱和密码');
      return;
    }

    if (isRegister && !name) {
      Alert.alert('提示', '请填写用户名');
      return;
    }

    try {
      if (isRegister) {
        await register(email, password, name);
        Alert.alert('提示', '注册成功');
      } else {
        await login(email, password);
        Alert.alert('提示', '登录成功');
      }
      router.back();
    } catch (err: any) {
      Alert.alert('错误', err.message || '操作失败，请重试');
    }
  };

  const handleTestLogin = () => {
    setEmail('test@luckin.com');
    setPassword('123456');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{isRegister ? '注册' : '登录'}</Text>
          <Text style={styles.subtitle}>
            {isRegister ? '创建您的瑞幸账号' : '欢迎回来'}
          </Text>
        </View>

        <View style={styles.form}>
          {isRegister && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>用户名</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入用户名"
                placeholderTextColor={BrandColors.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>邮箱</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入邮箱"
              placeholderTextColor={BrandColors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>密码</Text>
            <TextInput
              style={styles.input}
              placeholder="请输入密码"
              placeholderTextColor={BrandColors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Button
            title={isRegister ? '注册' : '登录'}
            onPress={handleSubmit}
            loading={isLoading}
            size="large"
            style={styles.submitButton}
          />

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsRegister(!isRegister);
              clearError();
            }}
          >
            <Text style={styles.switchText}>
              {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestLogin}
          >
            <Text style={styles.testText}>使用测试账号</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testHint}>
          <Text style={styles.testHintTitle}>测试账号</Text>
          <Text style={styles.testHintText}>邮箱: test@luckin.com</Text>
          <Text style={styles.testHintText}>密码: 123456</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
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
  form: {
    paddingHorizontal: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: BrandColors.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: BrandColors.text,
    backgroundColor: BrandColors.backgroundSecondary,
  },
  submitButton: {
    marginTop: 10,
    width: '100%',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: BrandColors.primary,
  },
  testButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  testText: {
    fontSize: 14,
    color: BrandColors.textSecondary,
  },
  testHint: {
    marginTop: 40,
    marginHorizontal: 30,
    padding: 15,
    backgroundColor: BrandColors.backgroundSecondary,
    borderRadius: 10,
  },
  testHintTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 8,
  },
  testHintText: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    marginBottom: 4,
  },
});
