import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const MathNode = ({ id, data }) => {
  const [operation, setOperation] = useState(data?.operation || 'Add');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleChange = (e) => {
    setOperation(e.target.value);
    updateNodeField(id, 'operation', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Math Operation"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-a`, style: { top: '33%' } },
        { type: 'target', position: Position.Left, id: `${id}-b`, style: { top: '66%' } },
        { type: 'source', position: Position.Right, id: `${id}-result` }
      ]}
    >
      <div className="node-field">
        <label>Operation:</label>
        <select className="nodrag" value={operation} onChange={handleChange}>
          <option value="Add">Add (+)</option>
          <option value="Subtract">Subtract (-)</option>
          <option value="Multiply">Multiply (×)</option>
          <option value="Divide">Divide (÷)</option>
        </select>
      </div>
    </BaseNode>
  );
};
