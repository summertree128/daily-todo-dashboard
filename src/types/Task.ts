export interface Task {
  id: string;
  title: string;
  completed: boolean;
  size: {
    width: number;  // in grid units (1-5)
    height: number; // in grid units (1-6)
  };
  position: {
    x: number; // grid position (0-4)
    y: number; // grid position (0-5)
  };
} 