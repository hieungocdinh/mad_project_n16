package com.mad_backend.mapper;

import com.mad_backend.dto.entity.Profile;
import com.mad_backend.dto.request.ProfileRequest;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "deathDate", source = "deathDate", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    void updateProfileFromRequest(ProfileRequest request, @MappingTarget Profile profile);
}