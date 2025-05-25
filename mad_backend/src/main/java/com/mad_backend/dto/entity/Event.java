package com.mad_backend.dto.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "events")
public class Event extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "family_id")
    private Family family;

    private String description;
    private String eventType;
    private String location;
    private LocalDateTime date;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<Long> peopleIds;
}
