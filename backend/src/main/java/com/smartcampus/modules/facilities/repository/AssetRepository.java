package com.smartcampus.modules.facilities.repository;

import com.smartcampus.modules.facilities.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
}
