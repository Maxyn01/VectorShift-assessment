import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const APINode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [endpoint, setEndpoint] = useState(data?.endpoint || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    updateNodeField(id, 'method', e.target.value);
  };

  const handleEndpointChange = (e) => {
    setEndpoint(e.target.value);
    updateNodeField(id, 'endpoint', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="API Request"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-trigger` },
        { type: 'target', position: Position.Left, id: `${id}-body`, style: { top: '66%' } },
        { type: 'source', position: Position.Right, id: `${id}-response` },
        { type: 'source', position: Position.Right, id: `${id}-error`, style: { top: '66%' } }
      ]}
    >
      <div className="node-field">
        <label>Method:</label>
        <select className="nodrag" value={method} onChange={handleMethodChange}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="node-field">
        <label>Endpoint:</label>
        <input 
          className="nodrag"
          type="text" 
          value={endpoint} 
          onChange={handleEndpointChange} 
          placeholder="https://api.example.com"
        />
      </div>
    </BaseNode>
  );
};
