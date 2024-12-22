import mockShoppingLists from "./mockData";
const mockDataKey = "shoppingLists";
const LOCAL_STORAGE_KEY = "shoppingLists";

export const initializeMockData = () => {
  const existingData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!existingData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockShoppingLists));
    console.log("Mock data initialized:", mockShoppingLists);
  }
};

export const getShoppingLists = async () => {
  console.log("Mock API: getShoppingLists called");
  const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  return new Promise((resolve) =>
    setTimeout(() => resolve(data), 500)
  );
};


export const createShoppingList = async (newList) => {
  const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  const updatedData = [...data, newList];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  return new Promise((resolve) => setTimeout(() => resolve(newList), 500));
};

export const updateShoppingList = async (id, updatedList) => {
  const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  const updatedData = data.map((list) =>
    list.id === id ? { ...list, ...updatedList } : list
  );
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  return new Promise((resolve) => setTimeout(() => resolve(updatedList), 500));
};

export const deleteShoppingList = async (id) => {
  const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  const updatedData = data.filter((list) => list.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
  return new Promise((resolve) => setTimeout(() => resolve(id), 500));
};

console.log("Mock API initialized with data: ", localStorage.getItem(mockDataKey));
