const useMockApi = process.env.REACT_APP_USE_MOCK_API === "true";

if (useMockApi) {
  console.log("Using Mock API");
} else {
  console.log("Using Real API");
}

export const {
  getShoppingLists,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
} = useMockApi ? require("./mockApi") : require("./mockApi");