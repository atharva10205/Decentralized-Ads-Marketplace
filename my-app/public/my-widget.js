(function (){

  const script = document.currentScript;
  const widgetId = script.getAttribute('data-id');

  const container = document.getElementById("my-widget");

  async function load_ad(){

    container.innerHTML = '<p style="color:#999;">Loading ad...</p>';

    const res = await fetch( `http://localhost:3000/api/Ad?id=${widgetId}`);
    const data = await res.json();
    console.log("DADADADATATATAT",data.html)

    container.innerHTML = data.html;
  }
  load_ad();
})();