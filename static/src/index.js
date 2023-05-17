$(document).ready(function () {
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

      // Generar los filtros después de cargar los datos del CSV
    });

  // Función para filtrar la tabla
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

    redirigirFiltro();
  }

  // Función para redirigir al filtro seleccionado
  function redirigirFiltro() {
    var filtroSeleccionado = {};

    $(".filtro").each(function () {
      var columna = $(this).data("columna");
      var valorFiltro = $(this).val();

      if (valorFiltro) {
        filtroSeleccionado[columna] = valorFiltro;
      }
    });

    if (Object.keys(filtroSeleccionado).length > 0) {
      var paginaDestino = encontrarPaginaFiltro(filtroSeleccionado);

      if (paginaDestino > 0) {
        currentPage = paginaDestino;
        showPage(currentPage);
      }
    }
  }

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

  // Cargar imágenes desde los enlaces de la última columna
  function cargarImagenes() {
    const filas = document.querySelectorAll("#tabla-aves tbody tr");

    filas.forEach((fila) => {
      const celdaImagen = fila.querySelector("td:nth-last-child(1)"); // Penúltima columna (considerando que la última columna es la de "Imagenes")
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
  showPage(currentPage);
});
