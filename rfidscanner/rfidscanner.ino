#include <DNSServer.h>
#include <ESP8266WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "Redmi Note 10T 5G";
const char* password = "ansh1334";

// MFRC522 RFID
#define SS_PIN 4
#define RST_PIN 5
MFRC522 mfrc522(SS_PIN, RST_PIN);

// Secure client
WiFiClientSecure client;
String authToken = "";

// API endpoints
const char* loginUrl = "https://festify.up.railway.app/api/auth/login";
const char* verifyUrl = "https://festify.up.railway.app/api/tickets/verify";

void setup() {
  Serial.begin(115200);
  delay(1000);

  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("🔍 RFID Reader Initialized");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\n✅ Connected to WiFi");
  Serial.println("📶 IP Address: " + WiFi.localIP().toString());

  client.setInsecure(); // Skip certificate verification (for development)

  authenticateUser();
}

void loop() {
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    String uid = getCardUID();
    Serial.println("📛 Scanned UID: " + uid);

    String formattedRfid = formatRfid(uid);
    sendVerifyRequest(formattedRfid);

    mfrc522.PICC_HaltA();
  }
}

String getCardUID() {
  String uid = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) uid += "0";
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  return uid;
}

void authenticateUser() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi not connected. Cannot authenticate.");
    return;
  }

  Serial.println("🔐 Authenticating...");

  HTTPClient http;
  http.begin(client, loginUrl);
  http.addHeader("Content-Type", "application/json");

  String jsonBody = "{\"email\":\"test3@example.com\",\"password\":\"test1234\"}";
  int httpCode = http.POST(jsonBody);

  Serial.print("📬 HTTP Code: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println("✅ Login Response Received");

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload);
    if (!error && doc.containsKey("token")) {
      authToken = doc["token"].as<String>();
      Serial.println("🔑 Auth Token: " + authToken);
    } else {
      Serial.println("❌ Token not found or JSON parse error.");
    }
  } else {
    Serial.printf("❌ Login failed. HTTP error: %d\n", httpCode);
  }

  http.end();
}

bool checkWiFi(){
    if(WiFi.status()!= WL_CONNECTED){
        Serial.println("WiFi not connected.");
        return false;
    }
    return true;
    }


void sendVerifyRequest(String rfid) {
  if (!checkWiFi()) return;
  Serial.println("Wifi Connection Successful.");
  if (authToken == "") {
    Serial.println("⚠️ No auth token. Skipping request.");
    return;
  }

  HTTPClient http;
  http.begin(client, verifyUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + authToken);

  String jsonBody = "{\"rfid\":\"" + rfid + "\", \"eventId\":\"67f232186a50ce59fb3ce9f2\"}";
  Serial.println("📤 Sending Verify Request...");
  Serial.println("📦 Body: " + jsonBody);

  int httpCode = http.POST(jsonBody);
  Serial.print("📬 HTTP Code: ");
  Serial.println(httpCode);

  if (httpCode > 0) {
    String response = http.getString();
    Serial.println("📨 Raw Response: " + response);

    // Try parsing as JSON
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, response);

    if (!error && doc.containsKey("message")) {
      String msg = doc["message"].as<String>();
      Serial.println("✅ Server Message: " + msg);
    } else {
      // Fall back if not JSON
      Serial.println("ℹ️ Fallback to raw message:");
      Serial.println("✅ Server Message: " + response);
    }
  } else {
    Serial.printf("❌ Verify request failed. Error: %d\n", httpCode);
  }

  http.end();
}


String formatRfid(String uid) {
  String formatted = "";
  for (byte i = 0; i < uid.length(); i += 2) {
    formatted += uid.substring(i, i + 2);
    if (i + 2 < uid.length()) formatted += " ";
  }
  return formatted;
}
