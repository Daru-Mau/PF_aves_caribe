$(document).ready(function () {
  // Obtener el csv
  var csv_url = "../../data/avesReportadasUni.csv";
  var rows = [];

  fetch(csv_url)
    .then((response) => response.text())
    .then((data) => {
      rows = data.split("\n").slice(1); // Eliminar encabezados y dividir en filas
      // const totalPages = Math.ceil(rows.length / 10); // Calcular el número total de páginas

      generarFiltros(); // Generar los filtros antes de la paginación

      // Función para generar los filtros dinámicamente
      function generarFiltros() {
        var columnas = $("#tabla-aves thead th").length - 1;

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
          filtroHtml += '<option value="">- - -</option>';

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

      // Función para filtrar la tabla
      function filtrarTabla() {
        var filtroSeleccionado = {};
        $("#tabla-aves tbody").empty();
        $(".filtro").each(function () {
          var columna = $(this).data("columna");
          var valorFiltro = $(this).val();

          if (valorFiltro) {
            filtroSeleccionado[columna] = valorFiltro;
            encontrarPaginaFiltro(filtroSeleccionado);
          }
        });
        
      }

      // Función para encontrar la página que contiene el filtro seleccionado
      function encontrarPaginaFiltro(filtro) {
        $("#tabla-aves tbody").empty();
        for (var j = 0; j < rows.length; j++) {
          var cols = rows[j].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          var coincideFiltro = Object.keys(filtro).every(function (columna) {
            var valorFiltro = filtro[columna];
            var valorCelda = cols[columna].trim().replace(/"/g, "");
            return valorCelda === valorFiltro;
          });
          if (coincideFiltro) {
            const tr = document.createElement("tr");
            cols.forEach((col) => {
              const td = document.createElement("td");
              td.textContent = col.trim().replace(/"/g, "");
              tr.appendChild(td);
            });
            $("#tabla-aves tbody").append(tr);
          }
        }
        cargarImagenes();
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
    })
    .catch((error) => {
      console.log("Error al cargar el archivo CSV:", error);
    });
});
