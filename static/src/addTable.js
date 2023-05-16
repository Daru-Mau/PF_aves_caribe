// Obtener el csv
var csv_url = "../../data/sg_edit.csv";

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
