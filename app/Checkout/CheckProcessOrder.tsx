import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { Button, Card } from "react-native-paper";

const CheckProcessOrder = () => {
  const router = useRouter();

  const handleBackToHome = () => {
    router.push("/(tabs)/Home");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Thanh toán thành công 🎉"
          titleStyle={styles.title}
        />
        <Card.Content>
          <View>
            <Text style={styles.infoText}>Mã đơn hàng: TEST123456</Text>
            <Text style={styles.infoText}>Tổng tiền: 1.000.000 VND</Text>
            <Text style={styles.infoText}>Số điện thoại: 0987654321</Text>
            <Text style={styles.infoText}>
              Địa chỉ: Số 1 Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội
            </Text>
          </View>
          <Button
            mode="contained"
            onPress={handleBackToHome}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Quay lại trang chủ
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default CheckProcessOrder;
