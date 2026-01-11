from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import qrcode
from io import BytesIO
import base64
import re
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import (
    CircleModuleDrawer,
    GappedSquareModuleDrawer,
    HorizontalBarsDrawer,
    RoundedModuleDrawer,
    SquareModuleDrawer,
    VerticalBarsDrawer,
)

app = Flask(__name__, 
            template_folder='templates',
            static_folder='static')

MAX_TEXT_LENGTH = 2325
ALLOWED_QR_TYPES = {1, 2, 3, 4, 5, 6}

QR_DRAWERS = {
    1: CircleModuleDrawer(),
    2: GappedSquareModuleDrawer(),
    3: VerticalBarsDrawer(),
    4: HorizontalBarsDrawer(),
    5: RoundedModuleDrawer(),
    6: SquareModuleDrawer(),
}


def sanitize_filename(filename: str) -> str:
    """Sanitiza el nombre del archivo para seguridad"""
    if not filename:
        return "qr_default"
    filename = re.sub(r'[^\w\-_.]', '', filename)
    filename = filename[:50]
    return filename or "qr_default"


def validate_qr_input(texto: str, tipo: int, nombre: str) -> tuple[bool, list[str]]:
    """Valida los inputs del usuario"""
    errors = []
    
    if not texto or not texto.strip():
        errors.append("No se proporcionó texto para el QR")
    if len(texto) > MAX_TEXT_LENGTH:
        errors.append(f"El texto es demasiado largo. Máximo {MAX_TEXT_LENGTH} caracteres")
    if tipo not in ALLOWED_QR_TYPES:
        errors.append(f"Tipo de QR no válido. Debe ser entre 1 y 6")
    
    if errors:
        return False, errors
    return True, []


def generate_qr_image(texto: str, tipo: int):
    """Función unificada para generar QR"""
    try:
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=4,
        )
        qr.add_data(texto)
        qr.make(fit=True)
        
        drawer = QR_DRAWERS.get(tipo, SquareModuleDrawer())
        
        img = qr.make_image(
            image_factory=StyledPilImage, 
            module_drawer=drawer,
            fill_color="black",
            back_color="white"
        )
        
        return img, qr.version
    except Exception as e:
        raise Exception(f"Error generando imagen QR: {str(e)}")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/crear_qr", methods=["POST"])
def crear_qr():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type debe ser application/json"}), 400
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "Cuerpo de la solicitud vacío o inválido"}), 400
        
        texto = data.get("texto", "").strip()
        tipo = data.get("tipo", 6)
        nombre = sanitize_filename(data.get("nombre", "qr_default"))
        
        is_valid, errors = validate_qr_input(texto, tipo, nombre)
        if not is_valid:
            return jsonify({"error": "; ".join(errors)}), 400
        
        img, qr_version = generate_qr_image(texto, tipo)
        
        img_io = BytesIO()
        img.save(img_io, 'PNG', optimize=True)
        img_io.seek(0)
        img_base64 = base64.b64encode(img_io.getvalue()).decode('utf-8')
        
        return jsonify({
            "success": True,
            "image_base64": f"data:image/png;base64,{img_base64}",
            "filename": f"{nombre}.png",
            "qr_size": f"Versión {qr_version}",
            "message": "QR generado exitosamente"
        })
    
    except ValueError as ve:
        return jsonify({"error": f"Error en los datos: {str(ve)}"}), 400
    except Exception as e:
        print(f"Error en crear_qr: {str(e)}")
        return jsonify({"error": "Error interno del servidor al generar el QR"}), 500


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico', 
        mimetype='image/vnd.microsoft.icon'
    )


@app.route("/health")
def health_check():
    return jsonify({
        "status": "healthy", 
        "service": "qr-generator",
        "version": "1.0.0"
    })


@app.route("/api/info")
def api_info():
    return jsonify({
        "name": "QR Generator Web",
        "version": "1.0.0",
        "max_text_length": MAX_TEXT_LENGTH,
        "allowed_qr_types": list(ALLOWED_QR_TYPES),
        "endpoints": {
            "create_qr": "/crear_qr (POST)",
            "health": "/health (GET)",
            "info": "/api/info (GET)"
        }
    })


if __name__ == "__main__":
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.environ.get('FLASK_HOST', '127.0.0.1')
    port = int(os.environ.get('FLASK_PORT', 5000))
    
    print(f"Iniciando servidor en http://{host}:{port}")
    print(f"Modo debug: {debug_mode}")
    
    app.run(debug=debug_mode, host=host, port=port)
