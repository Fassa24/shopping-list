import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ShoppingLists.css";
import { v4 as uuidv4 } from "uuid";
import {
  getShoppingLists,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
} from "../api";

const ShoppingListsOverview = () => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUser = "user123";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getShoppingLists();
        console.log("Fetched shopping lists:", data);
        setShoppingLists(data);
      } catch (err) {
        console.error("Error fetching shopping lists:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddNewList = async () => {
    if (newListName.trim() !== "") {
      try {
        const newList = {
          id: uuidv4(),
          name: newListName,
          archived: false,
          owner: currentUser,
        };
        const createdList = await createShoppingList(newList);
        setShoppingLists([...shoppingLists, createdList]);
        setShowAddModal(false);
        setNewListName("");
      } catch {
        setError("Failed to add new list");
      }
    }
  };

  const handleDelete = async (listId) => {
    try {
      await deleteShoppingList(listId);
      setShoppingLists(shoppingLists.filter((list) => list.id !== listId));
    } catch {
      setError("Failed to delete list");
    }
  };

  const handleArchiveToggle = async (listId) => {
    try {
      const listToUpdate = shoppingLists.find((list) => list.id === listId);
      const updatedList = { ...listToUpdate, archived: !listToUpdate.archived };
      await updateShoppingList(listId, updatedList);
      setShoppingLists(
        shoppingLists.map((list) => (list.id === listId ? updatedList : list))
      );
    } catch {
      setError("Failed to update list");
    }
  };

  const filteredLists = shoppingLists.filter((list) => showArchived || !list.archived);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="shopping-list-overview-container">
      <header>
        <h1>Shopping Lists Overview</h1>
      </header>

      <main>
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

        <button id="addShoppingListBtn" onClick={() => setShowAddModal(true)}>
          Add Shopping List
        </button>

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
      </main>

      <footer>Frontend úkol - #4 Server calls</footer>
    </div>
  );
};

export default ShoppingListsOverview;
