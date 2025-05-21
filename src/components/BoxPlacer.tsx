import { useState } from 'react';

interface Box {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  keywords: string[];
}

export const BoxPlacer = () => {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [activeBox, setActiveBox] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {  // Only create new box if clicking on the background
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newBox: Box = {
        id: Date.now(),
        x,
        y,
        width: 100,
        height: 100,
        keywords: [],
      };

      setBoxes([...boxes, newBox]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, boxId: number) => {
    e.stopPropagation();
    setActiveBox(boxId);
    setIsResizing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isResizing && activeBox !== null) {
      e.preventDefault();
      const box = boxes.find(b => b.id === activeBox);
      if (box) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        setBoxes(boxes.map(b => {
          if (b.id === activeBox) {
            return {
              ...b,
              width: Math.max(50, Math.abs(x - b.x) * 2),
              height: Math.max(50, Math.abs(y - b.y) * 2)
            };
          }
          return b;
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setActiveBox(null);
  };

  const addKeyword = (boxId: number) => {
    if (newKeyword.trim()) {
      setBoxes(boxes.map(box => {
        if (box.id === boxId) {
          return {
            ...box,
            keywords: [...box.keywords, newKeyword.trim()]
          };
        }
        return box;
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (boxId: number, keywordIndex: number) => {
    setBoxes(boxes.map(box => {
      if (box.id === boxId) {
        return {
          ...box,
          keywords: box.keywords.filter((_, index) => index !== keywordIndex)
        };
      }
      return box;
    }));
  };

  return (
    <div 
      className="relative w-full h-screen bg-gray-100" 
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {boxes.map((box) => (
        <div key={box.id} className="absolute">
          <div
            className={`absolute border-2 border-blue-500 bg-blue-100 bg-opacity-50 cursor-move ${
              activeBox === box.id ? 'ring-2 ring-blue-600' : ''
            }`}
            style={{
              left: `${box.x}px`,
              top: `${box.y}px`,
              width: `${box.width}px`,
              height: `${box.height}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
              onMouseDown={(e) => handleMouseDown(e, box.id)}
            />
          </div>
          {/* Keywords section */}
          <div
            className="absolute p-2 bg-white rounded shadow-md"
            style={{
              left: `${box.x}px`,
              top: `${box.y + box.height/2 + 20}px`,
              transform: 'translateX(-50%)',
              minWidth: '200px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 flex-wrap mb-2">
              {box.keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-blue-100 rounded-full text-sm flex items-center gap-1"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(box.id, index)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword(box.id)}
                className="flex-1 px-2 py-1 border rounded"
                placeholder="Add keyword"
              />
              <button
                onClick={() => addKeyword(box.id)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 