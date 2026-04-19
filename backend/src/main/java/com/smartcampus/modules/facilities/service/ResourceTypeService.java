package com.smartcampus.modules.facilities.service;

import com.smartcampus.modules.facilities.dto.ResourceTypeRequest;
import com.smartcampus.modules.facilities.dto.ResourceTypeResponse;
import com.smartcampus.modules.facilities.entity.ResourceType;
import com.smartcampus.modules.facilities.repository.ResourceTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class ResourceTypeService {

    private final ResourceTypeRepository resourceTypeRepository;

    public ResourceTypeService(ResourceTypeRepository resourceTypeRepository) {
        this.resourceTypeRepository = resourceTypeRepository;
    }

    @Transactional(readOnly = true)
    public List<ResourceTypeResponse> getAll() {
        return resourceTypeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ResourceTypeResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public ResourceTypeResponse create(ResourceTypeRequest request) {
        ResourceType resourceType = ResourceType.builder()
                .name(request.getName().trim())
                .build();
        return toResponse(resourceTypeRepository.save(resourceType));
    }

    public ResourceTypeResponse update(Long id, ResourceTypeRequest request) {
        ResourceType resourceType = findOrThrow(id);
        resourceType.setName(request.getName().trim());
        return toResponse(resourceTypeRepository.save(resourceType));
    }

    public void delete(Long id) {
        findOrThrow(id);
        resourceTypeRepository.deleteById(id);
    }

    // -------------------------------------------------------------------------
    private ResourceType findOrThrow(Long id) {
        return resourceTypeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource type not found: " + id));
    }

    public ResourceTypeResponse toResponse(ResourceType rt) {
        return ResourceTypeResponse.builder()
                .id(rt.getId())
                .name(rt.getName())
                .build();
    }
}
