// import AsyncStorage from '@react-native-async-storage/async-storage';

// /**
//  * A service to handle AsyncStorage operations with error handling and type safety.
//  */
// class AsyncStorageService {
//   /**
//    * Save a value to AsyncStorage.
//    * @param key The key under which to store the value.
//    * @param value The value to store (will be converted to JSON string).
//    * @returns Promise<void>
//    */
//   async setItem<T>(key: string, value: T): Promise<void> {
//     try {
//       const jsonValue = JSON.stringify(value);
//       await AsyncStorage.setItem(key, jsonValue);
//     } catch (error) {
//       console.error(`Error saving to AsyncStorage with key "${key}":`, error);
//       throw new Error(`Failed to save data for key "${key}"`);
//     }
//   }

//   /**
//    * Retrieve a value from AsyncStorage.
//    * @param key The key to retrieve the value for.
//    * @returns Promise<T | null> The parsed value, or null if not found.
//    */
//   async getItem<T>(key: string): Promise<T | null> {
//     try {
//       const jsonValue = await AsyncStorage.getItem(key);
//       return jsonValue != null ? JSON.parse(jsonValue) : null;
//     } catch (error) {
//       console.error(`Error retrieving from AsyncStorage with key "${key}":`, error);
//       throw new Error(`Failed to retrieve data for key "${key}"`);
//     }
//   }

//   /**
//    * Remove a value from AsyncStorage.
//    * @param key The key to remove.
//    * @returns Promise<void>
//    */
//   async removeItem(key: string): Promise<void> {
//     try {
//       await AsyncStorage.removeItem(key);
//     } catch (error) {
//       console.error(`Error removing from AsyncStorage with key "${key}":`, error);
//       throw new Error(`Failed to remove data for key "${key}"`);
//     }
//   }

//   /**
//    * Clear all data from AsyncStorage.
//    * @returns Promise<void>
//    */
//   async clear(): Promise<void> {
//     try {
//       await AsyncStorage.clear();
//     } catch (error) {
//       console.error('Error clearing AsyncStorage:', error);
//       throw new Error('Failed to clear AsyncStorage');
//     }
//   }

//   /**
//    * Get all keys stored in AsyncStorage.
//    * @returns Promise<readonly string[]> An array of all keys.
//    */
//   async getAllKeys(): Promise<readonly string[]> {
//     try {
//       return await AsyncStorage.getAllKeys();
//     } catch (error) {
//       console.error('Error retrieving all keys from AsyncStorage:', error);
//       throw new Error('Failed to retrieve all keys from AsyncStorage');
//     }
//   }

//   /**
//    * Merge a value with an existing value in AsyncStorage (useful for objects).
//    * @param key The key to merge the value under.
//    * @param value The value to merge (will be merged with existing data).
//    * @returns Promise<void>
//    */
//   async mergeItem<T>(key: string, value: T): Promise<void> {
//     try {
//       const existingValue = await this.getItem<T>(key);
//       const mergedValue = { ...existingValue, ...value };
//       await this.setItem(key, mergedValue);
//     } catch (error) {
//       console.error(`Error merging data in AsyncStorage with key "${key}":`, error);
//       throw new Error(`Failed to merge data for key "${key}"`);
//     }
//   }
// }

// // Export a singleton instance of the service
// const asyncStorageService = new AsyncStorageService();
// export default asyncStorageService;

import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStorageService {
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error saving to AsyncStorage with key "${key}":`, error);
      throw new Error(`Failed to save data for key "${key}"`);
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      // Check if the value is a valid JSON string
      try {
        return JSON.parse(value);
      } catch (parseError) {
        // If parsing fails, assume it's a plain string and return it as-is
        return value as T;
      }
    } catch (error) {
      console.error(`Error retrieving from AsyncStorage with key "${key}":`, error);
      throw new Error(`Failed to retrieve data for key "${key}"`);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from AsyncStorage with key "${key}":`, error);
      throw new Error(`Failed to remove data for key "${key}"`);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      throw new Error('Failed to clear AsyncStorage');
    }
  }

  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error retrieving all keys from AsyncStorage:', error);
      throw new Error('Failed to retrieve all keys from AsyncStorage');
    }
  }

  async mergeItem<T>(key: string, value: T): Promise<void> {
    try {
      const existingValue = await this.getItem<T>(key);
      const mergedValue = { ...existingValue, ...value };
      await this.setItem(key, mergedValue);
    } catch (error) {
      console.error(`Error merging data in AsyncStorage with key "${key}":`, error);
      throw new Error(`Failed to merge data for key "${key}"`);
    }
  }
}

const asyncStorageService = new AsyncStorageService();
export default asyncStorageService;