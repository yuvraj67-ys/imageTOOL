from http.server import BaseHTTPRequestHandler
import io
import json
import cgi

# Lazy-load heavy imports for faster cold starts
_rembg_loaded = False
_remove_fn = None

def _load_rembg():
    global _rembg_loaded, _remove_fn
    if not _rembg_loaded:
        from rembg import remove
        _remove_fn = remove
        _rembg_loaded = True
    return _remove_fn

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight."""
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def do_POST(self):
        """Accept image upload, remove background, return transparent PNG."""
        try:
            # Parse multipart form data
            content_type = self.headers.get('Content-Type', '')
            
            if 'multipart/form-data' not in content_type:
                self._send_error(400, 'Expected multipart/form-data')
                return

            # Parse the form data
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={
                    'REQUEST_METHOD': 'POST',
                    'CONTENT_TYPE': content_type,
                }
            )

            # Get the uploaded image
            image_field = form['image']
            if not image_field.file:
                self._send_error(400, 'No image file provided')
                return

            input_data = image_field.file.read()
            
            # Validate size (max 10MB)
            if len(input_data) > 10 * 1024 * 1024:
                self._send_error(413, 'Image too large. Maximum 10MB.')
                return

            # Remove background using rembg
            remove = _load_rembg()
            output_data = remove(
                input_data,
                alpha_matting=True,
                alpha_matting_foreground_threshold=240,
                alpha_matting_background_threshold=10,
                alpha_matting_erode_size=10
            )

            # Send the transparent PNG back
            self.send_response(200)
            self._set_cors_headers()
            self.send_header('Content-Type', 'image/png')
            self.send_header('Content-Length', str(len(output_data)))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(output_data)

        except Exception as e:
            self._send_error(500, f'Processing failed: {str(e)}')

    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def _send_error(self, code, message):
        self.send_response(code)
        self._set_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'error': message}).encode())
