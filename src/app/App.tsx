import { QueryProvider } from './providers/QueryProvider';
import { WorkbenchPage } from '../pages/Workbench/WorkbenchPage';

export default function App() {
    return (
        <QueryProvider>
            <WorkbenchPage />
        </QueryProvider>
    );
}