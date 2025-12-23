package com.tilefile;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/tile-file")
public class TileFileController {

    private final TileFileService tileFileService;

    public TileFileController(TileFileService tileFileService) {
        this.tileFileService = tileFileService;
    }

    @GetMapping // GET request
    public List<TileFile> getAllFiles() {
        return tileFileService.getAllFiles();
    }

    @GetMapping("/{id}") // GET request
    public TileFile getFileById(@PathVariable Integer id) {
        return tileFileService.getFileById(id);
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewFile(@PathVariable Integer id) {
        TileFile file = tileFileService.getFileById(id);

        ByteArrayResource resource = new ByteArrayResource(file.getData());

        return ResponseEntity.ok()
                // "inline" = Show in browser. "attachment" = Force download.
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(file.getData().length) // Important for progress bars
                .body(resource);
    }

    @PostMapping(consumes = "multipart/form-data")
    // TODO: don't use SoftwareEngineer entity directly (DTO)
    public void insertFile(@RequestParam("file") MultipartFile file,
                           @RequestParam(required = false) String gDriveLink) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalStateException("Cannot upload empty file");
        }

//        if (!"application/pdf".equals(file.getContentType())) {
//            throw new IllegalStateException("Only PDF files are allowed");
//        }

        tileFileService.storeFile(file, gDriveLink);
    }

    @DeleteMapping("/{id}")
    public void deleteFile(@PathVariable Integer id) {
        tileFileService.deleteFile(id);
    }

    @PatchMapping("/{id}")
    // TODO: don't use TileFile entity directly (DTO)
    public void patchFile(@PathVariable Integer id,
                                      @RequestParam(required = false) String name,
                                      @RequestParam(required = false) MultipartFile file,
                                      @RequestParam(required = false) String gDriveLink) throws IOException {
        tileFileService.patchFile(id, name, file, gDriveLink);
    }
}
