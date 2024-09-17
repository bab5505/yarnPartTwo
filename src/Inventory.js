import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://yarnparttwo.onrender.com';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/inventory-items`)
      .then(response => setItems(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleAddItem = () => {
    if (isEditing) {
      // Update item
      axios.put(`${API_BASE_URL}/inventory-items/${editId}`, { name: input })
        .then(response => {
          setItems(items.map(item => item.id === editId ? { ...item, name: input } : item));
          setIsEditing(false);
          setEditId(null);
          setInput('');
        })
        .catch(error => console.error('Error:', error));
    } else {
      // Add new item
      axios.post(`${API_BASE_URL}/inventory-items`, { name: input })
        .then(response => {
          setItems([...items, response.data]); // Assuming response.data contains the newly added item with all properties
          setInput('');
        })
        .catch(error => console.error('Error:', error));
    }
  };

  const handleEditItem = (item) => {
    setInput(item.name);
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleDeleteItem = (id) => {
    axios.delete(`${API_BASE_URL}/inventory-items/${id}`)
      .then(response => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <h2>Inventory</h2>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Add a new item"
      />
      <button onClick={handleAddItem}>
        {isEditing ? 'Update Item' : 'Add Item'}
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id}> {/* Use item.id as the unique key */}
            {item.name} {/* Render item properties as needed */}
            <button onClick={() => handleEditItem(item)}>Edit</button>
            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inventory;
