import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

window.addEventListener('error', e => console.error('[onerror]', e.message))
window.addEventListener('unhandledrejection', e => console.error('[unhandled]', e.reason))
console.log('boot', import.meta.env.BASE_URL)

const root = document.getElementById('root')
if (!root) {
  document.body.innerHTML = '<pre style="color:red">#root not found</pre>'
} else {
  ReactDOM.createRoot(root).render(<App />)
}
