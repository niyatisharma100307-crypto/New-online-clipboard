import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      appearance={{
        baseTheme: 'dark',
        variables: {
          colorPrimary: '#6366f1',
          colorBackground: '#1a1a1a',
          colorText: '#ffffff',
          colorTextSecondary: '#d1d5db',
          colorInputBackground: '#262626',
          colorInputText: '#ffffff',
          colorInputBorder: '#404040',
          colorNeutral: '#333333',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorDanger: '#ef4444',
          colorShimmer: '#2d2d2d',
          borderRadius: '0.5rem',
          spacingUnit: '1rem',
        },
        elements: {
          rootBox: 'bg-[#1a1a1a]',
          card: 'rounded-lg border border-[#333] bg-[#1a1a1a] shadow-xl',
          cardBox: 'bg-[#1a1a1a]',
          header: 'bg-transparent',
          headerTitle: 'text-white font-bold text-xl',
          headerSubtitle: 'text-gray-400 text-sm',
          formFieldLabel: 'text-white font-semibold',
          formButtonPrimary: 
            'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-all shadow-lg',
          formButtonPrimaryActive: 'bg-indigo-700',
          formFieldInput: 
            'bg-[#262626] border border-[#404040] text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500',
          formFieldInputShowPasswordButton: 'text-gray-400 hover:text-gray-300',
          dividerLine: 'bg-[#333]',
          dividerText: 'text-gray-500 text-sm',
          socialButtonsBlockButton: 
            'border border-[#404040] bg-[#262626] hover:bg-[#333] text-gray-300 transition-all rounded-md font-medium',
          socialButtonsBlockButtonText: 'text-gray-200 font-medium text-sm',
          footerActionLink: 'text-indigo-500 hover:text-indigo-400 transition-colors font-medium',
          footerActionText: 'text-gray-400',
          identityPreviewText: 'text-gray-300',
          identityPreviewEditButton: 'text-indigo-500 hover:text-indigo-400',
          otpCodeFieldInput:
            'bg-[#262626] border border-[#404040] text-white text-center rounded-md focus:ring-2 focus:ring-indigo-500',
          backButton: 'text-indigo-500 hover:text-indigo-400',
          backButtonIcon: 'text-indigo-500',
          formResendCodeLink: 'text-indigo-500 hover:text-indigo-400',
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
