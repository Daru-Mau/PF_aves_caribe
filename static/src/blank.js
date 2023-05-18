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

      // Resto del código de paginación de la tabla...

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
            var coincidencia = true;

            for (var prop in filtro) {
              var columna = parseInt(prop);
              var valorFiltro = filtro[prop];
              var valorCelda = cols[columna].trim().replace(/"/g, "");

              if (valorFiltro !== valorCelda) {
                coincidencia = false;
                break;
              }
            }

            if (coincidencia) {
              return i + 1;
            }
          }
        }

        return 0; // No se encontró ninguna coincidencia
      }

      // Función para ajustar el tamaño de la tabla
      function adjustTableSize() {
        const rows = $("#tabla-aves tbody tr");

        rows.each(function () {
          const row = $(this);
          const cells = row.find("td");

          cells.css({ width: "auto", height: "auto" });
          row.css("height", row.prop("scrollHeight") + "px");
        });
      }

      // Función para mostrar una página específica
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

      // Resto del código de paginación de la tabla...
    })
    .catch((error) => {
      console.error("Error al cargar el archivo CSV:", error);
    });
});
