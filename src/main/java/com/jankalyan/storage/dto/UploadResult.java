package com.jankalyan.storage.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UploadResult {
    String imageUrl;
    String publicId;
}
