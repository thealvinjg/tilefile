package com.tilefile;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class LocalScanService {
    // same directory as defined in compose file
    private final Path SCAN_DIR = Paths.get("/app/scanned-files");

    // List all files in the scanned-files directory
    public List<LocalFileDTO> listAvailableFiles() throws IOException {
        File folder = SCAN_DIR.toFile();

        // Safety check if folder doesn't exist yet
        if (!folder.exists() || !folder.isDirectory()) {
            return new ArrayList<>();
        }

        File[] files = folder.listFiles((dir, name) -> name.toLowerCase().endsWith(".pdf"));
        List<LocalFileDTO> dtos = new ArrayList<>();

        if (files != null) {
            for (File f : files) {
                dtos.add(new LocalFileDTO(f.getName(), f.lastModified()));
            }
        }
        return dtos;
    }

    // Read the file content when the user selects it
    public byte[] readFileContent(String fileName) throws IOException {
        // SECURITY: Sanitize to prevent ".." attacks
        Path filePath = SCAN_DIR.resolve(fileName).normalize();

        // Ensure the file is actually inside our allowed directory
        if (!filePath.startsWith(SCAN_DIR)) {
            throw new SecurityException("Access denied");
        }

        return Files.readAllBytes(filePath);
    }
}
