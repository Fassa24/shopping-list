import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./ShoppingLists.css";
import {
  getShoppingLists,
  updateShoppingList,
} from "../api";

const ShoppingListDetail = () => {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = "clen2@email.com";

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const shoppingLists = await getShoppingLists();
        const selectedList = shoppingLists.find((list) => list.id === id);
        if (!selectedList) {
          throw new Error("List not found");
        }
        setList(selectedList);
        setItems(selectedList.items || []);
        setMembers(selectedList.members || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [id]);

  const addItem = async () => {
    if (newItemName.trim() !== "") {
      const newItem = {
        id: `item${items.length + 1}`,
        name: newItemName,
        isCompleted: false,
      };
      const updatedItems = [...items, newItem];
      const updatedList = { ...list, items: updatedItems };
      await updateShoppingList(id, updatedList);
      setItems(updatedItems);
      setNewItemName("");
    }
  };

  const removeItem = async (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    const updatedList = { ...list, items: updatedItems };
    await updateShoppingList(id, updatedList);
    setItems(updatedItems);
  };

  const toggleItemCompletion = async (itemId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );
    const updatedList = { ...list, items: updatedItems };
    await updateShoppingList(id, updatedList);
    setItems(updatedItems);
  };

  const addMember = async () => {
    if (newMemberEmail.trim() !== "" && !members.includes(newMemberEmail)) {
      const updatedMembers = [...members, newMemberEmail];
      const updatedList = { ...list, members: updatedMembers };
      await updateShoppingList(id, updatedList);
      setMembers(updatedMembers);
      setNewMemberEmail("");
    }
  };

  const removeMember = async (email) => {
    const updatedMembers = members.filter((member) => member !== email);
    const updatedList = { ...list, members: updatedMembers };
    await updateShoppingList(id, updatedList);
    setMembers(updatedMembers);
  };

  const leaveList = async () => {
    if (members.includes(currentUser)) {
      const updatedMembers = members.filter((member) => member !== currentUser);
      const updatedList = { ...list, members: updatedMembers };
      await updateShoppingList(id, updatedList);
      setMembers(updatedMembers);
    }
  };

  const filteredItems = items.filter((item) => showResolved || !item.isCompleted);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="shopping-list-detail-container">
      <header>
        <h1>Shopping List Detail</h1>
      </header>

      <main className="shopping-list-detail">
        <h2>{list?.name}</h2>

        <h3>Items</h3>
        <button
          className="toggle-button"
          onClick={() => setShowResolved(!showResolved)}
        >
          {showResolved ? "Show Unresolved" : "Show All"}
        </button>

        <ul className="items-list">
          {filteredItems.map((item) => (
            <li key={item.id} className="item">
              <span className={item.isCompleted ? "completed" : ""}>
                {item.name}
              </span>
              <button
                className="item-button"
                onClick={() => toggleItemCompletion(item.id)}
              >
                {item.isCompleted ? "Unmark" : "Mark as Completed"}
              </button>
              <button
                className="item-button"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="add-item-container">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add new item"
          />
          <button className="add-button" onClick={addItem}>
            Add Item
          </button>
        </div>

        <h3>Members</h3>
        <ul className="members-list">
          {members.map((member, index) => (
            <li key={index} className="member">
              {member}
              <button
                className="remove-button"
                onClick={() => removeMember(member)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="add-member-container">
          <input
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Enter new member email"
          />
          <button className="add-button" onClick={addMember}>
            Add Member
          </button>
        </div>

        {members.includes(currentUser) && (
          <div className="leave-list-container">
            <button className="leave-button" onClick={leaveList}>
              Leave List
            </button>
          </div>
        )}

        <Link to="/" className="back-button">
          Back to Overview
        </Link>
      </main>

      <footer>Frontend úkol - #4 Server calls</footer>
    </div>
  );
};

export default ShoppingListDetail;
