package com.mad_backend.dto.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "albums")
public class Album extends BaseEntity {
    private String albumName;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private Family family;

    @ManyToMany
    @JoinTable(name = "album_image",
            joinColumns = @JoinColumn(name = "album_id"),
            inverseJoinColumns = @JoinColumn(name = "image_id"))
    private List<Image> images;

    private String coverImageUrl;
}
