package com.mad_backend.dto.entity;

import com.mad_backend.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Where;

import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity {
    private String username;
    private String password;
    private String email;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role_name")
    @Enumerated(EnumType.STRING)
    private List<Role> roles;

    @ManyToMany(mappedBy = "users", fetch = FetchType.EAGER)
    private List<Family> families;

    @OneToOne(mappedBy = "user")
    private Profile profile;

    @OneToMany(mappedBy = "user")
    private List<FamilyStory> familyStories;
}
