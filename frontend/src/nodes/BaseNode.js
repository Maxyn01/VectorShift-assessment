import { Handle } from 'reactflow';
import { useStore } from '../store';
import { X, Copy } from 'lucide-react';
import '../index.css';

export const BaseNode = ({ id, title, children, handles = [] }) => {
  const removeNode = useStore((state) => state.removeNode);
  const duplicateNode = useStore((state) => state.duplicateNode);

  return (
    <div className="node-container">
      <button 
        className="node-icon-btn node-copy-btn" 
        onClick={() => duplicateNode(id)}
        title="Duplicate Node"
      >
        <Copy size={12} />
      </button>
      <button 
        className="node-icon-btn node-delete-btn" 
        onClick={() => removeNode(id)}
        title="Delete Node"
      >
        <X size={12} />
      </button>
      
      {handles.map((handle, index) => {
        // Parse a friendly name from the ID (e.g., "text-1-name" -> "name")
        const friendlyName = handle.id.split('-').pop();
        const tooltip = handle.type === 'target' 
            ? `Input: ${friendlyName}`
            : `Output: ${friendlyName}`;

        return (
          <Handle
            key={`${id}-handle-${index}`}
            type={handle.type}
            position={handle.position}
            id={handle.id}
            style={handle.style}
            className="custom-handle"
          >
            <div className="handle-tooltip">{tooltip}</div>
          </Handle>
        );
      })}
      <div className="node-header">
        <span>{title}</span>
      </div>
      <div className="node-content">
        {children}
      </div>
    </div>
  );
};
