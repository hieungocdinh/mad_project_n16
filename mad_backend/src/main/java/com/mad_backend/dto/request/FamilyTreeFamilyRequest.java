package com.mad_backend.dto.request;

import com.mad_backend.dto.entity.Family;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FamilyTreeFamilyRequest {
    private Family family;
    private Integer generation;
}
