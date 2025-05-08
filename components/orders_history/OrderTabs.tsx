import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

const statusConfig = {
  0: {
    text: "All orders",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "📋",
    tabName: "All orders",
  },
  1: {
    text: "Pending",
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "⏳",
    tabName: "Pending",
  },
  2: {
    text: "Packing",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "📦",
    tabName: "Packing",
  },
  3: {
    text: "Delivering",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "🚚",
    tabName: "Delivering",
  },
  5: {
    text: "Pending to feedback",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    icon: "⭐",
    tabName: "Pending to feedback",
  },
  6: {
    text: "Success order",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "🏆",
    tabName: "Success order",
  },
  7: {
    text: "Cancel",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "↩️",
    tabName: "Cancel",
  },
  8: {
    text: "Bad feedback",
    color: "bg-yellow-100 text-red-800 border-red-200",
    icon: "👎",
    tabName: "Bad feedback",
  },
};

type OrderTabsProps = {
  statusFilter: string;
  onChange: (key: string) => void;
  totalCount: number;
  children?: React.ReactNode; // Làm children tùy chọn
};

export default function OrderTabs({
  statusFilter,
  onChange,
  totalCount,
  children,
}: OrderTabsProps) {
  const { colors } = useThemeColors();

  return (
    <View>
      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-2"
      >
        <View className="flex-row">
          {Object.entries(statusConfig).map(([key, config]) => (
            <TouchableOpacity
              key={key}
              className={`flex-row items-center px-3 py-2 mr-2 rounded-lg ${
                key === (statusFilter || "0") ? "bg-primary" : "bg-blue-200"
              }`}
              onPress={() => onChange(key)}
            >
              <Text
                className="font-medium"
                style={{
                  color:
                    key === (statusFilter || "0")
                      ? colors.primaryForeground
                      : colors.foreground,
                }}
              >
                {config.tabName}
              </Text>
              {totalCount > 0 && key === (statusFilter || "0") && (
                <View className="ml-2 bg-gray-300 rounded-full px-2 py-0.5">
                  <Text
                    className="text-xs"
                    style={{ color: colors.foreground }}
                  >
                    {totalCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Content */}
      {/* {children && <View>{children}</View>}  */}
      {children && (
        <View>
          <Text>{children}</Text>
        </View>
      )}
    </View>
  );
}
