import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { useStore } from './store';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: 'var(--node-bg)',
          color: 'var(--text-color)',
          border: '1px solid var(--primary-accent)',
          backdropFilter: 'var(--glass-blur)',
          boxShadow: '0 8px 32px var(--node-shadow)'
        }
      }}/>
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
}

export default App;
