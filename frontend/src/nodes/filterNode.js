import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'Contains');
  const [value, setValue] = useState(data?.value || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
    updateNodeField(id, 'condition', e.target.value);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
    updateNodeField(id, 'value', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Filter"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-array` },
        { type: 'source', position: Position.Right, id: `${id}-filtered` }
      ]}
    >
      <div className="node-field">
        <label>Condition:</label>
        <select className="nodrag" value={condition} onChange={handleConditionChange}>
          <option value="Contains">Contains</option>
          <option value="Equals">Equals</option>
          <option value="GreaterThan">Greater Than</option>
          <option value="StartsWith">Starts With</option>
          <option value="EndsWith">Ends With</option>
        </select>
      </div>
      <div className="node-field">
        <label>Value:</label>
        <input 
          className="nodrag"
          type="text" 
          value={value} 
          onChange={handleValueChange} 
        />
      </div>
    </BaseNode>
  );
};
