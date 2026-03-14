(function () {
  const script = document.currentScript;
  const widgetId = script.getAttribute('data-id');
  const container = document.getElementById("my-widget");

  async function trackImpression(adId, publisher_url) {
    try {
      await fetch("http://localhost:3000/api/Ad/Track-impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, publisher_url })
      });
    } catch (error) {
      console.error('Failed to track impression:', error);
    }
  }

  async function trackClick(adId, publisher_url) {
    try {
      await fetch("http://localhost:3000/api/Ad/Track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, publisher_url })
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  }

  async function load_ad() {
    container.innerHTML = '<p style="color:#999;">Loading ad...</p>';

    const res = await fetch(`http://localhost:3000/api/Ad?id=${widgetId}`);
    const data = await res.json();

    container.innerHTML = data.html;

    setTimeout(() => {
      const scriptTag = container.querySelector('script');

      if (scriptTag) {
        eval(scriptTag.textContent);
      }

      if (window.AD_DATA) {
        trackImpression(window.AD_DATA.adId, window.AD_DATA.publisher_url);
        const adLink = container.querySelector('.ad-container');
        if (adLink) {
          adLink.addEventListener('click', (e) => {
            e.preventDefault();
            trackClick(window.AD_DATA.adId, window.AD_DATA.publisher_url);

            setTimeout(() => {
              window.open(window.AD_DATA.targetUrl, '_blank');
            }, 100);
          });
        }
      }
    }, 50);
  }

  load_ad();
})();