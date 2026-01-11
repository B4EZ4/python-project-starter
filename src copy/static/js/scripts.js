document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const crearQrForm = document.getElementById('crear-qr-form');
    const tipoSelect = document.getElementById('tipo');
    const exampleImg = document.getElementById('example-img');
    const donationModal = document.getElementById('donation-modal');
    const closeBtn = document.querySelector('.close-btn');
    const textoInput = document.getElementById('texto');
    const showDonationModal = document.getElementById('show-donation-modal');

    // Manejo del formulario para crear el QR
    if (crearQrForm) {
        crearQrForm.addEventListener('submit', function(event) {
            event.preventDefault();
            crearQR();
        });
    }

    // Contador de caracteres en tiempo real
    if (textoInput) {
        textoInput.addEventListener('input', function() {
            updateCharacterCount(this.value.length);
        });
        
        // Inicializar contador
        updateCharacterCount(textoInput.value.length);
    }

    // Cambiar imagen de ejemplo según el tipo seleccionado
    if (tipoSelect && exampleImg) {
        tipoSelect.addEventListener('change', function() {
            updateExampleImage(this.value);
        });
        
        // Inicializar imagen de ejemplo
        updateExampleImage(tipoSelect.value);
    }

    // Manejo del modal de donación
    if (closeBtn && donationModal) {
        closeBtn.addEventListener('click', function() {
            donationModal.style.display = 'none';
        });

        // Botón para mostrar modal de donación
        if (showDonationModal) {
            showDonationModal.addEventListener('click', function(e) {
                e.preventDefault();
                donationModal.style.display = 'flex';
            });
        }

        // Cerrar modal al hacer click fuera
        window.addEventListener('click', function(event) {
            if (event.target === donationModal) {
                donationModal.style.display = 'none';
            }
        });

        // Botón de cerrar modal
        const closeModalBtn = document.querySelector('.close-modal-btn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                donationModal.style.display = 'none';
            });
        }
    }
}

function updateCharacterCount(count) {
    let counterElement = document.getElementById('character-counter');
    
    if (!counterElement) {
        counterElement = document.createElement('div');
        counterElement.id = 'character-counter';
        counterElement.className = 'character-counter';
        document.getElementById('texto').parentNode.appendChild(counterElement);
    }
    
    const maxChars = 2325;
    counterElement.textContent = `${count} / ${maxChars} caracteres`;
    counterElement.className = `character-counter ${count > maxChars ? 'error' : ''}`;
}

function updateExampleImage(tipo) {
    const exampleImg = document.getElementById('example-img');
    if (!exampleImg) return;
    
    // Usar el objeto imagePaths definido en el HTML
    exampleImg.src = imagePaths[tipo] || imagePaths['6'];
}

async function crearQR() {
    const formData = new FormData(document.getElementById('crear-qr-form'));
    const texto = formData.get('texto');
    const tipo = parseInt(formData.get('tipo'));
    const nombre = formData.get('nombre') || 'qr_default';

    // Validación básica del cliente
    if (!texto || !texto.trim()) {
        mostrarError('Por favor, ingresa texto o un enlace para generar el QR');
        return;
    }

    if (texto.length > 2325) {
        mostrarError('El texto es demasiado largo. Máximo 2325 caracteres.');
        return;
    }

    // Mostrar indicador de carga
    mostrarLoading(true);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

        const response = await fetch('/crear_qr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                texto: texto,
                tipo: tipo,
                nombre: nombre
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error del servidor');
        }
        
        if (data.success) {
            mostrarQR(data);
            // Actualizar contador de QRs generados
            actualizarContadorQRs();
        } else {
            mostrarError('Error: ' + data.error);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            mostrarError('La solicitud tardó demasiado tiempo. Intenta nuevamente.');
        } else {
            mostrarError('Error de conexión: ' + error.message);
        }
    } finally {
        mostrarLoading(false);
    }
}

function mostrarQR(data) {
    const qrResult = document.getElementById('qr-result');
    
    // Crear contenedor para el QR
    const qrContainer = document.createElement('div');
    qrContainer.className = 'qr-result-container';
    
    // Imagen del QR
    const imgElement = document.createElement('img');
    imgElement.src = data.image_base64;
    imgElement.alt = 'Código QR generado';
    imgElement.className = 'qr-generated';
    
    // Información del QR
    const infoElement = document.createElement('div');
    infoElement.className = 'qr-info';
    infoElement.innerHTML = `
        <p><strong>Archivo:</strong> ${data.filename}</p>
        <p><strong>Tamaño QR:</strong> ${data.qr_size || 'N/A'}</p>
        <p><strong>Estado:</strong> <span class="success-text">✓ Generado exitosamente</span></p>
    `;
    
    // Contenedor de botones
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'qr-actions';
    
    // Botón de descarga
    const downloadLink = document.createElement('a');
    downloadLink.href = data.image_base64;
    downloadLink.download = data.filename;
    downloadLink.textContent = '📥 Descargar QR';
    downloadLink.className = 'download-btn';
    
    // Botón de copiar (opcional)
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copiar Imagen';
    copyBtn.className = 'copy-btn';
    copyBtn.addEventListener('click', function() {
        copiarImagen(data.image_base64);
    });
    
    actionsContainer.appendChild(downloadLink);
    actionsContainer.appendChild(copyBtn);
    
    // Ensamblar todo
    qrContainer.appendChild(imgElement);
    qrContainer.appendChild(infoElement);
    qrContainer.appendChild(actionsContainer);
    
    qrResult.innerHTML = '';
    qrResult.appendChild(qrContainer);
    
    // Mostrar mensaje de éxito
    mostrarMensaje('QR generado exitosamente!', 'success');
}

async function copiarImagen(base64Data) {
    try {
        const response = await fetch(base64Data);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob
            })
        ]);
        mostrarMensaje('✅ Imagen copiada al portapapeles!', 'success');
    } catch (err) {
        mostrarMensaje('❌ No se pudo copiar la imagen', 'error');
    }
}

function actualizarContadorQRs() {
    const statElement = document.getElementById('stat-generated');
    if (statElement) {
        const current = parseInt(statElement.textContent) || 0;
        statElement.textContent = current + 1;
    }
}

function mostrarLoading(mostrar) {
    let loadingElement = document.getElementById('loading-indicator');
    
    if (mostrar) {
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.id = 'loading-indicator';
            loadingElement.className = 'loading-indicator';
            loadingElement.innerHTML = `
                <div class="spinner"></div>
                <p>Generando QR...</p>
            `;
            document.getElementById('qr-result').appendChild(loadingElement);
        }
        loadingElement.style.display = 'flex';
    } else if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

function mostrarError(mensaje) {
    mostrarMensaje(mensaje, 'error');
}

function mostrarMensaje(mensaje, tipo = 'info') {
    // Eliminar mensajes anteriores
    const mensajesAnteriores = document.querySelectorAll('.message-toast');
    mensajesAnteriores.forEach(msg => {
        msg.classList.remove('show');
        setTimeout(() => msg.remove(), 300);
    });
    
    // Crear nuevo mensaje
    const toast = document.createElement('div');
    toast.className = `message-toast ${tipo}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${tipo === 'success' ? '✅' : '❌'}</span>
            <span class="toast-message">${mensaje}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar con animación
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}