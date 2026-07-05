import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import toast from 'react-hot-toast';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('pipeline', JSON.stringify({ nodes, edges }));

            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            if (data.error) {
                toast.error(`Backend Error: ${data.error}`);
            } else if (data.is_dag) {
                toast.success(
                  `Pipeline Validated!\nNodes: ${data.num_nodes} | Edges: ${data.num_edges}\nDAG: Yes`, 
                  { duration: 4000 }
                );
            } else {
                toast.error(
                  `Pipeline Invalid!\nNodes: ${data.num_nodes} | Edges: ${data.num_edges}\nDAG: No (Cycle Detected)`, 
                  { duration: 4000 }
                );
            }
        } catch (error) {
            console.error('Error parsing pipeline:', error);
            toast.error('Failed to connect to backend. Is it running?');
        }
    };

    return (
        <div className="submit-container">
            <button type="submit" className="submit-btn" onClick={handleSubmit}>
                Submit Pipeline
            </button>
        </div>
    );
}
