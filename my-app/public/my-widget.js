(function () {
  const script = document.currentScript;
  const widgetId = script.getAttribute('data-id');
  const container = document.getElementById("my-widget");
  console.log(`[Widget] Initializing widget for: ${widgetId}`);

  async function trackImpression(adId, publisher_url) {
    console.log(`[Impression] Tracking impression — adId: ${adId}`);
    try {
      await fetch("http://localhost:3000/api/Ad/Track-impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, publisher_url })
      });
      console.log(`[Impression] Successfully tracked — adId: ${adId}`);
    } catch (error) {
      console.error('[Impression] Failed to track:', error);
    }
  }

  const signals = {
    mouseMoved: false,
    scrolled: false,
    timeOnPage: 0,
    mouseEvents: 0,
  };

  const startTime = Date.now();
  document.addEventListener('mousemove', () => { signals.mouseMoved = true; signals.mouseEvents++; }, { passive: true });
  document.addEventListener('scroll', () => { signals.scrolled = true; }, { passive: true });

  async function trackClick(adId, publisher_url) {
    if (!window.AD_DATA.trackingToken) {
      console.log('[Click] DROPPED — no token');
      return;
    }

    const clickId = `${adId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    signals.timeOnPage = Date.now() - startTime;

    const event = {
      adId, publisher_url, timestamp: Date.now(), clickId,
      trackingToken: window.AD_DATA.trackingToken,
      signals: { ...signals }
    };

    window.AD_DATA.trackingToken = null;
    console.log(`[Click] Sending — adId: ${adId}, clickId: ${clickId}`);

    fetch("http://localhost:3000/api/Ad/Track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: [event] })
    })
      .then(r => r.json())
      .then(d => console.log('[Click] Server response:', d))
      .catch(err => console.error('[Click] Failed:', err));
  }

  async function load_ad() {
    console.log(`[Widget] Loading ad for widgetId: ${widgetId}`);
    container.innerHTML = '<p style="color:#999;">Loading ad...</p>';

    const res = await fetch(`http://localhost:3000/api/Ad?id=${widgetId}`);
    const data = await res.json();

    if (!data.success) {
      console.error('[Widget] Failed to load ad:', data.error);
      container.innerHTML = '';
      return;
    }

    container.innerHTML = data.html;
    console.log('[Widget] Ad HTML injected');

    setTimeout(() => {
      const scriptTag = container.querySelector('script');
      if (scriptTag) {
        console.log('[Widget] Executing ad script tag');
        eval(scriptTag.textContent);
      }

      if (window.AD_DATA) {
        console.log('[Widget] AD_DATA found:', {
          adId: window.AD_DATA.adId,
          publisher_url: window.AD_DATA.publisher_url,
          hasToken: !!window.AD_DATA.trackingToken
        });

        trackImpression(window.AD_DATA.adId, window.AD_DATA.publisher_url);

        const adLink = container.querySelector('.ad-container');
        if (adLink) {
          console.log('[Widget] Click listener attached');
          adLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('[Widget] Ad clicked');
            trackClick(window.AD_DATA.adId, window.AD_DATA.publisher_url);
            setTimeout(() => {
              window.open(window.AD_DATA.targetUrl, '_blank');
            }, 100);
          });
        } else {
          console.warn('[Widget] .ad-container not found — click listener not attached');
        }
      } else {
        console.warn('[Widget] AD_DATA not found after script execution');
      }
    }, 50);
  }

  load_ad();

})();