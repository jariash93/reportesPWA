from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import bigquery

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

# Configurar cliente BigQuery
client = bigquery.Client()

@app.route('/reporte', methods=['GET'])
def generar_reporte():
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')

    if not fecha_inicio or not fecha_fin:
        return jsonify({"error": "Debes proporcionar un rango de fechas"}), 400

    # Llamar al procedimiento almacenado con los parámetros
    query = f"""
    CALL `ventas-atc-i-d.bd_finanzas_odoo17.invoice_line_report_static`('{fecha_inicio}', '{fecha_fin}')
    """
    try:
        # Ejecutar la llamada al procedimiento almacenado
        query_job = client.query(query)
        results = query_job.to_dataframe()  # Convertir los resultados en un DataFrame
        return jsonify(results.to_dict(orient='records'))  # Enviar resultados como JSON
    except Exception as e:
        # Capturar errores
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

