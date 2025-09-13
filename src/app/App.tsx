import { QueryProvider } from './providers/QueryProvider';
import { WorkbenchPage } from '../pages/Workbench/WorkbenchPage';
import ThemeProvider from './providers/ThemeProvider';

export default function App() {
    return (
        <QueryProvider>
            <ThemeProvider>
                <WorkbenchPage />
            </ThemeProvider>
        </QueryProvider>
    );
}
