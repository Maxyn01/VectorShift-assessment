import { useState, useEffect, useRef } from 'react';
import { Position, useUpdateNodeInternals } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    let match;
    const newVars = new Set();
    while ((match = regex.exec(currText)) !== null) {
      newVars.add(match[1]);
    }
    setVariables(Array.from(newVars));
  }, [currText]);

  const cleanOrphanedEdges = useStore((state) => state.cleanOrphanedEdges);

  useEffect(() => {
    updateNodeInternals(id);
    
    // When variables change, some handles might have been deleted.
    // We tell the store to remove any edges connected to handles that no longer exist.
    const validHandleIds = variables.map(v => `${id}-${v}`);
    cleanOrphanedEdges(id, validHandleIds);
  }, [variables, id, updateNodeInternals, cleanOrphanedEdges]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  const variableHandles = variables.map((variable, index) => ({
    type: 'target',
    position: Position.Left,
    id: `${id}-${variable}`,
    style: { top: `${((index + 1) * 100) / (variables.length + 1)}%` },
  }));

  const handles = [
    ...variableHandles,
    { type: 'source', position: Position.Right, id: `${id}-output` }
  ];

  return (
    <BaseNode
      id={id}
      title="Text"
      handles={handles}
    >
      <div className="node-field">
        <label>Text:</label>
        <textarea 
          ref={textareaRef}
          value={currText}
          onChange={handleTextChange}
          className="nodrag text-node-textarea"
          rows={1}
        />
      </div>
    </BaseNode>
  );
};
