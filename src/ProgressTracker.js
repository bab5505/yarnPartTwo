import React, { useState, useRef, useEffect } from 'react';

const ProgressTracker = () => {
  const [input, setInput] = useState('');
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState([]); // Manage notes for each item
  const [noteInput, setNoteInput] = useState('');
  const [currentNoteText, setCurrentNoteText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null); // Track the active timer index
  const [time, setTime] = useState({}); // Track time for each item
  const [editNoteIndex, setEditNoteIndex] = useState(null); // Track which note is being edited
  const [noteEditingIndex, setNoteEditingIndex] = useState(null); // Track which item is being edited
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup timer on component unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleNoteChange = (e) => {
    setNoteInput(e.target.value);
  };

  const handleCurrentNoteTextChange = (e) => {
    setCurrentNoteText(e.target.value);
  };

  const handleAddItem = () => {
    if (isEditing) {
      // Update the item
      const updatedItems = [...items];
      updatedItems[editIndex] = input;
      setItems(updatedItems);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Add new item
      setItems([...items, input]);
      setTime(prevTime => ({ ...prevTime, [items.length]: 0 })); // Initialize time for new item
      setNotes(prevNotes => [...prevNotes, []]); // Initialize notes for new item
    }
    setInput('');
  };

  const handleEditItem = (index) => {
    setInput(items[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    setTime(prevTime => {
      const { [index]: _, ...rest } = prevTime;
      return rest;
    });
    setNotes(prevNotes => prevNotes.filter((_, i) => i !== index));
  };

  const handleStartTimer = (index) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer
    timerRef.current = setInterval(() => {
      setTime(prevTime => ({
        ...prevTime,
        [index]: (prevTime[index] || 0) + 1,
      }));
    }, 1000);

    setActiveIndex(index);
  };

  const handlePauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleEndTimer = () => {
    handlePauseTimer();
    setActiveIndex(null);
  };

  const handleAddNote = (index) => {
    if (editNoteIndex !== null) {
      // Edit existing note
      setNotes(prevNotes => {
        const updatedNotes = [...prevNotes];
        updatedNotes[index][editNoteIndex] = noteInput; // Update note at editNoteIndex
        return updatedNotes;
      });
      setEditNoteIndex(null);
    } else {
      // Add new note
      setNotes(prevNotes => {
        const updatedNotes = [...prevNotes];
        updatedNotes[index] = [...(updatedNotes[index] || []), noteInput];
        return updatedNotes;
      });
    }
    setNoteInput(''); // Clear note input after adding
  };

  const handleEditNote = (index, noteIndex) => {
    setNoteEditingIndex(index); // Track which item the note belongs to
    setEditNoteIndex(noteIndex);
    setNoteInput(notes[index][noteIndex]);
  };

  const handleDeleteNote = (index, noteIndex) => {
    setNotes(prevNotes => {
      const updatedNotes = [...prevNotes];
      updatedNotes[index] = updatedNotes[index].filter((_, i) => i !== noteIndex);
      return updatedNotes;
    });
  };

  return (
    <div>
      <h2>Progress Tracker</h2>
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
            <div>
              {item}
              <div>
                <button onClick={() => handleEditItem(index)}>Edit</button>
                <button onClick={() => handleDeleteItem(index)}>Delete</button>
                {activeIndex === index ? (
                  <>
                    <button onClick={() => handleEndTimer()}>End Timer</button>
                  </>
                ) : (
                  <button onClick={() => handleStartTimer(index)}>Start Timer</button>
                )}
                <span>{time[index] ? `Time: ${time[index]}s` : 'Not Started'}</span>
              </div>
            </div>
            <div>
              <input 
                type="text" 
                value={noteInput} 
                onChange={handleNoteChange} 
                placeholder="Add a note" 
                className="inventory-input"
              />
              <button onClick={() => handleAddNote(index)} className="inventory-button">
                {editNoteIndex !== null ? 'Update Note' : 'Add Note'}
              </button>
            </div>
            {notes[index] && notes[index].length > 0 && (
              <ul>
                {notes[index].map((note, noteIndex) => (
                  <li key={noteIndex}>
                    {note}
                    <button onClick={() => handleEditNote(index, noteIndex)}>Edit</button>
                    <button onClick={() => handleDeleteNote(index, noteIndex)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressTracker;
