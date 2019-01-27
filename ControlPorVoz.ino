#include <ESP8266WiFi.h>;
#include <FirebaseArduino.h> 

// Set these to run example.
#define FIREBASE_HOST "oneago-home-ca7b8.firebaseio.com"
#define FIREBASE_AUTH "hL8vAXXigIDWpMcck56MgsU24Tb5xBTjpkP297UB"
//Change line with your WiFi router name and password
#define WIFI_SSID "Bucuru_Rueda"  
#define WIFI_PASSWORD "cga010119216801"
#define LED 2
#define TOUCH_SWITCH 4
#define WIFI_CONNECTED 12

//0 y 1 invertido

void setup() {
  pinMode(LED, OUTPUT);
  pinMode(TOUCH_SWITCH, INPUT);
  pinMode(WIFI_CONNECTED, OUTPUT);
  digitalWrite(LED,1);
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    digitalWrite(WIFI_CONNECTED, LOW);
    delay(500);
  }
  digitalWrite(WIFI_CONNECTED, HIGH);
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  Serial.println(WiFi.macAddress());
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.setString("LEDstatus", "0");
}

void loop() {

  if(Firebase.getString("LEDstatus").toInt()) {
    digitalWrite(LED,0);
  } else {
    digitalWrite(LED,1);
  }
  
  Serial.print("LED -> ");
  Serial.println(digitalRead(LED));
  Serial.print("TOUCH -> ");
  Serial.println(digitalRead(TOUCH_SWITCH));
   
  if(digitalRead(TOUCH_SWITCH) == HIGH) {
    if(digitalRead(LED) == HIGH) {
      Firebase.setString("LEDstatus", "1");
      digitalWrite(LED,0);
    } else {
      Firebase.setString("LEDstatus", "0");
      digitalWrite(LED,1);
    }
    delay(300);
  }
 
  Serial.print("FirebaseStatus -> ");
  Serial.println(Firebase.getString("LEDstatus").toInt());

  if (Firebase.failed()) {
    Serial.print("setting /number failed:");
    Serial.println(Firebase.error());
    digitalWrite(WIFI_CONNECTED, LOW);
    //setup();
    return;
  }
  //delay(500);
}
