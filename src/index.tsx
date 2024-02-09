// import LogRocket from 'logrocket'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
const root = createRoot(rootElement)
root.render(<App />)
// LogRocket.init('hzip7o/da')

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
