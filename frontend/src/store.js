// store.js

import { create } from "zustand";

import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
  } from 'reactflow';
import dagre from 'dagre';

const storeCreator = (set, get) => ({
    theme: 'dark',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    nodes: [],
    edges: [],
    nodeIDs: {},
    selectedNodeForDrop: null,
    setSelectedNodeForDrop: (type) => set({ selectedNodeForDrop: type }),
    // Edge selection & removal
    selectedEdgeId: null,
    setSelectedEdgeId: (id) => set({ selectedEdgeId: id }),
    removeEdge: (edgeId) => set({
      edges: get().edges.filter((e) => e.id !== edgeId),
      selectedEdgeId: null,
    }),
    // Undo history
    history: [],
    future: [],
    undo: () => {
      const hist = get().history;
      if (hist.length > 1) {
        // Save current state for redo
        const current = { nodes: get().nodes, edges: get().edges };
        set({ future: [...get().future, current] });
        // Remove latest state
        hist.pop();
        const prev = hist[hist.length - 1];
        set({ nodes: prev.nodes, edges: prev.edges, history: hist });
      }
    },
    // Redo support
    redo: () => {
      const fut = get().future;
      if (fut.length > 0) {
        const next = fut.pop();
        // Save current state to history before redo
        const current = { nodes: get().nodes, edges: get().edges };
        set({
          nodes: next.nodes,
          edges: next.edges,
          history: [...get().history, current],
          future: fut,
        });
      }
    },
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
    },
    removeNode: (nodeId) => {
        set({
            nodes: get().nodes.filter((n) => n.id !== nodeId),
            edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
        });
    },
    duplicateNode: (nodeId) => {
        const node = get().nodes.find(n => n.id === nodeId);
        if (node) {
            const newId = `${node.type}-${Date.now()}`;
            const newNode = {
                ...JSON.parse(JSON.stringify(node)), // Deep copy to avoid reference issues
                id: newId,
                position: { x: node.position.x + 50, y: node.position.y + 50 },
                selected: false
            };
            set({
                nodes: [...get().nodes, newNode],
                nodeIDs: { ...get().nodeIDs, [node.type]: (get().nodeIDs[node.type] || 0) + 1 }
            });
        }
    },
    autoLayout: () => {
        const dagreGraph = new dagre.graphlib.Graph();
        dagreGraph.setDefaultEdgeLabel(() => ({}));
        
        // Direction 'LR' = Left to Right. Increase separation to prevent overlap.
        dagreGraph.setGraph({ 
            rankdir: 'LR', 
            ranksep: 350, // Massive horizontal space so wires don't cross nodes
            nodesep: 150  // Vertical space
        });

        const nodes = get().nodes;
        const edges = get().edges;

        nodes.forEach((node) => {
            // Give a massive bounding box (width 400, height 300) to guarantee no overlapping
            dagreGraph.setNode(node.id, { width: 400, height: 300 }); 
        });

        edges.forEach((edge) => {
            dagreGraph.setEdge(edge.source, edge.target);
        });

        dagre.layout(dagreGraph);

        const layoutedNodes = nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id);
            return {
                ...node,
                position: {
                    x: nodeWithPosition.x - 130, // center offset
                    y: nodeWithPosition.y - 75
                }
            };
        });

        set({ nodes: layoutedNodes });
    },
    onNodesChange: (changes) => {
      set((state) => {
        const newNodes = applyNodeChanges(changes, state.nodes);
        // Only record history for non-position changes to avoid flooding on drag
        const isPositionOnly = changes.every(c => c.type === 'position' && c.dragging);
        const newHistory = isPositionOnly
          ? state.history
          : [...state.history.slice(-49), { nodes: newNodes, edges: state.edges }];
        return { nodes: newNodes, history: newHistory, future: isPositionOnly ? state.future : [] };
      });
    },
    onEdgesChange: (changes) => {
      set((state) => {
        const newEdges = applyEdgeChanges(changes, state.edges);
        const newHistory = [...state.history.slice(-49), { nodes: state.nodes, edges: newEdges }];
        return { edges: newEdges, history: newHistory, future: [] };
      });
    },
    onConnect: (connection) => {
        set((state) => {
            const newEdges = addEdge({ 
                ...connection, 
                type: 'smoothstep', 
                animated: true, 
                style: { stroke: 'var(--primary-accent)', strokeWidth: 2 }
            }, state.edges);
            const newHistory = [...state.history.slice(-49), { nodes: state.nodes, edges: newEdges }];
            return { edges: newEdges, history: newHistory, future: [] };
        });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
    cleanOrphanedEdges: (nodeId, validTargetHandleIds) => {
      set({
        edges: get().edges.filter(e => {
          // If the edge points into this node, check if the specific handle still exists
          if (e.target === nodeId && e.targetHandle) {
            return validTargetHandleIds.includes(e.targetHandle);
          }
          return true;
        })
      });
    },
});

export const useStore = create(storeCreator);
