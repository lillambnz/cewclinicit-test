/**
 * Tawk.to Widget Customization for ClinicIT.Solutions
 * Matches website branding and colors
 */

// Wait for Tawk.to to load
var Tawk_API = Tawk_API || {};

// Customize widget appearance
Tawk_API.onLoad = function() {
    console.log('🎨 Customizing Tawk.to widget for ClinicIT.Solutions');
    
    // Custom CSS for widget styling
    const customStyles = `
        <style>
        /* Tawk.to Widget Customization */
        #tawk-bubble {
            background: linear-gradient(135deg, #c47d5a, #a8694d) !important;
            box-shadow: 0 4px 15px rgba(196, 125, 90, 0.3) !important;
            border-radius: 50px !important;
            transition: all 0.3s ease !important;
        }
        
        #tawk-bubble:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(196, 125, 90, 0.4) !important;
        }
        
        /* Chat window header */
        .tawk-chatinput-editor {
            border-color: #c47d5a !important;
        }
        
        /* Send button */
        .tawk-button {
            background: linear-gradient(135deg, #c47d5a, #a8694d) !important;
            border: none !important;
            border-radius: 8px !important;
        }
        
        .tawk-button:hover {
            background: linear-gradient(135deg, #a8694d, #0b7a5f) !important;
            transform: translateY(-1px) !important;
        }
        
        /* Chat header */
        .tawk-header {
            background: linear-gradient(135deg, #c47d5a, #a8694d) !important;
        }
        
        /* Links in chat */
        .tawk-chat a {
            color: #c47d5a !important;
        }
        
        .tawk-chat a:hover {
            color: #a8694d !important;
        }
        
        /* Widget animation */
        @keyframes tawkPulse {
            0% { box-shadow: 0 0 0 0 rgba(196, 125, 90, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(196, 125, 90, 0); }
            100% { box-shadow: 0 0 0 0 rgba(196, 125, 90, 0); }
        }
        
        #tawk-bubble.pulse {
            animation: tawkPulse 2s infinite;
        }
        </style>
    `;
    
    // Inject custom styles
    document.head.insertAdjacentHTML('beforeend', customStyles);
    
    // Add pulse animation periodically
    setInterval(function() {
        const bubble = document.querySelector('#tawk-bubble');
        if (bubble && !document.querySelector('.tawk-chat-panel')) {
            bubble.classList.add('pulse');
            setTimeout(() => bubble.classList.remove('pulse'), 2000);
        }
    }, 10000); // Pulse every 10 seconds when closed
};

// Customize chat messages and behavior
Tawk_API.onChatMessageVisitor = function(message) {
    console.log('💬 Visitor message:', message);
};

Tawk_API.onChatMessageAgent = function(message) {
    console.log('👤 Agent response:', message);
};

// Set custom visitor attributes
Tawk_API.visitor = {
    name: 'Website Visitor',
    email: '',
    website: 'clinicit.solutions'
};

// Add business context to chat
Tawk_API.addEvent('Page Visit', {
    'page': window.location.pathname,
    'business': 'IT Services for Medical Practices',
    'location': 'Perth, Western Australia'
});

// Welcome message configuration
Tawk_API.customStyle = {
    visibility: {
        desktop: {
            position: 'br', // bottom right
            xOffset: 20,
            yOffset: 20
        },
        mobile: {
            position: 'br',
            xOffset: 10, 
            yOffset: 10
        }
    }
};

console.log('✅ ClinicIT.Solutions Tawk.to customization loaded');