package org.example;

//import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class serverToSendEmail {

    public static void main(String[] args) throws IOException {
        int serverPort = 8000; // Set your desired port number
        HttpServer server = HttpServer.create(new InetSocketAddress(serverPort), 0);

        server.createContext("/receive-json", new JSONHandler());
        server.setExecutor(null); // Use default executor

        server.start();
        System.out.println("Server is listening on port " + serverPort);
    }

    static class JSONHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                InputStream requestBody = exchange.getRequestBody();
                String json = convertStreamToString(requestBody);

                System.out.println("Received JSON:");
                System.out.println(json);

                JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();
                String email = jsonObject.get("email").getAsString();
                System.out.println("Email: " + email);

                Class<?> objClass = email.getClass();
                System.out.println("Class of obj: " + objClass.getName());

                // Parse JSON using Gson
                //Gson gson = new Gson();
                //JsonObject jsonObject = gson.fromJson(json, JsonObject.class);

                // Here you can process the received JSON data
                final String username = "contato.ergoeasy@gmail.com";
                final String password = "zhab banv rzse vbsx";

                Properties prop = new Properties();
                prop.put("mail.smtp.host", "smtp.gmail.com");
                prop.put("mail.smtp.port", "465");
                prop.put("mail.smtp.auth", "true");
                prop.put("mail.smtp.socketFactory.port", "465");
                prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

                Session session = Session.getInstance(prop,
                        new javax.mail.Authenticator() {
                            protected PasswordAuthentication getPasswordAuthentication() {
                                return new PasswordAuthentication(username, password);
                            }
                        });

                try {

                    Message message = new MimeMessage(session);
                    message.setFrom(new InternetAddress("contato.ergoeasy@gmail.com"));
                    message.setRecipients(
                            Message.RecipientType.TO,
                            InternetAddress.parse(email)
                    );
                    message.setSubject("Pedido de orçamento recebido");
                    message.setText("Olá, recebemos seu pedido de orçamento para acesso a ErgoEasy."
                            + "\n\n Entraremos em contato o mais breve possível");

                    Transport.send(message);

                    System.out.println("Done");

                } catch (MessagingException e) {
                    e.printStackTrace();
                }

                // Send a response (optional)
                String response = "JSON received successfully";
                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }

    private static String convertStreamToString(InputStream is) {
        try (java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A")) {
            return s.hasNext() ? s.next() : "";
        }
    }
}
