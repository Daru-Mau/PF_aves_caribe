$(document).ready(function () {
  // Obtener el csv
  var csv_url = "../../data/avesReportadasUni.csv";
  var rows = [];

  fetch(csv_url)
    .then((response) => response.text())
    .then((data) => {
      rows = data.split("\n").slice(1); // Eliminar encabezados y dividir en filas
      const totalPages = Math.ceil(rows.length / 10); // Calcular el número total de páginas
      let currentPage = 1; // Página actual
      let startIndex = 0; // Índice de inicio de la página actual

      generarFiltros(); // Generar los filtros antes de la paginación

      // Función para generar los filtros dinámicamente
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
              '<option value="' +
              opciones[j] +
              '">' +
              opciones[j] +
              "</option>";
          }
          filtroHtml += "</select>";

          $("#filtros").append(filtroHtml);
        }

        $(".filtro").on("change", function () {
          filtrarTabla();
        });
      }

      // Función para obtener las opciones de cada columna
      function obtenerOpcionesColumna(columna) {
        var opciones = [];

        rows.forEach((row) => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const valor = cols[columna].trim().replace(/"/g, ""); // Obtener el valor de la columna

          if (!opciones.includes(valor)) {
            opciones.push(valor);
          }
        });

        return opciones;
      }

      function showPage(page) {
        var startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;
        const pageRows = rows.slice(startIndex, endIndex);

        $("#tabla-aves tbody").empty(); // Limpiar la tabla antes de agregar las filas de la página actual

        pageRows.forEach(function (row) {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const tr = $("<tr>");

          cols.forEach(function (col) {
            const td = $("<td>").text(col.trim().replace(/"/g, "")); // Eliminar las comillas dobles de los valores
            tr.append(td);
          });

          $("#tabla-aves tbody").append(tr);
        });

        // Actualizar el número de página actual
        currentPage = page;

        // Actualizar el estado de los botones de navegación de página
        $(".prev-page-btn").prop("disabled", currentPage === 1);
        $(".next-page-btn").prop("disabled", currentPage === totalPages);

        cargarImagenes(); // Cargar imágenes después de mostrar la página actual
        adjustTableSize(); // Ajustar el tamaño de la tabla después de mostrar la página
      }

      // Función para mostrar la página actual
      function showPage(page) {
        var startIndex = (page - 1) * 10;
        var endIndex = startIndex + 10;
        var pageRows = rows.slice(startIndex, endIndex);

        $("#tabla-aves tbody").empty();

        pageRows.forEach((row) => {
          var cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          var htmlRow = "<tr>";

          cols.forEach((col, index) => {
            var valorCelda = col.trim().replace(/"/g, "");

            if (index === cols.length - 1) {
              htmlRow += '<td><img src="' + valorCelda + '" alt="Imagen"></td>'; // Agregar imagen desde el enlace
            } else {
              htmlRow += "<td>" + valorCelda + "</td>";
            }
          });

          htmlRow += "</tr>";
          $("#tabla-aves tbody").append(htmlRow);
        });

        actualizarPaginacion(page);
      }

      // Función para filtrar la tabla
      function filtrarTabla() {
        var filtroSeleccionado = {};

        $(".filtro").each(function () {
          var columna = $(this).data("columna");
          var valorFiltro = $(this).val();

          if (valorFiltro) {
            filtroSeleccionado[columna] = valorFiltro;
          }
        });

        var paginaDestino = encontrarPaginaFiltro(filtroSeleccionado);

        if (paginaDestino > 0) {
          currentPage = paginaDestino;
          showPage(currentPage);
        }
      }

      // Función para encontrar la página que contiene el filtro seleccionado
      function encontrarPaginaFiltro(filtro) {
        for (var i = 0; i < totalPages; i++) {
          var startIndex = i * 10;
          var endIndex = startIndex + 10;
          var pageRows = rows.slice(startIndex, endIndex);

          for (var j = 0; j < pageRows.length; j++) {
            var cols = pageRows[j].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

            var coincideFiltro = Object.keys(filtro).every(function (columna) {
              var valorFiltro = filtro[columna];
              var valorCelda = cols[columna].trim().replace(/"/g, "");
              return valorCelda === valorFiltro;
            });

            if (coincideFiltro) {
              return i + 1;
            }
          }
        }

        return -1;
      }

      // Función para cargar imágenes desde los enlaces de la última columna
      function cargarImagenes() {
        const filas = document.querySelectorAll("#tabla-aves tbody tr");

        filas.forEach((fila) => {
          const celdaImagen = fila.querySelector("td:last-child"); // Última columna
          const enlaceImagen = celdaImagen.textContent;

          if (enlaceImagen) {
            const imagen = new Image();
            imagen.src = enlaceImagen;
            imagen.classList.add("imagen-tabla");

            const enlace = document.createElement("a");
            enlace.href = enlaceImagen;
            enlace.target = "_blank";
            enlace.appendChild(imagen);

            celdaImagen.textContent = ""; // Eliminar el enlace existente
            celdaImagen.appendChild(enlace);
          }
        });
      }

      // Mostrar la página actual
      function showPage(page) {
        var startIndex = (page - 1) * 10;
        var endIndex = startIndex + 10;
        var pageRows = rows.slice(startIndex, endIndex);

        $("#tabla-aves tbody").empty();

        pageRows.forEach((row) => {
          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          const tr = document.createElement("tr");

          cols.forEach((col) => {
            const td = document.createElement("td");
            td.textContent = col.trim().replace(/"/g, "");
            tr.appendChild(td);
          });

          $("#tabla-aves tbody").append(tr);
        });

        cargarImagenes(); // Cargar las imágenes después de mostrar la página
      }

      showPage(currentPage); // Mostrar la página actual al cargar la tabla
    })
    .catch((error) => {
      console.log("Error al cargar el archivo CSV:", error);
    });
});
