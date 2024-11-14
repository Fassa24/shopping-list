import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ShoppingLists.css';

const ShoppingListDetail = () => {
  const shoppingListData = {
    name: "Můj Nákupní Seznam",
    items: [
      { id: 1, name: "Rohlíky", isCompleted: false },
      { id: 2, name: "Pokemon", isCompleted: true },
      { id: 3, name: "Magic", isCompleted: false },
    ],
    owner: "Uživatel",
    members: ["clen1@email.com", "clen2@email.com"],
  };

  const currentUser = "clen2@email.com";

  const [listName, setListName] = useState(shoppingListData.name);
  const [items, setItems] = useState(shoppingListData.items);
  const [members, setMembers] = useState(shoppingListData.members);
  const [newItemName, setNewItemName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showResolved, setShowResolved] = useState(false);

  const handleNameChange = (e) => {
    setListName(e.target.value);
  };

  const addItem = () => {
    if (newItemName.trim() !== "") {
      const newItem = {
        id: items.length + 1,
        name: newItemName,
        isCompleted: false,
      };
      setItems([...items, newItem]);
      setNewItemName("");
    }
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const addMember = () => {
    if (newMemberEmail.trim() !== "" && !members.includes(newMemberEmail)) {
      setMembers([...members, newMemberEmail]);
      setNewMemberEmail("");
    }
  };

  const removeMember = (email) => {
    setMembers(members.filter((member) => member !== email));
  };

  const leaveList = () => {
    if (members.includes(currentUser)) {
      setMembers(members.filter((member) => member !== currentUser));
    }
  };

  const toggleItemCompletion = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const filteredItems = items.filter((item) => showResolved || !item.isCompleted);

  return (
    <div className="shopping-list-detail">
      <h2>
        <input
          type="text"
          value={listName}
          onChange={handleNameChange}
          placeholder="Název nákupního seznamu"
        />
      </h2>

      <h3>Položky seznamu</h3>
      <button className="toggle-button" onClick={() => setShowResolved(!showResolved)}>
        {showResolved ? "Zobrazit pouze nevyřešené" : "Zobrazit všechny"}
      </button>

      <ul className="items-list">
        {filteredItems.map((item) => (
          <li key={item.id} className="item">
            <span className={item.isCompleted ? "completed" : ""}>
              {item.name}
            </span>
            <button className="item-button" onClick={() => toggleItemCompletion(item.id)}>
              {item.isCompleted ? "Odznačit" : "Označit jako vyřešené"}
            </button>
            <button className="item-button" onClick={() => removeItem(item.id)}>Odstranit</button>
          </li>
        ))}
      </ul>

      <div className="add-item-container">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Přidat novou položku"
        />
        <button className="add-button" onClick={addItem}>Přidat položku</button>
      </div>

      <h3>Členové</h3>
      <ul className="members-list">
        {members.map((member, index) => (
          <li key={index} className="member">
            {member}
            <button className="remove-button" onClick={() => removeMember(member)}>Odebrat</button>
          </li>
        ))}
      </ul>

      <div className="add-member-container">
        <input
          type="email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          placeholder="E-mail nového člena"
        />
        <button className="add-button" onClick={addMember}>Přidat člena</button>
      </div>

      {members.includes(currentUser) && (
        <div className="leave-list-container">
          <button className="leave-button" onClick={leaveList}>Opustit seznam</button>
        </div>
      )}

      <Link to="/" className="back-button">Back to Overview</Link></div>
  );
};

export default ShoppingListDetail;
