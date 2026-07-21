package com.jankalyan.storage.service;

import com.jankalyan.storage.dto.UploadResult;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    
    /**
     * Uploads a file to the storage provider.
     *
     * @param file the file to upload
     * @return the UploadResult containing secure URL and public ID
     */
    UploadResult uploadFile(MultipartFile file);

    /**
     * Deletes a file from the storage provider using its identifier.
     *
     * @param publicId the public identifier assigned by the storage provider
     */
    void deleteFile(String publicId);
}
