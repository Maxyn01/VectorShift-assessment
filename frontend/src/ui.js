// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { APINode } from './nodes/apiNode';
import { MathNode } from './nodes/mathNode';
import { TransformNode } from './nodes/transformNode';
import { DisplayNode } from './nodes/displayNode';
import { FilterNode } from './nodes/filterNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: APINode,
  math: MathNode,
  transform: TransformNode,
  display: DisplayNode,
  filter: FilterNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  selectedNodeForDrop: state.selectedNodeForDrop,
  setSelectedNodeForDrop: state.setSelectedNodeForDrop,
  // Edge selection & removal
  selectedEdgeId: state.selectedEdgeId,
  setSelectedEdgeId: state.setSelectedEdgeId,
  removeEdge: state.removeEdge,
  // Undo/redo shortcuts
  undo: state.undo,
  redo: state.redo,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      selectedNodeForDrop,
      setSelectedNodeForDrop,
      // Edge selection & removal
      selectedEdgeId,
      setSelectedEdgeId,
      removeEdge,
      // Undo/redo shortcuts
      undo,
      redo,
    } = useStore(selector, shallow);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, addNode, getNodeID]
    );

    const onPaneClick = useCallback((event) => {
      // Deselect any selected wire when clicking the background
      if (selectedEdgeId) {
        setSelectedEdgeId(null);
      }

      if (selectedNodeForDrop && reactFlowInstance) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(selectedNodeForDrop);
        const newNode = {
          id: nodeID,
          type: selectedNodeForDrop,
          position,
          data: getInitNodeData(nodeID, selectedNodeForDrop),
        };
  
        addNode(newNode);
        setSelectedNodeForDrop(null); // Clear selection after dropping
      }
    }, [reactFlowInstance, addNode, getNodeID, selectedNodeForDrop, setSelectedNodeForDrop, selectedEdgeId, setSelectedEdgeId]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    useEffect(() => {
      const handler = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          undo();
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
          e.preventDefault();
          redo();
        }
        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEdgeId) {
          e.preventDefault();
          removeEdge(selectedEdgeId);
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [undo, redo, selectedEdgeId, removeEdge]);

    return (
        <>
        <div ref={reactFlowWrapper} style={{flex: 1, width: '100%', position: 'relative'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges.map(edge => ({
                  ...edge,
                  // Highlight selected edge
                  style: edge.id === selectedEdgeId ? { stroke: 'var(--primary-accent-glow)', strokeWidth: 4 } : edge.style,
                }))}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onPaneClick={onPaneClick}
                onEdgeClick={(event, edge) => {
                  if (selectedEdgeId === edge.id) setSelectedEdgeId(null);
                  else setSelectedEdgeId(edge.id);
                }}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                connectionLineType='smoothstep'
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap />
            </ReactFlow>
            {/* Delete selected edge with Delete key */}
            {selectedEdgeId && (
                <div
                  style={{ position: 'absolute', top: 10, right: 10, zIndex: 20 }}
                >
                  <button
                    style={{
                      background: 'var(--node-border)',
                      border: 'none',
                      color: 'var(--text-muted)',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                    onClick={() => removeEdge(selectedEdgeId)}
                    title="Delete selected edge (or press Delete key)"
                  >
                    Delete Edge
                  </button>
                </div>
              )}
        </div>
        </>
    )
}
