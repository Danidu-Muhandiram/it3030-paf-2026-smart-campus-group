package com.smartcampus.modules.facilities.repository;

import com.smartcampus.modules.facilities.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    /** Returns distinct type values from existing assets — used to populate the type dropdown. */
    @Query("SELECT DISTINCT a.type FROM Asset a ORDER BY a.type")
    List<String> findDistinctTypes();
}
