package com.tilefile;

import org.springframework.stereotype.Service;

import java.util.List;

@Service //makes it available as a bean so it can be used within other classes
public class SoftwareEngineerService {
    private final SoftwareEngineerRepository softwareEngineerRepository;

    public SoftwareEngineerService(SoftwareEngineerRepository softwareEngineerRepository) {
        this.softwareEngineerRepository = softwareEngineerRepository;
    }

    public List<SoftwareEngineer> getAllSoftwareEngineers() {
        return softwareEngineerRepository.findAll();

        // map Entity into Data Transform Object for the user (because there could be sensitive data)
        // return softwareEngineerRepository.findAll().stream().map();
    }

    public SoftwareEngineer getSoftwareEngineerById(Integer id) {
        return softwareEngineerRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException(id + " not found"));
    }

    public void insertSoftwareEngineer(SoftwareEngineer softwareEngineer) {
        softwareEngineerRepository.save(softwareEngineer);
    }

    public void deleteSoftwareEngineer(Integer id) {
        SoftwareEngineer engineer = getSoftwareEngineerById(id);
        softwareEngineerRepository.delete(engineer);
    }

    public void patchSoftwareEngineer(Integer id, String name, String techStack) {
        SoftwareEngineer engineer = softwareEngineerRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException(id + " not found"));

        if (name != null) {
            engineer.setName(name);
        }

        if (techStack != null) {
            engineer.setTechStack(techStack);
        }

        softwareEngineerRepository.save(engineer);
    }
}
