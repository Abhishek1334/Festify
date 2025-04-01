import requests

TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2IwYTEzZTY4ZmMxNmE1NzI4ZmNlNCIsImlhdCI6MTc0MzQyNTc0NywiZXhwIjoxNzQzNDI5MzQ3fQ.qB0NvhVHokIng9-focuUW8FoV4u-IFlQ-NIpO31CmTE"

# Headers with Authorization
headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Test RFID Verification
rfid_payload = {"rfid": "F5 EF 4B 33", "eventId": "67ea90601b4db611502cfb7b"}
rfid_response = requests.post(
    "http://localhost:5000/api/tickets/verify", json=rfid_payload, headers=headers
)
print("RFID Response:", rfid_response.json())

# Test Ticket ID Verification
ticket_payload = {"ticketId": "67e91d10073307a762126ee1", "eventId": "67caf041b02dce7b82f69ad8"}
ticket_response = requests.post(
    "http://localhost:5000/api/tickets/verify", json=ticket_payload, headers=headers
)
print("Ticket Response:", ticket_response.json())
