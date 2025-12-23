package com.tilefile;

public class LocalFileDTO {
    private String name;
    private long lastModified;

    public LocalFileDTO(String name, long lastModified) {
        this.name = name;
        this.lastModified = lastModified;
    }

    public String getName() {
        return name;
    }

    public long getLastModified() {
        return lastModified;
    }
}
