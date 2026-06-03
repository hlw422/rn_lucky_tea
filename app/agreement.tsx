import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useRouter } from 'expo-router';
import { BrandColors } from '../constants/colors';

export default function AgreementScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>用户协议</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>瑞幸咖啡用户服务协议</Text>
          <Text style={styles.updateDate}>更新日期: 2024年1月1日</Text>
          
          <Text style={styles.paragraphTitle}>一、服务条款的接受</Text>
          <Text style={styles.paragraph}>
            欢迎使用瑞幸咖啡提供的服务。在使用瑞幸咖啡提供的各项服务之前，请您仔细阅读以下条款。
            如果您对本协议的任何条款表示异议，您可以选择不使用瑞幸咖啡提供的服务。
            当您注册成功后，无论您是否阅读本协议，均视为您已经详细阅读并完全同意本协议。
          </Text>
          
          <Text style={styles.paragraphTitle}>二、服务内容</Text>
          <Text style={styles.paragraph}>
            瑞幸咖啡通过互联网为用户提供咖啡饮品及相关产品的订购服务。
            用户可以通过瑞幸咖啡APP、小程序等渠道进行商品浏览、下单、支付等操作。
          </Text>
          
          <Text style={styles.paragraphTitle}>三、用户账号</Text>
          <Text style={styles.paragraph}>
            1. 用户在注册时应提供真实、准确的个人信息。
            2. 用户应妥善保管账号和密码，因用户原因导致的账号安全问题由用户自行承担。
            3. 用户不得将账号转让或借给他人使用。
          </Text>
          
          <Text style={styles.paragraphTitle}>四、订单与支付</Text>
          <Text style={styles.paragraph}>
            1. 用户下单后，系统将自动生成订单。
            2. 用户应按照订单金额及时完成支付。
            3. 订单支付成功后，用户可在规定时间内取消订单并申请退款。
          </Text>
          
          <Text style={styles.paragraphTitle}>五、隐私保护</Text>
          <Text style={styles.paragraph}>
            瑞幸咖啡重视用户隐私保护，具体隐私政策请参阅《瑞幸咖啡隐私政策》。
          </Text>
          
          <Text style={styles.paragraphTitle}>六、免责声明</Text>
          <Text style={styles.paragraph}>
            1. 因不可抗力导致的服务中断，瑞幸咖啡不承担责任。
            2. 用户因违反本协议导致的损失，瑞幸咖啡不承担责任。
          </Text>
          
          <Text style={styles.paragraphTitle}>七、协议修改</Text>
          <Text style={styles.paragraph}>
            瑞幸咖啡有权根据需要修改本协议，修改后的协议将在APP内公布。
            用户继续使用瑞幸咖啡服务即视为同意修改后的协议。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: BrandColors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 28,
    color: BrandColors.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: BrandColors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: BrandColors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  updateDate: {
    fontSize: 13,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  paragraphTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.text,
    marginBottom: 10,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 14,
    color: BrandColors.text,
    lineHeight: 24,
  },
});
