// import { Modal, View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
// import { AirbnbRating } from 'react-native-ratings';
// import Toast from 'react-native-toast-message';
// import { useThemeColors } from '../../hooks/useThemeColors';
// import { useEffect, useState } from 'react';
// // Placeholder for createFeedback API (you need to add this to historyOrderApi.ts)
// const createFeedback = async (feedbackData: {
//   orderId: number;
//   sellerId: number;
//   sellerRole: number;
//   feedbackList: Array<{
//     orderItemId: number;
//     comment: string;
//     rating: number;
//   }>;
// }) => {
//   // Simulate API call (replace with actual implementation)
//   console.log('Submitting feedback:', feedbackData);
//   return { success: true };
// };

// type FeedbackFormProps = {
//   visible: boolean;
//   onClose: () => void;
//   sellerGroup: {
//     orderId: number;
//     sellerId: number;
//     sellerName: string;
//     sellerRole: number;
//     items: Array<{
//       orderItemId: number;
//       nameProduct: string;
//       imageUrl?: string;
//       quantity: number;
//       price: number;
//     }>;
//   };
//   fetchHistoryOrder: () => void;
// };

// export default function FeedbackForm({ visible, onClose, sellerGroup, fetchHistoryOrder }: FeedbackFormProps) {
//   const { colors } = useThemeColors();
//   const [formData, setFormData] = useState<Record<string, { rating: number; comment: string }>>({});
//   const [errors, setErrors] = useState<Record<string, { rating?: string; comment?: string }>>({});

//   // Initialize form data for each item
//   const initializeFormData = () => {
//     const initialData: Record<string, { rating: number; comment: string }> = {};
//     sellerGroup?.items.forEach((item) => {
//       initialData[item.orderItemId] = { rating: 0, comment: '' };
//     });
//     setFormData(initialData);
//     setErrors({});
//   };

//   useEffect(() => {
//     if (visible) {
//       initializeFormData();
//     }
//   }, [visible, sellerGroup]);

//   const handleRatingChange = (orderItemId: number, rating: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       [orderItemId]: { ...prev[orderItemId], rating },
//     }));
//     setErrors((prev) => ({
//       ...prev,
//       [orderItemId]: { ...prev[orderItemId], rating: undefined },
//     }));
//   };

//   const handleCommentChange = (orderItemId: number, comment: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [orderItemId]: { ...prev[orderItemId], comment },
//     }));
//     setErrors((prev) => ({
//       ...prev,
//       [orderItemId]: { ...prev[orderItemId], comment: undefined },
//     }));
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, { rating?: string; comment?: string }> = {};
//     let isValid = true;

//     sellerGroup?.items.forEach((item) => {
//       const itemData = formData[item.orderItemId];
//       const itemErrors: { rating?: string; comment?: string } = {};

//       if (!itemData.rating) {
//         itemErrors.rating = 'Please provide a rating';
//         isValid = false;
//       }
//       if (!itemData.comment) {
//         itemErrors.comment = 'Please provide a comment';
//         isValid = false;
//       }

//       if (Object.keys(itemErrors).length > 0) {
//         newErrors[item.orderItemId] = itemErrors;
//       }
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       Toast.show({
//         type: 'error',
//         text1: 'Validation Error',
//         text2: 'Please fill in all required fields.',
//       });
//       return;
//     }

//     const feedbackData = {
//       orderId: sellerGroup.orderId,
//       sellerId: sellerGroup.sellerId,
//       sellerRole: sellerGroup.sellerRole,
//       feedbackList: sellerGroup.items.map((item) => ({
//         orderItemId: item.orderItemId,
//         comment: formData[item.orderItemId].comment,
//         rating: formData[item.orderItemId].rating,
//       })),
//     };

//     try {
//       await createFeedback(feedbackData);
//       Toast.show({
//         type: 'success',
//         text1: 'Feedback Submitted',
//         text2: 'Thank you for your feedback!',
//       });
//       onClose();
//       fetchHistoryOrder();
//     } catch (error) {
//       Toast.show({
//         type: 'error',
//         text1: 'Submission Failed',
//         text2: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
//       });
//     }
//   };

//   const formatPrice = (price: number) => {
//     return price.toLocaleString('vi-VN') + '₫';
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <View className="flex-1 justify-center items-center bg-black/50">
//         <View className="bg-card rounded-lg p-6 w-11/12 max-w-lg" style={{ backgroundColor: colors.card }}>
//           {/* Header */}
//           <Text className="text-xl font-semibold mb-4" style={{ color: colors.foreground }}>
//             Feedback for {sellerGroup?.sellerName}
//           </Text>

//           {/* Form */}
//           <ScrollView>
//             {sellerGroup?.items.map((item, index) => (
//               <View
//                 key={item.orderItemId}
//                 className="mb-6 p-4 rounded-lg shadow-sm"
//                 style={{ backgroundColor: colors.background }}
//               >
//                 {/* Item Info */}
//                 <View className="flex-row items-center">
//                   <Image
//                     source={{ uri: item.imageUrl }}
//                     style={{ width: 80, height: 80, borderRadius: 6, borderWidth: 1, borderColor: colors.border, marginRight: 16 }}
//                   />
//                   <View className="flex-1">
//                     <Text className="text-base font-medium" style={{ color: colors.foreground }}>
//                       {item.nameProduct}
//                     </Text>
//                     <Text className="text-sm" style={{ color: colors.mutedForeground }}>
//                       Quantity: {item.quantity} | Price: {formatPrice(item.price)}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Rating */}
//                 <View className="mt-4">
//                   <Text className="font-medium mb-2" style={{ color: colors.foreground }}>
//                     Rating
//                   </Text>
//                   <AirbnbRating
//                     count={5}
//                     defaultRating={formData[item.orderItemId]?.rating || 0}
//                     size={32}
//                     showRating={false}
//                     onFinishRating={(rating) => handleRatingChange(item.orderItemId, rating)}
//                   />
//                   {errors[item.orderItemId]?.rating && (
//                     <Text className="text-red-500 text-sm mt-1">{errors[item.orderItemId].rating}</Text>
//                   )}
//                 </View>

//                 {/* Comment */}
//                 <View className="mt-4">
//                   <Text className="font-medium mb-2" style={{ color: colors.foreground }}>
//                     Comment
//                   </Text>
//                   <TextInput
//                     value={formData[item.orderItemId]?.comment || ''}
//                     onChangeText={(text) => handleCommentChange(item.orderItemId, text)}
//                     placeholder="Share your thoughts about this product..."
//                     placeholderTextColor={colors.mutedForeground}
//                     multiline
//                     numberOfLines={3}
//                     className="border rounded-lg p-3"
//                     style={{ borderColor: colors.border, color: colors.foreground }}
//                   />
//                   {errors[item.orderItemId]?.comment && (
//                     <Text className="text-red-500 text-sm mt-1">{errors[item.orderItemId].comment}</Text>
//                   )}
//                 </View>

//                 {/* Divider */}
//                 {index < sellerGroup.items.length - 1 && (
//                   <View className="h-px my-4" style={{ backgroundColor: colors.border }} />
//                 )}
//               </View>
//             ))}
//           </ScrollView>

//           {/* Footer */}
//           <View className="flex-row justify-center space-x-4 mt-6">
//             <TouchableOpacity
//               className="rounded-lg p-3 px-6"
//               style={{ backgroundColor: colors.muted }}
//               onPress={onClose}
//             >
//               <Text className="font-semibold" style={{ color: colors.mutedForeground }}>
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="rounded-lg p-3 px-6"
//               style={{ backgroundColor: colors.primary }}
//               onPress={handleSubmit}
//             >
//               <Text className="font-semibold" style={{ color: colors.primaryForeground }}>
//                 Submit Feedback
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

import { Modal, View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import Toast from 'react-native-toast-message';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useEffect, useState } from 'react';
import { createFeedback } from '@/services/slices/historyOrderApi'; 

type FeedbackFormProps = {
  visible: boolean;
  onClose: () => void;
  sellerGroup: {
    orderId: number;
    sellerId: number;
    sellerName: string;
    sellerRole: number;
    items: Array<{
      orderItemId: number;
      nameProduct: string;
      imageUrl?: string;
      quantity: number;
      price: number;
    }>;
  };
  fetchHistoryOrder: () => void;
};

export default function FeedbackForm({ visible, onClose, sellerGroup, fetchHistoryOrder }: FeedbackFormProps) {
  const { colors } = useThemeColors();
  const [formData, setFormData] = useState<Record<string, { rating: number; comment: string }>>({});
  const [errors, setErrors] = useState<Record<string, { rating?: string; comment?: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data for each item
  const initializeFormData = () => {
    const initialData: Record<string, { rating: number; comment: string }> = {};
    sellerGroup?.items.forEach((item) => {
      initialData[item.orderItemId] = { rating: 0, comment: '' };
    });
    setFormData(initialData);
    setErrors({});
  };

  useEffect(() => {
    if (visible) {
      initializeFormData();
    }
  }, [visible, sellerGroup]);

  const handleRatingChange = (orderItemId: number, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      [orderItemId]: { ...prev[orderItemId], rating },
    }));
    setErrors((prev) => ({
      ...prev,
      [orderItemId]: { ...prev[orderItemId], rating: undefined },
    }));
  };

  const handleCommentChange = (orderItemId: number, comment: string) => {
    setFormData((prev) => ({
      ...prev,
      [orderItemId]: { ...prev[orderItemId], comment },
    }));
    setErrors((prev) => ({
      ...prev,
      [orderItemId]: { ...prev[orderItemId], comment: undefined },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, { rating?: string; comment?: string }> = {};
    let isValid = true;

    sellerGroup?.items.forEach((item) => {
      const itemData = formData[item.orderItemId];
      const itemErrors: { rating?: string; comment?: string } = {};

      if (!itemData.rating) {
        itemErrors.rating = 'Please provide a rating';
        isValid = false;
      }
      if (!itemData.comment) {
        itemErrors.comment = 'Please provide a comment';
        isValid = false;
      }

      if (Object.keys(itemErrors).length > 0) {
        newErrors[item.orderItemId] = itemErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill in all required fields.',
      });
      return;
    }

    setIsSubmitting(true);
    const feedbackData = {
      orderId: sellerGroup.orderId,
      sellerId: sellerGroup.sellerId,
      sellerRole: sellerGroup.sellerRole,
      feedbackList: sellerGroup.items.map((item) => ({
        orderItemId: item.orderItemId,
        comment: formData[item.orderItemId].comment,
        rating: formData[item.orderItemId].rating,
      })),
    };

    try {
      await createFeedback(feedbackData);
      Toast.show({
        type: 'Successful',
        text1: 'Feedback Submitted',
        text2: 'Thank you for your feedback!',
      });
      onClose();
      fetchHistoryOrder();
    } catch (error: any) {
      console.error('Feedback submission error:', error);
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  if (!sellerGroup) {
    return null; 
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-card rounded-lg p-6 w-11/12 max-w-lg" style={{ backgroundColor: colors.card }}>
          {/* Header */}
          <Text className="text-xl font-semibold mb-4" style={{ color: colors.foreground }}>
            Feedback for {sellerGroup.sellerName}
          </Text>

          {/* Form */}
          <ScrollView>
            {sellerGroup.items.map((item, index) => (
              <View
                key={item.orderItemId}
                className="mb-6 p-4 rounded-lg shadow-sm"
                style={{ backgroundColor: colors.background }}
              >
                {/* Item Info */}
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: item.imageUrl || 'https://via.placeholder.com/80' }}
                    style={{ width: 80, height: 80, borderRadius: 6, borderWidth: 1, borderColor: colors.border, marginRight: 16 }}
                  />
                  <View className="flex-1">
                    <Text className="text-base font-medium" style={{ color: colors.foreground }}>
                      {item.nameProduct}
                    </Text>
                    <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                      Quantity: {item.quantity} | Price: {formatPrice(item.price)}
                    </Text>
                  </View>
                </View>

                {/* Rating */}
                <View className="mt-4">
                  <Text className="font-medium mb-2" style={{ color: colors.foreground }}>
                    Rating
                  </Text>
                  <AirbnbRating
                    count={5}
                    defaultRating={formData[item.orderItemId]?.rating || 0}
                    size={32}
                    showRating={false}
                    onFinishRating={(rating) => handleRatingChange(item.orderItemId, rating)}
                  />
                  {errors[item.orderItemId]?.rating && (
                    <Text className="text-red-500 text-sm mt-1">{errors[item.orderItemId].rating}</Text>
                  )}
                </View>

                {/* Comment */}
                <View className="mt-4">
                  <Text className="font-medium mb-2" style={{ color: colors.foreground }}>
                    Comment
                  </Text>
                  <TextInput
                    value={formData[item.orderItemId]?.comment || ''}
                    onChangeText={(text) => handleCommentChange(item.orderItemId, text)}
                    placeholder="Share your thoughts about this product..."
                    placeholderTextColor={colors.mutedForeground}
                    multiline
                    numberOfLines={3}
                    className="border rounded-lg p-3"
                    style={{ borderColor: colors.border, color: colors.foreground }}
                  />
                  {errors[item.orderItemId]?.comment && (
                    <Text className="text-red-500 text-sm mt-1">{errors[item.orderItemId].comment}</Text>
                  )}
                </View>

                {/* Divider */}
                {index < sellerGroup.items.length - 1 && (
                  <View className="h-px my-4" style={{ backgroundColor: colors.border }} />
                )}
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View className="flex-row justify-center space-x-4 mt-6">
            <TouchableOpacity
              className="rounded-lg p-3 px-6"
              style={{ backgroundColor: colors.muted }}
              onPress={onClose}
            >
              <Text className="font-semibold" style={{ color: colors.mutedForeground }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-lg p-3 px-6"
              style={{ backgroundColor: colors.primary }}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text className="font-semibold" style={{ color: colors.primaryForeground }}>
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}