
import json
import re
import sqlite3
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

BASE_DIR = Path(__file__).resolve().parent
DATABASE = BASE_DIR / "enquiries.db"
PORT = 8000

ENQUIRY_RESPONSES = {
    "volunteer": (
        "Your volunteering enquiry has been recorded. "
        "Opportunities will depend on the project's future needs."
    ),
    "donation": (
        "Your donation enquiry has been recorded. "
        "Donation arrangements have not yet been confirmed."
    ),
    "sponsorship": (
        "Your sponsorship enquiry has been recorded. "
        "Sponsorship opportunities can be discussed as the project develops."
    ),
    "partnership": (
        "Your partnership enquiry has been recorded. "
        "Potential collaboration opportunities can be explored."
    ),
    "general": (
        "Your general enquiry has been recorded "
        "for this project demonstration."
    )
}

CONTACT_TYPES = {
    "general": "General Question",
    "feedback": "Feedback",
    "suggestion": "Suggestion",
    "other": "Other"
}


def initialise_database():
    with sqlite3.connect(DATABASE) as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS enquiries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                enquiry_type TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)

        connection.execute("""
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                message_type TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)


class WebsiteHandler(SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(
            *args,
            directory=str(BASE_DIR),
            **kwargs
        )

    def send_json(self, status, data):
        response = json.dumps(data).encode("utf-8")

        self.send_response(status)
        self.send_header(
            "Content-Type",
            "application/json; charset=utf-8"
        )
        self.send_header("Content-Length", str(len(response)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(response)

    def do_GET(self):
        requested_path = unquote(
            urlsplit(self.path).path
        )

        path_parts = Path(requested_path).parts

        blocked_files = {
            "server.py",
            "enquiries.db",
            "enquiries.db-journal",
            "enquiries.db-wal",
            "enquiries.db-shm",
            ".gitignore"
        }

        if (
            any(part.startswith(".") for part in path_parts)
            or Path(requested_path).name in blocked_files
            or requested_path.startswith("/__pycache__")
        ):
            self.send_error(404, "File not found")
            return

        super().do_GET()

    def read_json(self):
        try:
            length = int(
                self.headers.get("Content-Length", "0")
            )
        except ValueError:
            self.send_json(
                400,
                {"error": "Invalid request length."}
            )
            return None

        if length <= 0 or length > 10000:
            self.send_json(
                413,
                {"error": "Invalid request size."}
            )
            return None

        if "application/json" not in self.headers.get(
            "Content-Type", ""
        ):
            self.send_json(
                415,
                {"error": "JSON is required."}
            )
            return None

        try:
            data = json.loads(
                self.rfile.read(length).decode("utf-8")
            )
        except (ValueError, UnicodeDecodeError):
            self.send_json(
                400,
                {"error": "Invalid JSON data."}
            )
            return None

        if not isinstance(data, dict):
            self.send_json(
                400,
                {"error": "Invalid form data."}
            )
            return None

        return data

    def validate_common_fields(self, data):
        full_name = str(
            data.get("fullName", "")
        ).strip()

        email = str(
            data.get("email", "")
        ).strip()

        phone = str(
            data.get("phone", "")
        ).strip()

        message = str(
            data.get("message", "")
        ).strip()

        if not 2 <= len(full_name) <= 100:
            return None, "Please enter a valid full name."

        if (
            len(email) > 254
            or not re.fullmatch(
                r"[^@\s]+@[^@\s]+\.[^@\s]+",
                email
            )
        ):
            return None, "Please enter a valid email address."

        if phone:
            digits = re.sub(r"\D", "", phone)

            if (
                len(phone) > 20
                or not 9 <= len(digits) <= 15
                or not re.fullmatch(
                    r"[+()\d\s-]+",
                    phone
                )
            ):
                return None, "Please enter a valid phone number."

        if not 10 <= len(message) <= 1000:
            return None, (
                "Please enter a message between "
                "10 and 1000 characters."
            )

        return {
            "full_name": full_name,
            "email": email,
            "phone": phone,
            "message": message
        }, None

    def do_POST(self):
        if self.path not in (
            "/api/enquiries",
            "/api/contact"
        ):
            self.send_json(
                404,
                {"error": "Endpoint not found."}
            )
            return

        data = self.read_json()

        if data is None:
            return

        fields, error = self.validate_common_fields(data)

        if error:
            self.send_json(
                400,
                {"error": error}
            )
            return

        if self.path == "/api/enquiries":
            self.handle_enquiry(data, fields)
        else:
            self.handle_contact(data, fields)

    def handle_enquiry(self, data, fields):
        enquiry_type = str(
            data.get("enquiryType", "")
        ).strip()

        if enquiry_type not in ENQUIRY_RESPONSES:
            self.send_json(
                400,
                {"error": "Please select an enquiry type."}
            )
            return

        try:
            with sqlite3.connect(DATABASE) as connection:
                cursor = connection.execute(
                    """
                    INSERT INTO enquiries (
                        full_name,
                        email,
                        phone,
                        enquiry_type,
                        message,
                        created_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        fields["full_name"],
                        fields["email"],
                        fields["phone"],
                        enquiry_type,
                        fields["message"],
                        datetime.now(
                            timezone.utc
                        ).isoformat()
                    )
                )

                enquiry_id = cursor.lastrowid

        except sqlite3.Error:
            self.send_json(
                500,
                {"error": "Unable to save the enquiry."}
            )
            return

        self.send_json(
            201,
            {
                "success": True,
                "enquiryId": enquiry_id,
                "message": ENQUIRY_RESPONSES[enquiry_type]
            }
        )

    def handle_contact(self, data, fields):
        message_type = str(
            data.get("messageType", "")
        ).strip()

        if message_type not in CONTACT_TYPES:
            self.send_json(
                400,
                {"error": "Please select a message type."}
            )
            return

        try:
            with sqlite3.connect(DATABASE) as connection:
                cursor = connection.execute(
                    """
                    INSERT INTO contact_messages (
                        full_name,
                        email,
                        phone,
                        message_type,
                        message,
                        created_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        fields["full_name"],
                        fields["email"],
                        fields["phone"],
                        message_type,
                        fields["message"],
                        datetime.now(
                            timezone.utc
                        ).isoformat()
                    )
                )

                message_id = cursor.lastrowid

        except sqlite3.Error:
            self.send_json(
                500,
                {"error": "Unable to save your message."}
            )
            return

        self.send_json(
            201,
            {
                "success": True,
                "messageId": message_id,
                "message": (
                    "Your contact message has been saved "
                    "for this project demonstration. "
                    "To send an email, select Open Prepared Email."
                )
            }
        )


if __name__ == "__main__":
    initialise_database()

    server = ThreadingHTTPServer(
        ("127.0.0.1", PORT),
        WebsiteHandler
    )

    print(
        f"Website running at http://localhost:{PORT}"
    )
    print("Enquiry endpoint: /api/enquiries")
    print("Contact endpoint: /api/contact")

    try:
        server.serve_forever()

    except KeyboardInterrupt:
        print("\nServer stopped.")

    finally:
        server.server_close()
