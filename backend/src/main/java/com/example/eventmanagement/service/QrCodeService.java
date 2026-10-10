package com.example.eventmanagement.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.UUID;

@Service
public class QrCodeService {

    private static final Logger logger = LoggerFactory.getLogger(QrCodeService.class);
    private static final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generates an unpredictable, cryptographically random QR token for registration.
     */
    public String generateUniqueQrToken(Long eventId, Long userId) {
        String randomSuffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        long timestamp = System.currentTimeMillis() % 1000000;
        return String.format("EVT%d-U%d-%s%06d", eventId, userId, randomSuffix, timestamp);
    }

    /**
     * Generates a QR Code PNG image as a byte array for a given content string.
     */
    public byte[] generateQrCodeImageBytes(String content, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            logger.error("Error generating QR code image for content {}: {}", content, e.getMessage());
            return new byte[0];
        }
    }

    /**
     * Generates a Data URL formatted Base64 QR code image (data:image/png;base64,...)
     */
    public String generateQrCodeBase64(String content) {
        byte[] imageBytes = generateQrCodeImageBytes(content, 300, 300);
        if (imageBytes.length == 0) {
            return "";
        }
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }
}
