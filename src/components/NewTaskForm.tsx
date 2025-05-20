import { useState } from 'react';
import type { Task } from '../types/Task';

interface NewTaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
}

const TASK_SIZES = [
  { label: 'Small (1x1)', width: 1, height: 1 },
  { label: 'Wide (2x1)', width: 2, height: 1 },
  { label: 'Tall (1x2)', width: 1, height: 2 },
  { label: 'Large (2x2)', width: 2, height: 2 },
  { label: 'Extra Wide (3x1)', width: 3, height: 1 },
  { label: 'Extra Large (3x2)', width: 3, height: 2 },
];

export const NewTaskForm: React.FC<NewTaskFormProps> = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [selectedSize, setSelectedSize] = useState(TASK_SIZES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        completed: false,
        size: {
          width: selectedSize.width,
          height: selectedSize.height,
        },
        position: { x: 0, y: 0 }, // この位置はTaskGridで上書きされます
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-size">Task Size</label>
            <select
              id="task-size"
              value={selectedSize.label}
              onChange={(e) => {
                const size = TASK_SIZES.find(s => s.label === e.target.value);
                if (size) setSelectedSize(size);
              }}
              className="size-select"
            >
              {TASK_SIZES.map(size => (
                <option key={size.label} value={size.label}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div className="size-preview">
            <h3>Preview</h3>
            <div 
              className="preview-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${selectedSize.width}, 40px)`,
                gridTemplateRows: `repeat(${selectedSize.height}, 40px)`,
                gap: '4px',
                margin: '0 auto',
                justifyContent: 'center'
              }}
            >
              {Array.from({ length: selectedSize.width * selectedSize.height }, (_, i) => (
                <div
                  key={i}
                  className="preview-cell"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: '4px',
                    opacity: 0.7,
                    width: '40px',
                    height: '40px'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 