package com.tilefile;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.Objects;


@Entity // formats it to be used in a database
public class TileFile {
    @JsonProperty("id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    @Column(name = "g_drive_link")
    private String gDriveLink;

    @Lob
    @JsonIgnore
    @Column(length = 1000000) // Increase size limit if needed (default is often small)
    private byte[] data;

    public TileFile() {
    }

    public TileFile(Integer id,
                    String name,
                    byte[] data,
                    String gDriveLink) {
        this.id = id;
        this.name = name;
        this.data = data;
        this.gDriveLink = gDriveLink;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGDriveLink() {return gDriveLink;}

    public void setGDriveLink(String newDriveLink) {this.gDriveLink = newDriveLink;}

    public byte[] getData() { return data; }

    public void setData(byte[] data) { this.data = data; }

    // TODO: read over equals and hashcode implementation
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TileFile tileFile = (TileFile) o;
        return Objects.equals(id, tileFile.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

//    public void setStatus(String uploaded) {
//    }
}
