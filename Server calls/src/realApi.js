const API_URL = "http://localhost:3000/api/shoppingList";

export const getShoppingLists = async () => {
  console.log("Real API: getShoppingLists called");
  const response = await fetch(`${API_URL}`);
  console.log("Response status:", response.status);
  if (!response.ok) throw new Error("Failed to fetch shopping lists");
  const data = await response.json();
  console.log("Fetched data:", data);
  return data;
};

export const createShoppingList = async (newList) => {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newList),
  });
  if (!response.ok) throw new Error("Failed to create shopping list");
  return await response.json();
};

export const updateShoppingList = async (id, updatedList) => {
  const response = await fetch(`${API_URL}/${id}/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedList),
  });
  if (!response.ok) throw new Error("Failed to update shopping list");
  return await response.json();
};

export const deleteShoppingList = async (id) => {
  const response = await fetch(`${API_URL}/${id}/delete`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete shopping list");
  return await response.json();
};
