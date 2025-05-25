package com.mad_backend.dto.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "images")
public class Image extends BaseEntity {
    private String url;

    @ManyToMany(mappedBy = "images")
    private List<Album> albums;

    @ManyToOne
    @JoinColumn(name = "family_id")
    private Family family;
}
