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
        HttpServer server = HttpServer.create(new InetSocketAddress(serverPort), 0); // cria um servidor HTTP o InetSocktAddress cria o endpoint que é o destino final de uma solicitação enviada para um servidor

        server.createContext("/recuperarSenha", new JSONHandler()); //Este trecho de código em Java cria um contexto no servidor para lidar com requisições feitas a um endpoint específico, neste caso, "/receive-json", e associa um manipulador de JSON a esse contexto.
        server.setExecutor(null); // Use default executor

        server.createContext("/orcamento", new Orcamento()); //Este trecho de código em Java cria um contexto no servidor para lidar com requisições feitas a um endpoint específico, neste caso, "/receive-json", e associa um manipulador de JSON a esse contexto.
        server.setExecutor(null); // Use default executor

        server.start();
        System.out.println("Server is listening on port " + serverPort);
    }

    static class JSONHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (exchange.getRequestMethod().equalsIgnoreCase("POST")) { //Esse trecho de código em Java está verificando se o método da requisição HTTP recebida é um POST.
                InputStream requestBody = exchange.getRequestBody(); //Ao chamar exchange.getRequestBody(), você está obtendo um InputStream que permite a leitura dos dados contidos no corpo da requisição
                String json = convertStreamToString(requestBody);

                System.out.println("Received JSON:");
                System.out.println(json);

                JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();

                String nome = jsonObject.get("nome").getAsString();
                String email = jsonObject.get("email").getAsString();
                String token = jsonObject.get("token").getAsString();

                System.out.println("Nome: " + nome);
                System.out.println("Email: " + email);
                System.out.println("Token: " + token);

                // Parse JSON using Gson
                //Gson gson = new Gson();
                //JsonObject jsonObject = gson.fromJson(json, JsonObject.class);


                //Email e senha para acesso ao SMTP
                final String username = "contato.ergoeasy@gmail.com";
                final String password = "zhab banv rzse vbsx";


                //Propriedades para conexão do servidor de email (SMTP) da google 
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
                    message.setSubject("Recuperação de senha");
                    message.setText("Olá " + nome + ", recebemos seu pedido para a recuperação de senha."
                            + "\n\n Segue o link: " + token + "\n\n Caso não tenha sido feito por você essa solicitação, favor ignorar esse email");

                    Transport.send(message);

                    System.out.println("Done");

                } catch (MessagingException e) {
                    e.printStackTrace();
                }

                // Send a response (optional)
                String response = "Email enviado com sucesso";
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

    static class Orcamento implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (exchange.getRequestMethod().equalsIgnoreCase("POST")) { //Esse trecho de código em Java está verificando se o método da requisição HTTP recebida é um POST.
                InputStream requestBody = exchange.getRequestBody(); //Ao chamar exchange.getRequestBody(), você está obtendo um InputStream que permite a leitura dos dados contidos no corpo da requisição
                String json = convertStreamToStringOrcamento(requestBody);

                System.out.println("Received JSON:");
                System.out.println(json);

                JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();

                String nome = jsonObject.get("nome").getAsString();
                String email = jsonObject.get("email").getAsString();

                System.out.println("Nome: " + nome);
                System.out.println("Email: " + email);

                // Parse JSON using Gson
                //Gson gson = new Gson();
                //JsonObject jsonObject = gson.fromJson(json, JsonObject.class);


                //Email e senha para acesso ao SMTP
                final String username = "contato.ergoeasy@gmail.com";
                final String password = "zhab banv rzse vbsx";


                //Propriedades para conexão do servidor de email (SMTP) da google 
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
                    message.setSubject("Solicitação de orçamento");
                    message.setText("Olá " + nome + ", recebemos seu pedido de orçamento.\n\n" + "Acesse o link para realizar o cadastro: http://localhost:3000/register");
                    
                    Transport.send(message);

                    System.out.println("Done");

                } catch (MessagingException e) {
                    e.printStackTrace();
                }

                // Send a response (optional)
                String response = "Email enviado com sucesso";
                exchange.sendResponseHeaders(200, response.getBytes().length);
                OutputStream os = exchange.getResponseBody();
                os.write(response.getBytes());
                os.close();
            }
        }
    }

    private static String convertStreamToStringOrcamento(InputStream is) {
        try (java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A")) {
            return s.hasNext() ? s.next() : "";
        }
    }
}
