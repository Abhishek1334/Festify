import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

axios.defaults.withCredentials = true;

import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';
import '@fontsource/geist-mono/400.css';
import '@fontsource/geist-mono/500.css';

import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider';
import { queryClient } from './lib/queryClient';

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<App />
			</AuthProvider>
		</QueryClientProvider>
	</BrowserRouter>
);
