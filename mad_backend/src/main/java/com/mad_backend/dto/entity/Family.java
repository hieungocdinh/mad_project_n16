package com.mad_backend.dto.entity;

import com.mad_backend.enums.FamilyStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Table(name = "families")
@Entity
public class Family extends BaseEntity {

    private String name;
    private String avatarUrl;

    @OneToOne
    private User husband;

    @OneToOne
    private User wife;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<Long> childIds;

    private FamilyStatus status;

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(name = "user_family",
            joinColumns = @JoinColumn(name = "family_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> users;

    @OneToMany(mappedBy = "family")
    private List<Event> events;

    @OneToMany(mappedBy = "family")
    private List<FamilyTreeFamily> familyTreeFamilies;

    @OneToMany(mappedBy = "family")
    private List<Image> images;

    @OneToMany(mappedBy = "family")
    private List<Album> albums;
}
