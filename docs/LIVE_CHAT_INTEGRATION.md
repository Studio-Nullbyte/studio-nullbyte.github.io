# Live Chat Integration Guide

## 🎯 **Recommended: Crisp Chat**

Crisp is perfect for Studio Nullbyte because:
- ✅ **GitHub Pages Compatible** - Pure JavaScript integration
- ✅ **Developer-Friendly** - Clean, minimal interface 
- ✅ **Customizable** - Matches your dark theme
- ✅ **Free Tier** - Up to 2 operators, unlimited conversations
- ✅ **Mobile Optimized** - Works great on all devices

### Setup Steps

#### 1. Create Crisp Account
1. Go to [crisp.chat](https://crisp.chat)
2. Sign up for free account
3. Create a new website
4. Copy your Website ID

#### 2. Add to Your Site
Create a new component for the chat widget:

```typescript
// src/components/CrispChat.tsx
import { useEffect } from 'react'

declare global {
  interface Window {
    $crisp: any
    CRISP_WEBSITE_ID: string
  }
}

const CrispChat = () => {
  useEffect(() => {
    // Set your website ID
    window.$crisp = []
    window.CRISP_WEBSITE_ID = process.env.VITE_CRISP_WEBSITE_ID || 'your-website-id'

    // Load Crisp script
    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.getElementsByTagName('head')[0].appendChild(script)

    // Customize to match your theme
    window.$crisp.push(['set', 'appearance:theme', ['dark']])
    window.$crisp.push(['set', 'appearance:color', ['#8B5CF6']]) // Electric violet
    window.$crisp.push(['set', 'appearance:font', ['IBM Plex Mono']])

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null // This component doesn't render anything visible
}

export default CrispChat
```

#### 3. Add to Your App
```typescript
// src/App.tsx
import CrispChat from './components/CrispChat'

function App() {
  return (
    <div className="App">
      {/* ...existing content... */}
      <CrispChat />
    </div>
  )
}
```

#### 4. Environment Variable
Add to your `.env` file:
```env
VITE_CRISP_WEBSITE_ID=your-crisp-website-id-here
```

And to GitHub Secrets for deployment.

### Customization Options

#### Match Studio Nullbyte Theme
```javascript
// Dark theme with electric violet
window.$crisp.push(['set', 'appearance:theme', ['dark']])
window.$crisp.push(['set', 'appearance:color', ['#8B5CF6']])
window.$crisp.push(['set', 'appearance:font', ['IBM Plex Mono']])

// Custom position
window.$crisp.push(['set', 'appearance:position', ['bottom-right']])

// Custom messages
window.$crisp.push(['set', 'session:segments', [['developer-focused']]])
```

## 🎨 **Alternative Options**

### Option 2: Intercom
- **Pros**: Very professional, great features
- **Cons**: More expensive, overkill for small sites
- **Best for**: Larger businesses

### Option 3: Tawk.to
- **Pros**: Completely free
- **Cons**: Less customization
- **Best for**: Budget-conscious projects

### Option 4: Custom Chat (Advanced)
Build your own using:
- **Supabase Realtime** for messaging
- **React state** for UI
- **Custom styling** to match perfectly

## 📱 **Mobile Considerations**

Crisp automatically:
- ✅ Adapts to mobile screens
- ✅ Shows as floating button on mobile
- ✅ Full-screen chat on small devices
- ✅ Works with your responsive design

## 🔧 **Advanced Features**

### Automated Messages
```javascript
// Welcome message for new visitors
window.$crisp.push(['set', 'session:data', [['page', 'homepage']]])

// Trigger based on time spent
setTimeout(() => {
  window.$crisp.push(['do', 'chat:show'])
  window.$crisp.push(['do', 'message:send', ['text', 'Need help with our templates? 👋']])
}, 30000) // After 30 seconds
```

### Customer Context
```javascript
// Send user info if they're logged in
if (user) {
  window.$crisp.push(['set', 'user:email', [user.email]])
  window.$crisp.push(['set', 'user:nickname', [user.name]])
  window.$crisp.push(['set', 'session:data', [['plan', user.subscription]]])
}
```

## 💰 **Pricing Comparison**

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Crisp** | 2 operators, unlimited chats | $25/month |
| **Tawk.to** | Unlimited | $19/month for advanced |
| **Intercom** | 14-day trial | $74/month |
| **Custom** | Free (dev time) | Hosting costs only |

## 🎯 **Recommendation**

**Start with Crisp** because:
1. **Perfect fit** for your developer audience
2. **Easy integration** with GitHub Pages
3. **Customizable** to match your brand
4. **Free tier** is generous
5. **Professional** appearance

The electric violet theme customization will make it look like it was built specifically for Studio Nullbyte!

## 🚀 **Next Steps**

1. **Sign up** for Crisp account
2. **Get your Website ID**
3. **Add environment variable**
4. **Create the component** above
5. **Test the integration**
6. **Customize colors/theme**

Would you like me to implement the Crisp integration for you?
