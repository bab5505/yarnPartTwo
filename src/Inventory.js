import React, { useState } from 'react';

function Inventory() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAddItem = () => {
    if (isEditing) {
      const updatedItems = [...items];
      updatedItems[currentIndex] = input;
      setItems(updatedItems);
      setIsEditing(false);
      setCurrentIndex(null);
    } else {
      setItems([...items, input]);
    }
    setInput('');
  };

  const handleEditItem = (index) => {
    setInput(items[index]);
    setIsEditing(true);
    setCurrentIndex(index);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <div>
      <h2>Inventory</h2>
      <div>
  <input 
    type="text" 
    value={input} 
    onChange={handleInputChange} 
    placeholder="Add a new item" 
    className="inventory-input"
  />
  <button onClick={handleAddItem} className="inventory-button">
    {isEditing ? 'Update Item' : 'Add Item'}
  </button>
</div>


      <ul className="inventory-list">
        {items.map((item, index) => (
          <li key={index} className="inventory-item">
            {item}
            <div>
              <button onClick={() => handleEditItem(index)}>Edit</button>
              <button onClick={() => handleDeleteItem(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inventory;
