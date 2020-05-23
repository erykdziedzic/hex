fetch('/renderMap').then((res) => res.json()).then((data) => renderMap(data))
