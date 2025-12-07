package com.tilefile;

import org.springframework.data.jpa.repository.JpaRepository;

// specify the type for Repository and the type primary key or ID
public interface SoftwareEngineerRepository extends JpaRepository<SoftwareEngineer, Integer> {

}
