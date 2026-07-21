package com.jankalyan.common.util;

public final class StringUtils {
    private StringUtils() {}

    public static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
