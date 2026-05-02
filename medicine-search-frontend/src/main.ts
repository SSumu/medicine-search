import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

// bootstrapApplication(App, appConfig)
//   .catch((err) => console.error(err));

function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = reject;

    document.head.appendChild(script);
  });
}

// ✅ Load Maps FIRST, then bootstrap Angular (ONLY ONCE)
loadGoogleMaps()
  .then(() => {
  return bootstrapApplication(App, appConfig);
})
  .catch(err => console.error(err));
