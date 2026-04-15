package com.smartcampus.modules.facilities.repository;

import com.smartcampus.modules.facilities.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    boolean existsByName(String name);
}
