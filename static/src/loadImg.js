function loadImagesFromFolder(folder) {
  fetch(folder)
    .then((response) => response.text())
    .then((data) => {
      // Obtener las rutas de las imágenes desde el contenido de la carpeta
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(data, "text/html");
      var links = htmlDoc.getElementsByTagName("a");
      var imageUrls = [];
      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href");
        if (href.endsWith(".jpg") || href.endsWith(".png")) {
          imageUrls.push(folder + "/" + href);
        }
      }

      // Generar las filas de la tabla con las imágenes
      var tableBody = document.getElementById("#table-body");
      imageUrls.forEach((url) => {
        var row = document.createElement("tr");

        var imageCell = document.createElement("td");
        var image = document.createElement("img");
        image.src = url;
        imageCell.appendChild(image);
        row.appendChild(imageCell);

        // Agregar la fila a la tabla
        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error(error));
}

// Llamar a la función para cargar las imágenes desde la carpeta
loadImagesFromFolder("/static/images/");
