import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ShoppingLists.css';

const initialShoppingLists = [
  { id: 'list1', name: 'Weekly Groceries', archived: false, owner: 'user123' },
  { id: 'list2', name: 'Party Supplies', archived: true, owner: 'user123' }
];

const ShoppingListsOverview = () => {
  const [shoppingLists, setShoppingLists] = useState(initialShoppingLists);
  const [showArchived, setShowArchived] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newListName, setNewListName] = useState("");

  const currentUser = "user123";

  const handleAddNewList = () => {
    if (newListName.trim() !== "") {
      const newList = {
        id: `list${shoppingLists.length + 1}`,
        name: newListName,
        archived: false,
        owner: currentUser,
      };
      setShoppingLists([...shoppingLists, newList]);
      setShowAddModal(false);
      setNewListName("");
    }
  };

  const handleDelete = (listId) => {
    const listToDelete = shoppingLists.find((list) => list.id === listId);
    if (listToDelete.owner === currentUser) {
      if (window.confirm("Are you sure you want to delete this shopping list?")) {
        setShoppingLists(shoppingLists.filter((list) => list.id !== listId));
      }
    } else {
      alert("You can only delete lists that you own.");
    }
  };

  const handleArchiveToggle = (listId) => {
    setShoppingLists(
      shoppingLists.map((list) =>
        list.id === listId ? { ...list, archived: !list.archived } : list
      )
    );
  };

  const filteredLists = shoppingLists.filter((list) => showArchived || !list.archived);

  return (
    <div>
      <h1>Shopping Lists Overview</h1>

      <button onClick={() => setShowArchived(!showArchived)}>
        {showArchived ? "Show Non-Archived" : "Show All (Including Archived)"}
      </button>

      <div className="tiles-container">
        {filteredLists.map((list) => (
          <div key={list.id} className="tile">
            <h3>{list.name}</h3>
            <p>{list.archived ? "Archived" : "Active"}</p>

            <div className="tile-buttons">
              {list.owner === currentUser && (
                <>
                  <button onClick={() => handleArchiveToggle(list.id)}>
                    {list.archived ? "Unarchive" : "Archive"}
                  </button>
                  <button onClick={() => handleDelete(list.id)}>Delete</button>
                </>
              )}
              <Link to={`/list/${list.id}`} className="view-details-link">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button id="addShoppingListBtn" onClick={() => setShowAddModal(true)}>Add Shopping List</button>

      {showAddModal && (
        <div className="modal">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Enter list name"
          />
          <button onClick={handleAddNewList}>Add</button>
          <button onClick={() => setShowAddModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ShoppingListsOverview;
