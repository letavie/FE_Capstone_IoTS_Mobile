import AsyncStorage from '@react-native-async-storage/async-storage';
import asyncStorageService from './AsyncStorageService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

describe('AsyncStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save an item to AsyncStorage', async () => {
    const key = 'testKey';
    const value = { id: 1, name: 'Test' };
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

    await asyncStorageService.setItem(key, value);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  it('should retrieve an item from AsyncStorage', async () => {
    const key = 'testKey';
    const value = { id: 1, name: 'Test' };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(value));

    const result = await asyncStorageService.getItem(key);

    expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
    expect(result).toEqual(value);
  });

  it('should return null if item does not exist', async () => {
    const key = 'nonExistentKey';
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    const result = await asyncStorageService.getItem(key);

    expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
    expect(result).toBeNull();
  });

  it('should clear AsyncStorage', async () => {
    (AsyncStorage.clear as jest.Mock).mockResolvedValueOnce(undefined);

    await asyncStorageService.clear();

    expect(AsyncStorage.clear).toHaveBeenCalled();
  });
});