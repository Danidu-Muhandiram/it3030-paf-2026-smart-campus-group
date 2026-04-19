package com.smartcampus.modules.facilities.service;

import com.smartcampus.modules.facilities.dto.AssetRequest;
import com.smartcampus.modules.facilities.dto.AssetResponse;
import com.smartcampus.modules.facilities.entity.Asset;
import com.smartcampus.modules.facilities.entity.Location;
import com.smartcampus.modules.facilities.entity.ResourceType;
import com.smartcampus.modules.facilities.repository.AssetRepository;
import com.smartcampus.modules.facilities.repository.LocationRepository;
import com.smartcampus.modules.facilities.repository.ResourceTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class AssetService {

    private final AssetRepository assetRepository;
    private final LocationRepository locationRepository;
    private final ResourceTypeRepository resourceTypeRepository;
    private final LocationService locationService;
    private final ResourceTypeService resourceTypeService;

    public AssetService(AssetRepository assetRepository,
                        LocationRepository locationRepository,
                        ResourceTypeRepository resourceTypeRepository,
                        LocationService locationService,
                        ResourceTypeService resourceTypeService) {
        this.assetRepository = assetRepository;
        this.locationRepository = locationRepository;
        this.resourceTypeRepository = resourceTypeRepository;
        this.locationService = locationService;
        this.resourceTypeService = resourceTypeService;
    }

    @Transactional(readOnly = true)
    public List<AssetResponse> getAll() {
        return assetRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AssetResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public AssetResponse create(AssetRequest request) {
        Location location = resolveLocation(request.getLocationId());
        ResourceType type = resolveType(request.getTypeId());
        Asset asset = Asset.builder()
                .name(request.getName().trim())
                .type(type)
                .status(request.getStatus())
                .capacity(request.getCapacity())
                .imageUrl(request.getImageUrl())
                .location(location)
                .build();
        return toResponse(assetRepository.save(asset));
    }

    public AssetResponse update(Long id, AssetRequest request) {
        Asset asset = findOrThrow(id);
        asset.setName(request.getName().trim());
        asset.setType(resolveType(request.getTypeId()));
        asset.setStatus(request.getStatus());
        asset.setCapacity(request.getCapacity());
        asset.setLocation(resolveLocation(request.getLocationId()));
        if (request.getImageUrl() != null) {
            asset.setImageUrl(request.getImageUrl());
        }
        return toResponse(assetRepository.save(asset));
    }

    public void delete(Long id) {
        findOrThrow(id);
        assetRepository.deleteById(id);
    }

    // -------------------------------------------------------------------------
    private Asset findOrThrow(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Asset not found: " + id));
    }

    private Location resolveLocation(Long locationId) {
        return locationRepository.findById(locationId)
                .orElseThrow(() -> new NoSuchElementException("Location not found: " + locationId));
    }

    private ResourceType resolveType(Long typeId) {
        return resourceTypeRepository.findById(typeId)
                .orElseThrow(() -> new NoSuchElementException("Resource type not found: " + typeId));
    }

    public AssetResponse toResponse(Asset a) {
        return AssetResponse.builder()
                .id(a.getId())
                .name(a.getName())
                .type(a.getType() != null ? resourceTypeService.toResponse(a.getType()) : null)
                .status(a.getStatus())
                .capacity(a.getCapacity())
                .imageUrl(a.getImageUrl())
                .location(a.getLocation() != null ? locationService.toResponse(a.getLocation()) : null)
                .build();
    }
}
