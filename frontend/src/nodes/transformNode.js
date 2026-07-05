import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TransformNode = ({ id, data }) => {
  const [format, setFormat] = useState(data?.format || 'JSON');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleChange = (e) => {
    setFormat(e.target.value);
    updateNodeField(id, 'format', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Transform Data"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
        { type: 'source', position: Position.Right, id: `${id}-output` }
      ]}
    >
      <div className="node-field">
        <label>Format To:</label>
        <select className="nodrag" value={format} onChange={handleChange}>
          <option value="JSON">JSON</option>
          <option value="CSV">CSV</option>
          <option value="XML">XML</option>
        </select>
      </div>
    </BaseNode>
  );
};
