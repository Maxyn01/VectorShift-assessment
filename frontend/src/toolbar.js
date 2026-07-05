// toolbar.js

import { DraggableNode } from './draggableNode';
import { 
  Type, 
  ArrowRightToLine, 
  ArrowLeftFromLine, 
  Cpu,
  Globe,
  Calculator,
  Repeat,
  Monitor,
  Filter,
  Sun,
  Moon,
  Wand2
} from 'lucide-react';

import { SubmitButton } from './submit';
import { useStore } from './store';

export const PipelineToolbar = () => {
    const theme = useStore(state => state.theme);
    const toggleTheme = useStore(state => state.toggleTheme);
    const autoLayout = useStore(state => state.autoLayout);

    return (
        <div className="toolbar-container">
            <div className="toolbar-left">
                <div className="toolbar-header">
                    <span style={{color: 'var(--text-color)'}}>VectorShift</span> <span style={{opacity: 0.3}}>|</span> Pipeline Builder
                </div>
                <div className="toolbar-nodes">
                    <DraggableNode type='customInput' label='Input' icon={<ArrowRightToLine size={16} />} />
                    <DraggableNode type='llm' label='LLM' icon={<Cpu size={16} />} />
                    <DraggableNode type='customOutput' label='Output' icon={<ArrowLeftFromLine size={16} />} />
                    <DraggableNode type='text' label='Text' icon={<Type size={16} />} />
                    
                    {/* New Nodes */}
                    <DraggableNode type='api' label='API Request' icon={<Globe size={16} />} />
                    <DraggableNode type='math' label='Math' icon={<Calculator size={16} />} />
                    <DraggableNode type='transform' label='Transform' icon={<Repeat size={16} />} />
                    <DraggableNode type='display' label='Display' icon={<Monitor size={16} />} />
                    <DraggableNode type='filter' label='Filter' icon={<Filter size={16} />} />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button 
                      onClick={autoLayout}
                      style={{
                        background: 'transparent', 
                        border: '1px solid var(--node-border)', 
                        color: 'var(--text-muted)', 
                        cursor: 'pointer', 
                        padding: '6px', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      title="Auto-Layout Graph"
                    >
                        <Wand2 size={16} />
                    </button>
                    <button 
                      onClick={toggleTheme} 
                      style={{
                        background: 'transparent', 
                        border: '1px solid var(--node-border)', 
                        color: 'var(--text-muted)', 
                        cursor: 'pointer', 
                        padding: '6px', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      title="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>
                <SubmitButton />
            </div>
        </div>
    );
};
