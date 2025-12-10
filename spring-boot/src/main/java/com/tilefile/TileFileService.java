package com.tilefile;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service //makes it available as a bean so it can be used within other classes
public class TileFileService {
    private final TileFileRepository tileFileRepository;

    public TileFileService(TileFileRepository tileFileRepository) {
        this.tileFileRepository = tileFileRepository;
    }

    public List<TileFile> getAllFiles() {
        return tileFileRepository.findAll();

        // map Entity into Data Transform Object for the user (because there could be sensitive data)
        // return softwareEngineerRepository.findAll().stream().map();
    }

    public TileFile getFileById(Integer id) {
        return tileFileRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException(id + " not found"));
    }

    public void insertFile(TileFile tileFile) {
        tileFileRepository.save(tileFile);
    }

    public void storeFile(MultipartFile file, String gDriveLink) throws IOException {
        String fileName = file.getOriginalFilename();

        // Clean the path just in case
        // (org.springframework.util.StringUtils is useful here)

        TileFile currentFile = new TileFile();
        currentFile.setName(fileName);
//        currentFile.setStatus("UPLOADED");
        currentFile.setData(file.getBytes()); // <--- Saving the actual PDF content

        if (gDriveLink != null && !gDriveLink.isEmpty()) {
            currentFile.setGDriveLink(gDriveLink);
        }

        tileFileRepository.save(currentFile);
    }

    public void deleteFile(Integer id) {
        TileFile currentFile = getFileById(id);
        tileFileRepository.delete(currentFile);
    }

    public void patchFile(Integer id, String name, MultipartFile file, String gDriveLink) throws IOException {
        TileFile currentFile = tileFileRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException(id + " not found"));

        if (name != null) {
            currentFile.setName(name);
        }

        // We check if file is not null AND not empty
        if (file != null && !file.isEmpty()) {
            currentFile.setData(file.getBytes());
            // Optional: You might want to update the name to match the new file if the user didn't provide a custom name
            // if (name == null) { currentFile.setName(file.getOriginalFilename()); }
        }

        if (gDriveLink != null) {
            currentFile.setGDriveLink(gDriveLink);
        }

        tileFileRepository.save(currentFile);
    }
}
