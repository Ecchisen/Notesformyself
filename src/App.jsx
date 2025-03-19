import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// UI Components
const Input = ({ placeholder, value, onChange, className }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`p-2 border border-gray-300 rounded-md w-full ${className}`}
  />
);

const Textarea = ({ placeholder, value, onChange, className }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`p-2 border border-gray-300 rounded-md w-full ${className}`}
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

const Select = ({ value, onChange, options, className }) => (
  <select
    value={value}
    onChange={onChange}
    className={`p-2 border border-gray-300 rounded-md w-full ${className}`}
  >
    {options.map((opt, idx) => (
      <option key={idx} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

const Card = ({ children, className }) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// Main Component
export default function FlashcardApp() {
  const [flashcards, setFlashcards] = useState([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [category, setCategory] = useState("General");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load flashcards from local storage
  useEffect(() => {
    const savedFlashcards = localStorage.getItem("flashcards");
    if (savedFlashcards) {
      setFlashcards(JSON.parse(savedFlashcards));
    }
  }, []);

  // Save flashcards to local storage
  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  // Add a new flashcard
  const addFlashcard = () => {
    if (front.trim() && back.trim()) {
      setFlashcards([...flashcards, { front, back, category, tags }]);
      setFront("");
      setBack("");
      setCategory("General");
      setTags([]);
    }
  };

  // Delete a flashcard
  const deleteFlashcard = (index) => {
    const updatedFlashcards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedFlashcards);
  };

  // Add a tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove a tag
  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Filtered flashcards
  const filteredFlashcards =
    selectedCategory === "All"
      ? flashcards
      : flashcards.filter((card) => card.category === selectedCategory);

  // Download flashcards as a JSON file
  const downloadFlashcards = () => {
    const blob = new Blob([JSON.stringify(flashcards, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flashcards.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Upload flashcards from a JSON file
  const uploadFlashcards = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const uploadedFlashcards = JSON.parse(e.target.result);
        setFlashcards(uploadedFlashcards);
      } catch (error) {
        alert("Invalid file format. Please upload a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">Flashcard Notes</h1>

      {/* Category Filter */}
      <div className="mb-4">
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={["All", "Daily", "Study", "Programming", "Future"]}
        />
      </div>

      {/* Flashcard Input Fields */}
      <div className="mb-4 space-y-2">
        <Input
          placeholder="Title of the note"
          value={front}
          onChange={(e) => setFront(e.target.value)}
        />
        <Textarea
          placeholder="Content of the note"
          value={back}
          onChange={(e) => setBack(e.target.value)}
        />

        {/* Category Selector */}
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={["Daily", "Study", "Programming", "Future"]}
        />

        {/* Tags Input */}
        <div className="flex space-x-2">
          <Input
            placeholder="Add a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          <Button onClick={addTag} className="bg-gray-600 hover:bg-gray-700">
            Add Tag
          </Button>
        </div>

        {/* Display Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 px-2 py-1 rounded-md text-sm cursor-pointer"
              onClick={() => removeTag(tag)}
            >
              {tag} ❌
            </span>
          ))}
        </div>

        <Button onClick={addFlashcard} className="w-full">
          Add Flashcard
        </Button>
      </div>

      {/* Download & Upload Buttons */}
      <div className="flex justify-between mt-4">
        <Button onClick={downloadFlashcards} className="bg-green-500 hover:bg-green-600">
          Download Flashcards
        </Button>
        <input type="file" accept="application/json" onChange={uploadFlashcards} />
      </div>

      {/* Flashcard List */}
      <div className="space-y-4 mt-6">
        {filteredFlashcards.map((card, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Card className="p-4 rounded-xl">
              <CardContent>
                <p className="text-lg font-semibold">{card.front}</p>
                <p className="text-sm text-gray-500 mt-2">{card.back}</p>
                <p className="text-xs text-blue-600 mt-2">Category: {card.category}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {card.tags.map((tag, i) => (
                    <span key={i} className="bg-gray-300 px-2 py-1 rounded-md text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <Button onClick={() => deleteFlashcard(index)} className="mt-2 bg-red-500 hover:bg-red-600">
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
