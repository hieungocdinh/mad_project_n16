package com.mad_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CommonResponse<T> {
    private int code;
    private String message;
    private T data;
}
