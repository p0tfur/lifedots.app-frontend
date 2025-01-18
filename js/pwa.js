// Store the install prompt for later use
let deferredPrompt = null;
const installButton = document.getElementById('installButton');

console.log(' PWA Script loaded');
console.log(' Install button element:', installButton);

// Hide install button initially
if (installButton) {
    installButton.style.display = 'none';
    console.log(' Install button initially hidden');
} else {
    console.warn(' Install button not found in the DOM');
}

// Check if the app is running in standalone mode (already installed)
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log(' App is running in standalone mode (installed)');
}

window.addEventListener('beforeinstallprompt', (e) => {
    console.log(' beforeinstallprompt event fired', e);
    // Don't prevent default behavior
    deferredPrompt = e;
    
    // Show the install button
    if (installButton) {
        installButton.style.display = 'block';
        console.log(' Install button shown');
    }
});

// Add click event listener to install button
if (installButton) {
    installButton.addEventListener('click', async () => {
        console.log(' Install button clicked');
        
        if (!deferredPrompt) {
            console.warn(' No installation prompt available');
            return;
        }

        // Show the installation prompt
        try {
            console.log(' Showing install prompt...');
            const result = await deferredPrompt.prompt();
            console.log(' Install prompt result:', result);
            
            const { outcome } = await deferredPrompt.userChoice;
            console.log(' User choice:', outcome);
            
            // Reset the deferred prompt variable
            deferredPrompt = null;
            
            // Hide the install button
            installButton.style.display = 'none';
            console.log(' Install button hidden after prompt');
        } catch (err) {
            console.error(' Error showing install prompt:', err);
        }
    });
    console.log(' Install button click handler attached');
}

window.addEventListener('appinstalled', (event) => {
    console.log(' App was successfully installed!');
    // Hide the install button
    if (installButton) {
        installButton.style.display = 'none';
        console.log(' Install button hidden after installation');
    }
    // Clear the deferredPrompt
    deferredPrompt = null;
});
