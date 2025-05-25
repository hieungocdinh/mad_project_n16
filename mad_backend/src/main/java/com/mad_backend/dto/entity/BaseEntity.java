package com.mad_backend.dto.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@MappedSuperclass
@Data
public abstract class BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private UUID code;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt; 
    private boolean isDeleted;

    @PrePersist
    protected void onCreate() {
        this.code = UUID.randomUUID();
        this.isDeleted = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
