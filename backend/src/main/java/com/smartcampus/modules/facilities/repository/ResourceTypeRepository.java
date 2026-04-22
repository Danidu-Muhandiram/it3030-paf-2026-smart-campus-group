package com.smartcampus.modules.facilities.repository;

import com.smartcampus.modules.facilities.entity.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceTypeRepository extends JpaRepository<ResourceType, Long> {
    boolean existsByName(String name);
}
