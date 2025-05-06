import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { checkSuccessOrder } from "@/services/slices/checkout";
import ConfettiCannon from "react-native-confetti-cannon";
import Toast from "react-native-toast-message";
import { Button, Card } from "react-native-paper";

const CheckProcessOrder = () => {
  const { urlResponse } = useLocalSearchParams<{ urlResponse: string }>();
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<{
    isSuccess: boolean;
    data: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOrder = async () => {
      if (!urlResponse) {
        setError("Không tìm thấy thông tin thanh toán");
        setLoading(false);
        return;
      }

      try {
        const convertedUrl = urlResponse.replace(
          /^IOTSHOPS:\/\/Checkout\/CheckProcessOrder/i,
          "https://fe-capstone-io-ts.vercel.app/checkout-process-order"
        );

        console.log("Converted URL:", convertedUrl);

        const response = await checkSuccessOrder(convertedUrl);
        console.log(
          "checkSuccessOrder response:",
          JSON.stringify(response, null, 2)
        );

        setOrderStatus({
          isSuccess: response.isSuccess,
          data: response.data,
        });

        if (response.isSuccess) {
          Toast.show({
            type: "success",
            text1: "Thành công",
            text2: "Đơn hàng của bạn đã được xác nhận 🎉",
          });
        } else {
          throw new Error(response.message || "Thanh toán không thành công");
        }
      } catch (err: any) {
        console.error("Error checking order:", err);
        setError(err.message || "Đã xảy ra lỗi khi kiểm tra đơn hàng");
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: err.message || "Không thể xác nhận đơn hàng",
        });
      } finally {
        setLoading(false);
      }
    };

    checkOrder();
  }, [urlResponse]);

  const handleBackToHome = () => {
    router.push("/(tabs)/home");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>
          Đang kiểm tra trạng thái đơn hàng...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="Lỗi thanh toán" titleStyle={styles.title} />
          <Card.Content>
            <Text style={styles.errorText}>{error}</Text>
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
  }

  if (!orderStatus) {
    return null;
  }

  return (
    <View style={styles.container}>
      {orderStatus.isSuccess && (
        <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut />
      )}
      <Card style={styles.card}>
        <Card.Title
          title={
            orderStatus.isSuccess
              ? "Thanh toán thành công 🎉"
              : "Thanh toán thất bại"
          }
          titleStyle={[
            styles.title,
            !orderStatus.isSuccess && styles.errorTitle,
          ]}
        />
        <Card.Content>
          {orderStatus.isSuccess && orderStatus.data ? (
            <View>
              <Text style={styles.infoText}>
                Mã đơn hàng: {orderStatus.data.applicationSerialNumber || "N/A"}
              </Text>
              <Text style={styles.infoText}>
                Tổng tiền:{" "}
                {(orderStatus.data.totalPrice || 0).toLocaleString("vi-VN")} VND
              </Text>
              <Text style={styles.infoText}>
                Số điện thoại: {orderStatus.data.contactNumber || "N/A"}
              </Text>
              <Text style={styles.infoText}>
                Địa chỉ: {orderStatus.data.address || "N/A"}
                {orderStatus.data.wardName
                  ? `, ${orderStatus.data.wardName}`
                  : ""}
                {orderStatus.data.districtName
                  ? `, ${orderStatus.data.districtName}`
                  : ""}
                {orderStatus.data.provinceName
                  ? `, ${orderStatus.data.provinceName}`
                  : ""}
              </Text>
              {orderStatus.data.notes ? (
                <Text style={styles.infoText}>
                  Ghi chú: {orderStatus.data.notes}
                </Text>
              ) : null}
            </View>
          ) : (
            <Text style={styles.errorText}>
              Không thể xác nhận đơn hàng. Vui lòng thử lại.
            </Text>
          )}
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
  errorTitle: {
    color: "#FF3B30",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 16,
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
  },
});

export default CheckProcessOrder;
