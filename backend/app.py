from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import qrcode
from io import BytesIO
import base64
import re
from PIL import Image, ImageDraw, ImageFont
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

CORS(app)

MAX_TEXT_LENGTH = 2325
ALLOWED_QR_TYPES = {1, 2, 3, 4, 5, 6}

QR_DRAWERS = {
    1: CircleModuleDrawer,
    2: GappedSquareModuleDrawer,
    3: VerticalBarsDrawer,
    4: HorizontalBarsDrawer,
    5: RoundedModuleDrawer,
    6: SquareModuleDrawer,
}

# Corner styles mapping (visual only - actual implementation depends on PIL capabilities)
CORNER_STYLES = {
    1: 'square',
    2: 'rounded',
    3: 'circle',
    4: 'diamond',
    5: 'star',
    6: 'hexagon',
    7: 'octagon',
    8: 'leaf',
    9: 'heart',
    10: 'arrow',
    11: 'cross',
    12: 'drop',
    13: 'shield',
    14: 'bolt',
    15: 'moon',
}

# Preset logos paths
PRESET_LOGOS = {
    'facebook': 'logos/facebook.png',
    'instagram': 'logos/instagram.png',
    'twitter': 'logos/twitter.png',
    'youtube': 'logos/youtube.png',
    'whatsapp': 'logos/whatsapp.png',
    'linkedin': 'logos/linkedin.png',
    'tiktok': 'logos/tiktok.png',
    'spotify': 'logos/spotify.png',
    'email': 'logos/email.png',
    'phone': 'logos/phone.png',
    'website': 'logos/website.png',
    'location': 'logos/location.png',
}


def sanitize_filename(filename: str) -> str:
    """Sanitiza el nombre del archivo para seguridad"""
    if not filename:
        return "qr_default"
    filename = re.sub(r'[^\w\-_.]', '', filename)
    filename = filename[:50]
    return filename or "qr_default"


def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color to RGB tuple"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


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


def add_frame_to_image(img: Image.Image, frame_config: dict) -> Image.Image:
    """Add a frame with optional text to the QR image"""
    if not frame_config.get('enabled', False):
        return img
    
    frame_color = hex_to_rgb(frame_config.get('color', '#000000'))
    text_color = hex_to_rgb(frame_config.get('text_color', '#FFFFFF'))
    frame_text = frame_config.get('text', '')
    
    # Frame dimensions
    padding = 40
    text_height = 50 if frame_text else 0
    
    new_width = img.width + (padding * 2)
    new_height = img.height + (padding * 2) + text_height
    
    # Create new image with frame
    framed = Image.new('RGB', (new_width, new_height), frame_color)
    
    # Paste QR
    framed.paste(img, (padding, padding))
    
    # Add text if provided
    if frame_text:
        draw = ImageDraw.Draw(framed)
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
        except:
            font = ImageFont.load_default()
        
        # Center text
        bbox = draw.textbbox((0, 0), frame_text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (new_width - text_width) // 2
        y = img.height + padding + 10
        
        draw.text((x, y), frame_text, fill=text_color, font=font)
    
    return framed


def add_logo_to_image(img: Image.Image, logo_config: dict) -> Image.Image:
    """Add a logo to the center of the QR image"""
    if not logo_config.get('enabled', False):
        return img
    
    logo_path = None
    
    if logo_config.get('preset'):
        preset_path = PRESET_LOGOS.get(logo_config['preset'])
        if preset_path:
            logo_path = os.path.join(app.static_folder, 'image', preset_path)
    elif logo_config.get('custom_url'):
        # For custom URLs, we'd need to download - skip for now
        pass
    
    if not logo_path or not os.path.exists(logo_path):
        return img
    
    try:
        logo = Image.open(logo_path)
        
        # Resize logo to fit in center (about 20% of QR size)
        logo_size = int(img.width * 0.2)
        logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Calculate position
        pos_x = (img.width - logo_size) // 2
        pos_y = (img.height - logo_size) // 2
        
        # Create white background for logo
        img_with_logo = img.copy()
        white_bg = Image.new('RGBA', (logo_size + 10, logo_size + 10), (255, 255, 255, 255))
        img_with_logo.paste(white_bg, (pos_x - 5, pos_y - 5))
        
        # Paste logo
        if logo.mode == 'RGBA':
            img_with_logo.paste(logo, (pos_x, pos_y), logo)
        else:
            img_with_logo.paste(logo, (pos_x, pos_y))
        
        return img_with_logo
    except Exception as e:
        print(f"Error adding logo: {e}")
        return img


def generate_qr_image(texto: str, tipo: int, qr_color: str = '#000000', 
                      bg_color: str = '#FFFFFF', frame_config: dict = None,
                      logo_config: dict = None, corners_config: dict = None):
    """Función unificada para generar QR con todas las personalizaciones"""
    try:
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,  # Higher error correction for logo
            box_size=10,
            border=4,
        )
        qr.add_data(texto)
        qr.make(fit=True)
        
        DrawerClass = QR_DRAWERS.get(tipo, SquareModuleDrawer)
        
        # Convert colors
        fill_color = hex_to_rgb(qr_color)
        back_color = hex_to_rgb(bg_color)
        
        img = qr.make_image(
            image_factory=StyledPilImage, 
            module_drawer=DrawerClass(),
            fill_color=fill_color,
            back_color=back_color
        )
        
        # Convert to PIL Image if needed
        if hasattr(img, 'get_image'):
            img = img.get_image()
        
        # Add logo
        if logo_config:
            img = add_logo_to_image(img, logo_config)
        
        # Add frame (do this last)
        if frame_config:
            img = add_frame_to_image(img, frame_config)
        
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
        
        # New customization options
        qr_color = data.get("qr_color", "#000000")
        bg_color = data.get("background_color", "#FFFFFF")
        frame_config = data.get("frame", {})
        logo_config = data.get("logo", {})
        corners_config = data.get("corners", {})
        
        is_valid, errors = validate_qr_input(texto, tipo, nombre)
        if not is_valid:
            return jsonify({"error": "; ".join(errors)}), 400
        
        img, qr_version = generate_qr_image(
            texto, tipo, qr_color, bg_color,
            frame_config, logo_config, corners_config
        )
        
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
        "version": "2.0.0"
    })


@app.route("/api/info")
def api_info():
    return jsonify({
        "name": "QR Generator Web",
        "version": "2.0.0",
        "max_text_length": MAX_TEXT_LENGTH,
        "allowed_qr_types": list(ALLOWED_QR_TYPES),
        "corner_styles": list(CORNER_STYLES.keys()),
        "preset_logos": list(PRESET_LOGOS.keys()),
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
