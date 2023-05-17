$(document).ready(function () {
  generarFiltros();

  function generarFiltros() {
    var columnas = $("#tabla-aves thead th").length;

    for (var i = 0; i < columnas; i++) {
      var nombreColumna = $("#tabla-aves thead th").eq(i).text();
      var opciones = obtenerOpcionesColumna(i);
      var filtroHtml =
        '<label for="filtro-' + i + '">' + nombreColumna + "</label>";
      filtroHtml +=
        '<select id="filtro-' +
        i +
        '" class="filtro" data-columna="' +
        i +
        '">';
      filtroHtml += '<option value="">Todos</option>';

      for (var j = 0; j < opciones.length; j++) {
        filtroHtml +=
          '<option value="' + opciones[j] + '">' + opciones[j] + "</option>";
      }
      filtroHtml += "</select>";

      $("#filtros").append(filtroHtml);
    }

    $(".filtro").on("change", function () {
      filtrarTabla();
    });
  }

  function obtenerOpcionesColumna(columna) {
    var opciones = [];

    $("#tabla-aves tbody tr").each(function () {
      var valor = $(this)
        .find("td:nth-child(" + (columna + 1) + ")")
        .text();

      if (opciones.indexOf(valor) === -1) {
        opciones.push(valor);
      }
    });

    return opciones;
  }

  function filtrarTabla() {
    $("#tabla-aves tbody tr").hide();

    $("#tabla-aves tbody tr").each(function () {
      var fila = $(this);

      var mostrarFila = true;

      $(".filtro").each(function () {
        var columna = $(this).data("columna");
        var valorFiltro = $(this).val();
        var valorCelda = fila
          .find("td:nth-child(" + (columna + 1) + ")")
          .text();

        if (valorFiltro && valorFiltro !== valorCelda) {
          mostrarFila = false;
        }
      });

      if (mostrarFila) {
        fila.show();
      }
    });
  }

  // Cargar imágenes desde la carpeta
  function cargarImagenes() {
    var carpetaImagenes = "/static/images/";

    $("#tabla-aves tbody tr").each(function () {
      var nombreImagen = $(this).find("td:last-child").text();
      var extension = nombreImagen.split(".").pop().toLowerCase();
      if (extension === "jpg" || extension === "jpeg") {
        var imagenHtml =
          '<img class="imagen-tabla" src="' +
          carpetaImagenes +
          nombreImagen +
          '" alt="Imagen">';
        $(this).find("td:last-child").empty(); // Eliminar contenido existente
        $(this).append("<td>" + imagenHtml + "</td>"); // Agregar imagen en nueva celda
        console.log("Imagen cargada:", nombreImagen);
      }
    });
  }

  // Llamar a la función de carga de imágenes después de crear la tabla principal
  generarTabla();
  cargarImagenes();
});

// Obtener el csv
var csv_url = "../../data/avesReportadasUni.csv";

fetch(csv_url)
  .then((response) => response.text())
  .then((data) => {
    const tabla = document.querySelector("#tabla-aves tbody");
    const rows = data.split("\n").slice(1); // Eliminar encabezados y dividir en filas
    const totalPages = Math.ceil(rows.length / 10); // Calcular el número total de páginas
    let currentPage = 1; // Página actual
    let startIndex = 0; // Índice de inicio de la página actual

    // Función para mostrar una página específica
    function showPage(page) {
      startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      const pageRows = rows.slice(startIndex, endIndex);

      tabla.innerHTML = ""; // Limpiar la tabla antes de agregar las filas de la página actual

      pageRows.forEach((row) => {
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        const tr = document.createElement("tr");
        cols.forEach((col) => {
          const td = document.createElement("td");
          td.textContent = col.trim().replace(/"/g, ""); // Eliminar las comillas dobles de los valores
          tr.appendChild(td);
        });
        tabla.appendChild(tr);
      });

      // Actualizar el número de página actual
      currentPage = page;

      // Actualizar el texto del botón de "Página anterior"
      const prevBtn = document.querySelector(".prev-page-btn");
      if (currentPage === 1) {
        prevBtn.disabled = true;
      } else {
        prevBtn.disabled = false;
      }

      // Actualizar el texto del botón de "Página siguiente"
      const nextBtn = document.querySelector(".next-page-btn");
      if (currentPage === totalPages) {
        nextBtn.disabled = true;
      } else {
        nextBtn.disabled = false;
      }

      cargarImagenes(); // Cargar imágenes después de mostrar la página actual
      adjustTableSize(); // ajustar el tamaño de la tabla después de mostrar la página
    }

    // Agregar un botón de "Página anterior"
    const prevBtn = document.createElement("button");
    prevBtn.classList.add("prev-page-btn");
    prevBtn.textContent = "Página anterior";
    prevBtn.addEventListener("click", () => {
      showPage(currentPage - 1);
    });
    const tableParent = tabla.parentNode; // Obtener el nodo padre de tabla
    tableParent.insertBefore(prevBtn, tabla);

    // Agregar un botón de "Página siguiente"
    const nextBtn = document.createElement("button");
    nextBtn.classList.add("next-page-btn");
    nextBtn.textContent = "Página siguiente";
    nextBtn.addEventListener("click", () => {
      showPage(currentPage + 1);
    });
    tableParent.insertBefore(nextBtn, tabla.nextSibling);

    // Mostrar la primera página al cargar la página
    showPage(currentPage);
  });

function adjustTableSize() {
  const rows = document.querySelectorAll("#tabla-aves tbody tr");
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.style.width = "auto";
      cell.style.height = "auto";
    });
    row.style.height = row.scrollHeight + "px";
  });
}

window.addEventListener("load", adjustTableSize);
