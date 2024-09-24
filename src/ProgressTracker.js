import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://yarnparttwo.onrender.com';

const ProgressTracker = () => {
  const [input, setInput] = useState('');
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [currentNoteText, setCurrentNoteText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [time, setTime] = useState({});
  const [editNoteIndex, setEditNoteIndex] = useState(null);
  const [noteEditingIndex, setNoteEditingIndex] = useState(null);
  const [startTime, setStartTime] = useState(null); // Added for tracking start time
  const [endTime, setEndTime] = useState(null); // Added for tracking end time
  const timerRef = useRef(null);

  useEffect(() => {
    // Fetch progress tracker items from the server
    axios.get(`${API_BASE_URL}/progress-tracker`)
      .then(response => {
        setItems(response.data);
        setNotes(response.data.map(() => [])); // Initialize notes array for each item
        setTime(response.data.reduce((acc, _, index) => ({ ...acc, [index]: 0 }), {})); // Initialize time
      })
      .catch(error => {
        console.error('Error fetching progress tracker items:', error);
      });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleInputChange = (e) => setInput(e.target.value);
  const handleNoteChange = (e) => setNoteInput(e.target.value);
  const handleCurrentNoteTextChange = (e) => setCurrentNoteText(e.target.value);

  const handleAddItem = () => {
    const now = new Date().toISOString();

    if (isEditing) {
      const updatedItems = [...items];
      updatedItems[editIndex] = {
        ...updatedItems[editIndex],
        name: input,
        start_time: startTime,
        end_time: endTime
      };
      axios.put(`${API_BASE_URL}/progress-tracker/${updatedItems[editIndex].id}`, {
        name: input,
        start_time: startTime,
        end_time: endTime
      })
        .then(() => {
          setItems(updatedItems);
          setIsEditing(false);
          setEditIndex(null);
        })
        .catch(error => console.error('Error updating item:', error.response ? error.response.data : error.message));
    } else {
      axios.post(`${API_BASE_URL}/progress-tracker`, {
        name: input,
        start_time: now,
        end_time: endTime || now
      })
        .then(response => {
          setItems([...items, response.data]);
          setNotes(prevNotes => [...prevNotes, []]);
          setTime(prevTime => ({ ...prevTime, [items.length]: 0 }));
          setInput('');
        })
        .catch(error => console.error('Error adding item:', error.response ? error.response.data : error.message));
    }
  };

  const handleEditItem = (index) => {
    setInput(items[index].name);
    setStartTime(items[index].start_time);
    setEndTime(items[index].end_time);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteItem = (index) => {
    axios.delete(`${API_BASE_URL}/progress-tracker/${items[index].id}`)
      .then(() => {
        setItems(items.filter((_, i) => i !== index));
        setTime(prevTime => {
          const { [index]: _, ...rest } = prevTime;
          return rest;
        });
        setNotes(prevNotes => prevNotes.filter((_, i) => i !== index));
      })
      .catch(error => console.error('Error deleting item:', error.response ? error.response.data : error.message));
  };

  const handleStartTimer = (index) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setStartTime(new Date().toISOString()); // Set start time
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
    setEndTime(new Date().toISOString()); // Set end time
    setActiveIndex(null);
  };

  const handleAddNote = (index) => {
    if (editNoteIndex !== null) {
      setNotes(prevNotes => {
        const updatedNotes = [...prevNotes];
        updatedNotes[index][editNoteIndex] = noteInput;
        return updatedNotes;
      });
      setEditNoteIndex(null);
    } else {
      setNotes(prevNotes => {
        const updatedNotes = [...prevNotes];
        updatedNotes[index] = [...(updatedNotes[index] || []), noteInput];
        return updatedNotes;
      });
    }
    setNoteInput('');
  };

  const handleEditNote = (index, noteIndex) => {
    setNoteEditingIndex(index);
    setEditNoteIndex(noteIndex);
    setNoteInput(notes[index][noteIndex] || ''); // Ensure it is a controlled input
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
          value={input || ''} // Ensure input is always controlled
          onChange={handleInputChange}
          placeholder="Add a new item"
          className="inventory-input"
        />
        <button onClick={handleAddItem} className="inventory-button">
          {isEditing ? 'Update Item' : 'Add Item'}
        </button>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <div>
              <h3>{item.name}</h3>
              <p>Start Time: {item.start_time}</p>
              <p>End Time: {item.end_time}</p>
              <button onClick={() => handleEditItem(index)}>Edit</button>
              <button onClick={() => handleDeleteItem(index)}>Delete</button>
              {activeIndex === index ? (
                <>
                  <button onClick={handlePauseTimer}>Pause Timer</button>
                  <button onClick={handleEndTimer}>End Timer</button>
                </>
              ) : (
                <button onClick={() => handleStartTimer(index)}>Start Timer</button>
              )}
              <div>Time: {Math.floor(time[index] / 60)}:{time[index] % 60}</div>
              <textarea
                value={noteInput}
                onChange={handleNoteChange}
                placeholder="Add a note"
                className="note-input"
              />
              <button onClick={() => handleAddNote(index)} className="note-button">
                {editNoteIndex !== null ? 'Update Note' : 'Add Note'}
              </button>
              <ul>
                {(notes[index] || []).map((note, noteIndex) => (
                  <li key={noteIndex}>
                    {note}
                    <button onClick={() => handleEditNote(index, noteIndex)}>Edit</button>
                    <button onClick={() => handleDeleteNote(index, noteIndex)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressTracker;
