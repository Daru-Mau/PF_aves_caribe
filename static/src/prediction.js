// Función para mostrar la imagen seleccionada
function previewImage(event) {
  var imageContainer = document.getElementById("image-preview");
  imageContainer.innerHTML = "";
  var image = document.createElement("img");
  image.src = URL.createObjectURL(event.target.files[0]);
  imageContainer.appendChild(image);
}

// Escuchar cambios en la carga de imágenes
var imageUpload = document.getElementById("image-upload");
imageUpload.addEventListener("change", previewImage);

// Función para enviar la imagen al servidor para el procesamiento con TensorFlow
function analyzeImage() {
  var fileInput = document.getElementById("image-upload");
  var file = fileInput.files[0];
  var formData = new FormData();
  formData.append("image", file);

  // Enviar la imagen al servidor
  fetch("/analyze", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      displayResults(data);
    })
    .catch((error) => console.error(error));
}

// Función para mostrar los resultados obtenidos del análisis
function displayResults(results) {
  var resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "";

  var title = document.createElement("h2");
  title.textContent = "Resultados:";
  resultContainer.appendChild(title);

  for (var key in results) {
    var property = document.createElement("p");
    property.innerHTML = "<strong>" + key + ":</strong> " + results[key];
    resultContainer.appendChild(property);
  }
}
