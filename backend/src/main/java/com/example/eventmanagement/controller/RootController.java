package com.example.eventmanagement.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String root() {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Event Management System - API Running</title>
                <meta http-equiv="refresh" content="2;url=http://localhost:3000" />
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background: linear-gradient(135deg, #0b1528 0%, #102a4e 100%);
                        color: #f0f4f8;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        padding: 1.5rem;
                        box-sizing: border-box;
                    }
                    .card {
                        background: #132238;
                        border: 1px solid #1e3a5f;
                        border-radius: 16px;
                        padding: 2.5rem;
                        max-width: 540px;
                        width: 100%;
                        text-align: center;
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
                    }
                    .badge {
                        display: inline-block;
                        background: rgba(16, 185, 129, 0.2);
                        color: #34d399;
                        border: 1px solid rgba(16, 185, 129, 0.4);
                        padding: 0.4rem 1rem;
                        border-radius: 9999px;
                        font-size: 0.85rem;
                        font-weight: 600;
                        margin-bottom: 1.25rem;
                    }
                    h1 {
                        color: #38bdf8;
                        font-size: 1.75rem;
                        margin: 0 0 1rem 0;
                    }
                    p {
                        color: #94a3b8;
                        font-size: 1.05rem;
                        line-height: 1.6;
                        margin: 0 0 1.75rem 0;
                    }
                    .btn {
                        display: inline-block;
                        background: #2563eb;
                        color: #ffffff;
                        padding: 0.85rem 2rem;
                        text-decoration: none;
                        border-radius: 10px;
                        font-weight: 600;
                        font-size: 1.05rem;
                        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
                        transition: all 0.2s ease;
                    }
                    .btn:hover {
                        background: #1d4ed8;
                        transform: translateY(-1px);
                    }
                    .countdown {
                        margin-top: 1.25rem;
                        font-size: 0.85rem;
                        color: #64748b;
                    }
                </style>
            </head>
            <body>
                <div class="card">
                    <span class="badge">&#10004; Spring Boot REST API is Active (Port 8080)</span>
                    <h1>Event Management Backend</h1>
                    <p>
                        You have navigated to the backend API server.
                        The interactive user interface is running on <strong>port 3000</strong>.
                    </p>
                    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:1rem;">
                        <a class="btn" href="http://localhost:3000">Open Web Interface (Port 3000) &rarr;</a>
                        <a class="btn" style="background:#059669;" href="/download">Download Project ZIP &darr;</a>
                    </div>
                    <div class="countdown">Redirecting you to http://localhost:3000 in 3 seconds...</div>
                </div>
            </body>
            </html>
            """;
    }

    @GetMapping(value = "/download", produces = "application/zip")
    public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> downloadProjectZip() {
        java.io.File file = new java.io.File("C:/Users/om/Downloads/EventManagementSystem.zip");
        if (!file.exists()) {
            file = new java.io.File("C:/Users/om/.gemini/antigravity/scratch/EventManagementSystem.zip");
        }
        if (!file.exists()) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(file);
        return org.springframework.http.ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"EventManagementSystem.zip\"")
                .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, "application/zip")
                .body(resource);
    }

    @GetMapping(value = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> apiInfo() {
        return Map.of(
                "application", "Event Management & Registration System",
                "status", "UP",
                "backendPort", 8080,
                "frontendUrl", "http://localhost:3000",
                "downloadZipUrl", "http://localhost:8080/download",
                "eventsEndpoint", "/api/events",
                "loginEndpoint", "/api/auth/login",
                "registerEndpoint", "/api/auth/register"
        );
    }
}
