import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Define the missing components
const Input = ({ placeholder, value, onChange, className }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`p-2 border border-gray-300 rounded-md ${className}`}
  />
);

const Textarea = ({ placeholder, value, onChange, className }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`p-2 border border-gray-300 rounded-md ${className}`}
  />
);

const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className }) => (
  <div className={`bg-white border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// Main FlashcardApp component
export default function FlashcardApp() {
  const [flashcards, setFlashcards] = useState([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  // Load flashcards from local storage on initial render
  useEffect(() => {
    const savedFlashcards = localStorage.getItem("flashcards");
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards));
    }
  }, []);

  // Save flashcards to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  const addFlashcard = () => {
    if (front.trim() && back.trim()) {
      setFlashcards([...flashcards, { front, back }]);
      setFront("");
      setBack("");
    }
  };

  const deleteFlashcard = (index) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Notes For Myself</h1>
      <div className="mb-4 space-y-2">
        <Input
          placeholder="Front of the flashcard"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <Textarea
          placeholder="Back of the flashcard"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />
        <Button onClick={addFlashcard} className="w-full">
          Add Flashcard
        </Button>
      </div>

      <div className="space-y-4">
        {flashcards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="p-4 rounded-xl shadow-md">
              <CardContent>
                <p className="text-lg font-semibold">{card.front}</p>
                <p className="text-sm text-gray-500 mt-2">{card.back}</p>
                <Button
                  onClick={() => deleteFlashcard(index)}
                  className="mt-2 bg-red-500 hover:bg-red-600"
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}