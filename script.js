let dataGlobal = []; // Variable para almacenar los datos globalmente

document.getElementById("generarReporte").addEventListener("click", () => {
    const fechaInicio = document.getElementById("fechaInicio").value;
    const fechaFin = document.getElementById("fechaFin").value;

    if (!fechaInicio || !fechaFin) {
        alert("Por favor, selecciona ambas fechas.");
        return;
    }

    mostrarProgressBar(); // Mostrar la barra de progreso

    fetch(`http://127.0.0.1:5000/reporte?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                dataGlobal = data; // Guardar los datos globalmente
                mostrarTabla(data); // Mostrar los datos en la tabla
            }
        })
        .catch((error) => {
            console.error("Error al generar el reporte:", error);
            alert("Hubo un problema al generar el reporte.");
        })
        .finally(() => {
            ocultarProgressBar(); // Ocultar la barra de progreso
        });
});

function mostrarTabla(data) {
    const contenedor = document.getElementById("app");

    // Si ya existe una tabla, elimínala
    const tablaExistente = document.querySelector("table");
    if (tablaExistente) {
        tablaExistente.remove();
    }

    // Crear la tabla
    const tabla = document.createElement("table");
    const encabezados = Object.keys(data[0]);

    // Crear encabezados de la tabla
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    encabezados.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    tabla.appendChild(thead);

    // Crear filas de la tabla
    const tbody = document.createElement("tbody");
    data.forEach((row) => {
        const tr = document.createElement("tr");
        encabezados.forEach((key) => {
            const td = document.createElement("td");
            td.textContent = row[key];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    tabla.appendChild(tbody);

    // Añadir la tabla al contenedor
    contenedor.appendChild(tabla);

    // Mostrar el botón "Exportar a CSV"
    const botonExportar = document.getElementById("exportarCSV");
    botonExportar.style.display = "inline-block";
    botonExportar.onclick = () => exportarCSV(data); // Asignar evento al botón
}

function exportarCSV(data) {
    if (!data || data.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    const encabezados = Object.keys(data[0]);
    const filas = data.map((row) =>
        encabezados.map((key) => `"${row[key]}"`).join(",")
    );

    const csv = [encabezados.join(","), ...filas].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reporte_margen_inversion.csv"); // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Limpiar el enlace
    URL.revokeObjectURL(url); // Liberar el objeto URL
}

// Funciones del ProgressBar
function mostrarProgressBar() {
    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    // Mostrar el contenedor del ProgressBar
    progressContainer.style.display = "block";

    // Reiniciar el estado del ProgressBar
    progressBar.value = 0;
    progressText.textContent = "Generando reporte...";

    // Simular progreso
    const interval = setInterval(() => {
        if (progressBar.value < 90) {
            progressBar.value += 10; // Incrementa el progreso
        } else {
            clearInterval(interval);
        }
    }, 300); // Actualiza cada 300ms
}

function ocultarProgressBar() {
    const progressContainer = document.getElementById("progressContainer");

    // Ocultar el contenedor del ProgressBar
    progressContainer.style.display = "none";
}
