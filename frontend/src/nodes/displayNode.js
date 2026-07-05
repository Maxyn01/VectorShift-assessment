import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import React from 'react';
export const DisplayNode = ({ id, data }) => {
  const [value, setValue] = React.useState(data?.value || '');

  React.useEffect(() => {
    if (data?.value) {
      setValue(data.value);
    }
  }, [data?.value]);

  return (
    <BaseNode
      id={id}
      title="Display"
      handles={[
        { type: 'target', position: Position.Left, id: `${id}-input` },
        { type: 'source', position: Position.Right, id: `${id}-output` }
      ]}
    >
      <div className="node-display-box" style={{ 
        minHeight: '40px', 
        padding: '8px', 
        backgroundColor: 'rgba(0,0,0,0.05)', 
        borderRadius: '6px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10px'
      }}>
        {value || 'Waiting for input...'}
      </div>
    </BaseNode>
  );
};
