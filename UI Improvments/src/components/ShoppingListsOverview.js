import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ShoppingLists.css";
import settingsIcon from "../settings.png";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import {
  getShoppingLists,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
} from "../api";

const ShoppingListsOverview = () => {
  const { t, i18n } = useTranslation();
  const [shoppingLists, setShoppingLists] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const currentUser = "user123";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getShoppingLists();
        setShoppingLists(data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const filteredLists = shoppingLists.filter((list) => showArchived || !list.archived);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="shopping-list-overview-container">
      <header className="shopping-lists-header">
        <h1>{t("shoppingListsOverview.title")}</h1>
        <img
          src={settingsIcon}
          alt="Settings"
          className="settings-icon"
          onClick={toggleSettings}
        />
      </header>

      {isSettingsOpen && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <h2>{t("settings.title")}</h2>
            <p>{t("settings.description")}</p>
            <button onClick={toggleTheme}>
              {t("settings.switchTheme", { theme: theme === "light" ? "Dark" : "Light" })}
            </button>
            <button onClick={() => toggleLanguage("en")}>English</button>
            <button onClick={() => toggleLanguage("cs")}>Čeština</button>
            <button onClick={toggleSettings}>{t("settings.close")}</button>
          </div>
        </div>
      )}

      <main>
        <button onClick={() => setShowArchived(!showArchived)}>
          {showArchived ? t("shoppingListsOverview.showNonArchived") : t("shoppingListsOverview.showAll")}
        </button>

        <div className="tiles-container">
          {filteredLists.map((list) => (
            <div key={list.id} className="tile">
              <h3>{list.name}</h3>
              <p>{list.archived ? t("shoppingListsOverview.archived") : t("shoppingListsOverview.active")}</p>

              <div className="tile-buttons">
                {list.owner === currentUser && (
                  <>
                    <button onClick={() => handleArchiveToggle(list.id)}>
                      {list.archived ? t("shoppingListsOverview.unarchive") : t("shoppingListsOverview.archive")}
                    </button>
                    <button onClick={() => handleDelete(list.id)}>{t("shoppingListsOverview.delete")}</button>
                  </>
                )}
                <Link to={`/list/${list.id}`} className="view-details-link">
                  {t("shoppingListsOverview.details")}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <button id="addShoppingListBtn" onClick={() => setShowAddModal(true)}>
          {t("shoppingListsOverview.addNewList")}
        </button>

        {showAddModal && (
          <div className="modal">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder={t("shoppingListsOverview.enterListName")}
            />
            <button onClick={handleAddNewList}>{t("shoppingListsOverview.addNewList")}</button>
            <button onClick={() => setShowAddModal(false)}>{t("shoppingListsOverview.cancel")}</button>
          </div>
        )}
      </main>

      <footer>{t("shoppingListsOverview.footer")}</footer>
    </div>
  );
};

export default ShoppingListsOverview;
