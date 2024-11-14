import React, { useState } from 'react';

const ShoppingListDetail = () => {
  // Konstantní data o seznamu
  const shoppingListData = {
    name: "Můj Nákupní Seznam",
    items: [
      { id: 1, name: "Rohlíky", isCompleted: false },
      { id: 2, name: "Pokemon", isCompleted: true },
      { id: 3, name: "Magic", isCompleted: false },
    ],
    owner: "Uživatel", // Vlastník seznamu
    members: ["clen1@email.com", "clen2@email.com"], // Výchozí členové
  };

  // Předpokládáme, že máme aktuálního přihlášeného uživatele
  const currentUser = "clen2@email.com";

  // Stavy pro úpravu
  const [listName, setListName] = useState(shoppingListData.name);
  const [items, setItems] = useState(shoppingListData.items);
  const [members, setMembers] = useState(shoppingListData.members);
  const [newItemName, setNewItemName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showResolved, setShowResolved] = useState(false); // Přepínač pro filtrování

  // Funkce pro změnu názvu seznamu
  const handleNameChange = (e) => {
    setListName(e.target.value);
  };

  // Funkce pro přidání nové položky
  const addItem = () => {
    if (newItemName.trim() !== "") {
      const newItem = {
        id: items.length + 1,
        name: newItemName,
        isCompleted: false,
      };
      setItems([...items, newItem]);
      setNewItemName(""); // Vyčistit vstupní pole
    }
  };

  // Funkce pro odstranění položky
  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Funkce pro přidání nového člena
  const addMember = () => {
    if (newMemberEmail.trim() !== "" && !members.includes(newMemberEmail)) {
      setMembers([...members, newMemberEmail]);
      setNewMemberEmail(""); // Vyčistit vstupní pole
    }
  };

  // Funkce pro odstranění člena
  const removeMember = (email) => {
    setMembers(members.filter((member) => member !== email));
  };

  // Funkce pro opuštění seznamu aktuálním uživatelem
  const leaveList = () => {
    if (members.includes(currentUser)) {
      setMembers(members.filter((member) => member !== currentUser));
    }
  };

  // Funkce pro označení položky jako vyřešené nebo nevyřešené
  const toggleItemCompletion = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  // Filtrované položky podle aktuálního filtru
  const filteredItems = items.filter((item) => showResolved || !item.isCompleted);

  return (
    <div>
      <h2>
        <input
          type="text"
          value={listName}
          onChange={handleNameChange}
          placeholder="Název nákupního seznamu"
        />
      </h2>
      
      <h3>Položky seznamu</h3>
      {/* Přepínač pro filtrování položek */}
      <button onClick={() => setShowResolved(!showResolved)}>
        {showResolved ? "Zobrazit pouze nevyřešené" : "Zobrazit všechny"}
      </button>

      {/* Zobrazení položek seznamu */}
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>
            <span
              style={{
                textDecoration: item.isCompleted ? "line-through" : "none",
              }}
            >
              {item.name}
            </span>
            <button onClick={() => toggleItemCompletion(item.id)}>
              {item.isCompleted ? "Odznačit" : "Označit jako vyřešené"}
            </button>
            <button onClick={() => removeItem(item.id)}>Odstranit</button>
          </li>
        ))}
      </ul>

      {/* Formulář pro přidání nové položky */}
      <input
        type="text"
        value={newItemName}
        onChange={(e) => setNewItemName(e.target.value)}
        placeholder="Přidat novou položku"
      />
      <button onClick={addItem}>Přidat položku</button>

      {/* Přehled členů */}
      <h3>Členové</h3>
      <ul>
        {members.map((member, index) => (
          <li key={index}>
            {member}
            <button onClick={() => removeMember(member)}>Odebrat</button>
          </li>
        ))}
      </ul>

      {/* Formulář pro přidání nového člena */}
      <input
        type="email"
        value={newMemberEmail}
        onChange={(e) => setNewMemberEmail(e.target.value)}
        placeholder="E-mail nového člena"
      />
      <button onClick={addMember}>Přidat člena</button>

      {/* Tlačítko pro opuštění seznamu */}
      {members.includes(currentUser) && (
        <div>
          <button onClick={leaveList}>Opustit seznam</button>
        </div>
      )}
    </div>
  );
};

export default ShoppingListDetail;