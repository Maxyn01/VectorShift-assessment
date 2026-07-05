// draggableNode.js
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  selectedNodeForDrop: state.selectedNodeForDrop,
  setSelectedNodeForDrop: state.setSelectedNodeForDrop,
});

export const DraggableNode = ({ type, label, icon }) => {
    const { selectedNodeForDrop, setSelectedNodeForDrop } = useStore(selector, shallow);
    const isSelected = selectedNodeForDrop === type;

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
      setSelectedNodeForDrop(null); // Clear selection if user starts dragging
    };

    const handleClick = () => {
      if (isSelected) {
        setSelectedNodeForDrop(null); // Deselect
      } else {
        setSelectedNodeForDrop(type); // Select
      }
    };
  
    return (
      <div
        className={`draggable-node ${type} ${isSelected ? 'selected' : ''}`}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        onClick={handleClick}
        draggable
      >
          {icon && <div className="node-icon">{icon}</div>}
          <span className="node-label">{label}</span>
      </div>
    );
};