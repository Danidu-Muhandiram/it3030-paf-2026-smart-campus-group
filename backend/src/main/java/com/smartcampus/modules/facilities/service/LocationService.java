package com.smartcampus.modules.facilities.service;

import com.smartcampus.modules.facilities.dto.LocationRequest;
import com.smartcampus.modules.facilities.dto.LocationResponse;
import com.smartcampus.modules.facilities.entity.Location;
import com.smartcampus.modules.facilities.repository.LocationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Transactional(readOnly = true)
    public List<LocationResponse> getAll() {
        return locationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LocationResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public LocationResponse create(LocationRequest request) {
        Location location = Location.builder()
                .name(request.getName().trim())
                .buildingName(request.getBuildingName())
                .floorNo(request.getFloorNo())
                .build();
        return toResponse(locationRepository.save(location));
    }

    public LocationResponse update(Long id, LocationRequest request) {
        Location location = findOrThrow(id);
        location.setName(request.getName().trim());
        location.setBuildingName(request.getBuildingName());
        location.setFloorNo(request.getFloorNo());
        return toResponse(locationRepository.save(location));
    }

    public void delete(Long id) {
        findOrThrow(id);
        locationRepository.deleteById(id);
    }

    // -------------------------------------------------------------------------
    private Location findOrThrow(Long id) {
        return locationRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Location not found: " + id));
    }

    public LocationResponse toResponse(Location l) {
        return LocationResponse.builder()
                .id(l.getId())
                .name(l.getName())
                .buildingName(l.getBuildingName())
                .floorNo(l.getFloorNo())
                .build();
    }
}
