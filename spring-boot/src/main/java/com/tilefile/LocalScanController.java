package com.tilefile;

import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/v1/local-scan")
@CrossOrigin(origins = "http://localhost:5173")
public class LocalScanController {
    private final LocalScanService localScanService;
    private final TileFileService tileFileService;

    public LocalScanController(LocalScanService localScanService, TileFileService tileFileService) {
        this.localScanService = localScanService;
        this.tileFileService = tileFileService;
    }

    // Returns a list of files in the user's local directory
    @GetMapping("/files")
    public List<LocalFileDTO> getScannedFiles() throws IOException {
        return localScanService.listAvailableFiles();
    }

    // Imports files from local computer into database
    @PostMapping("/import")
    public void importFile(@RequestParam String fileName) throws IOException {

        byte[] fileData = localScanService.readFileContent(fileName);

        TileFile newFile = new TileFile();
        newFile.setName(fileName);
        newFile.setData(fileData);

        tileFileService.insertFile(newFile);
    }

}
