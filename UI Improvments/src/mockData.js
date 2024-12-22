export const mockShoppingLists = [
  {
    id: "list1",
    name: "Weekly Groceries",
    archived: false,
    owner: "user123",
    members: ["user123", "user456"],
    items: [
      { id: "item1", name: "Milk", isCompleted: false },
      { id: "item2", name: "Eggs", isCompleted: true },
      { id: "item3", name: "Bread", isCompleted: false },
    ],
  },
  {
    id: "list2",
    name: "Party Supplies",
    archived: true,
    owner: "user123",
    members: ["user123", "user789"],
    items: [
      { id: "item4", name: "Balloons", isCompleted: true },
      { id: "item5", name: "Cups", isCompleted: false },
    ],
  },
];

export default mockShoppingLists;
