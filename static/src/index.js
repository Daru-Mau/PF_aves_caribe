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
});
