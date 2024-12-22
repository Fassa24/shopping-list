import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./ShoppingLists.css";
import settingsIcon from "../settings.png";
import { useTranslation } from "react-i18next";
import { getShoppingLists, updateShoppingList } from "../api";

const ShoppingListDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [members, setMembers] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const currentUser = "clen2@email.com";

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const shoppingLists = await getShoppingLists();
        const selectedList = shoppingLists.find((list) => list.id === id);
        if (!selectedList) {
          throw new Error(t("errors.listNotFound"));
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
  }, [id, t]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

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

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{t("errors.general", { message: error })}</div>;

  return (
    <div className="shopping-list-detail-container">
      <header className="shopping-list-detail-header">
        <h1>{t("shoppingListDetail.title")}</h1>
        <img
          src={settingsIcon}
          alt={t("settings.iconAlt")}
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
              {t("settings.switchTheme", { theme: theme === "light" ? t("settings.dark") : t("settings.light") })}
            </button>
            <div className="language-buttons">
              <button onClick={() => toggleLanguage("en")}>English</button>
              <button onClick={() => toggleLanguage("cs")}>Čeština</button>
            </div>
            <button onClick={toggleSettings}>{t("settings.close")}</button>
          </div>
        </div>
      )}

      <main className="shopping-list-detail">
        <h2>{list?.name}</h2>

        <div className="list-box">
          <h3>{t("shoppingListDetail.items")}</h3>
          <button
            className="toggle-button"
            onClick={() => setShowResolved(!showResolved)}
          >
            {showResolved ? t("shoppingListDetail.showUnresolved") : t("shoppingListDetail.showAll")}
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
                  {item.isCompleted ? t("shoppingListDetail.unmark") : t("shoppingListDetail.markCompleted")}
                </button>
                <button
                  className="item-button"
                  onClick={() => removeItem(item.id)}
                >
                  {t("shoppingListDetail.remove")}
                </button>
              </li>
            ))}
          </ul>

          <div className="add-item-container">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={t("shoppingListDetail.addItemPlaceholder")}
            />
            <button className="add-button" onClick={addItem}>
              {t("shoppingListDetail.addItem")}
            </button>
          </div>
        </div>

        <div className="list-box">
          <h3>{t("shoppingListDetail.members")}</h3>
          <ul className="members-list">
            {members.map((member, index) => (
              <li key={index} className="member">
                {member}
                <button
                  className="remove-button"
                  onClick={() => removeMember(member)}
                >
                  {t("shoppingListDetail.remove")}
                </button>
              </li>
            ))}
          </ul>

          <div className="add-member-container">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder={t("shoppingListDetail.addMemberPlaceholder")}
            />
            <button className="add-button" onClick={addMember}>
              {t("shoppingListDetail.addMember")}
            </button>
          </div>

          {members.includes(currentUser) && (
            <div className="leave-list-container">
              <button className="leave-button" onClick={leaveList}>
                {t("shoppingListDetail.leaveList")}
              </button>
            </div>
          )}
        </div>

        <Link to="/" className="back-button">
          {t("shoppingListDetail.back")}
        </Link>
      </main>

      <footer>{t("shoppingListDetail.footer")}</footer>
    </div>
  );
};

export default ShoppingListDetail;
