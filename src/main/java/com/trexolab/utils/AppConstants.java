package com.trexolab.utils;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class AppConstants {

    // ============================================
    // APP BRANDING (Single Source of Truth)
    // ============================================
    public static final String APP_NAME_SHORT = "Trexo PDF Signer";
    public static final String APP_NAME_DISPLAY = "Trexo PDF Signer";
    public static final String APP_NAME_FULL = "Trexo PDF Signer by TrexoLab";
    public static final String APP_NAME = APP_NAME_SHORT + " - v" + loadVersionFromFile();
    public static final String APP_VERSION = loadVersionFromFile();
    public static final String APP_DESCRIPTION = "Professional PDF signing solution for Windows Certificate Store, PKCS#11/HSM, and PFX files.";

    // ============================================
    // DIRECTORY & FILE NAMING (Single Source)
    // ============================================
    public static final String CONFIG_DIR_NAME = ".trexo-pdf-signer";
    public static final String JAR_FILENAME = "TrexoPDFSigner.jar";
    public static final String TEMP_PREFIX = "trexo_";

    // Sub-directories and files
    public static final String SIGNATURE_IMAGES_SUBDIR = "signature-images";
    public static final String TRUSTED_CERTS_SUBDIR = "trusted-certs";
    public static final String PROFILES_FILENAME = "appearance-profiles.json";
    public static final String CONFIG_FILENAME = "config.yml";

    // Organization
    public static final String ORG_NAME = "TrexoLab";
    public static final String ORG_WEBSITE = "https://trexolab.com";
    public static final String ORG_EMAIL = "contact@trexolab.com";

    // GitHub Repository
    public static final String GITHUB_OWNER = "trexolab-solution";
    public static final String GITHUB_REPO = "trexo-pdf-signer";
    public static final String GITHUB_BASE_URL = "https://github.com/" + GITHUB_OWNER + "/" + GITHUB_REPO;

    // Product URLs
    public static final String APP_WEBSITE = "https://" + GITHUB_OWNER + ".github.io/" + GITHUB_REPO + "/";
    public static final String APP_GITHUB = GITHUB_BASE_URL;
    public static final String APP_LICENSE_URL = GITHUB_BASE_URL + "/blob/main/LICENSE";
    public static final String APP_ISSUES_URL = GITHUB_BASE_URL + "/issues";
    public static final String APP_RELEASES_URL = GITHUB_BASE_URL + "/releases";
    public static final String APP_RELEASES_LATEST_URL = APP_RELEASES_URL + "/latest";
    public static final String GITHUB_API_BASE_URL = "https://api.github.com/repos/" + GITHUB_OWNER + "/" + GITHUB_REPO;
    public static final String GITHUB_API_RELEASES_URL = GITHUB_API_BASE_URL + "/releases";

    // Legacy alias for backward compatibility
    public static final String APP_AUTHOR = ORG_NAME;

    public static final String LOGO_PATH = "/images/logo.png";


    public static final String TIMESTAMP_SERVER = "http://timestamp.comodoca.com";

    // Config directory: ~/.trexo-pdf-signer/
    public static final Path CONFIG_DIR_PATH = Paths.get(System.getProperty("user.home"), CONFIG_DIR_NAME);
    public static final Path CONFIG_FILE_PATH = CONFIG_DIR_PATH.resolve(CONFIG_FILENAME);
    public static final String CONFIG_FILE = CONFIG_FILE_PATH.toString();
    public static final String CONFIG_DIR = CONFIG_DIR_PATH.toString();

    // Derived paths for sub-directories
    public static final Path SIGNATURE_IMAGES_PATH = CONFIG_DIR_PATH.resolve(SIGNATURE_IMAGES_SUBDIR);
    public static final Path TRUSTED_CERTS_PATH = CONFIG_DIR_PATH.resolve(TRUSTED_CERTS_SUBDIR);
    public static final Path PROFILES_PATH = CONFIG_DIR_PATH.resolve(PROFILES_FILENAME);


    // Store names
    public static final String WIN_KEY_STORE = "WINDOWS";
    public static final String PKCS11_KEY_STORE = "PKCS11";
    public static final String SOFTHSM = "SOFTHSM";

    public static boolean isWindow = getOs().toLowerCase().contains("win");
    public static boolean isLinux = getOs().toLowerCase().contains("nix") || getOs().contains("nux") || getOs().contains("aix");
    public static boolean isMac = getOs().toLowerCase().contains("mac");

    public static String getOs() {
        return System.getProperty("os.name");
    }

    /**
     * Loads the application version from the VERSION file bundled in resources.
     * The VERSION file is read from the classpath at build time.
     * Falls back to "1.0.0" if the file cannot be read.
     *
     * @return The version string from VERSION file or "1.0.0" as fallback
     */
    private static String loadVersionFromFile() {
        String defaultVersion = "1.0.0";

        System.out.println(CONFIG_FILE_PATH);

        try {
            // Try to load from classpath (bundled in JAR)
            InputStream inputStream = AppConstants.class.getResourceAsStream("/VERSION");
            if (inputStream != null) {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
                    String version = reader.readLine();
                    if (version != null && !version.trim().isEmpty()) {
                        return version.trim();
                    }
                }
            }

            // Fallback: Try loading from file system (for development)
            java.io.File versionFile = new java.io.File("VERSION");
            if (versionFile.exists()) {
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(Files.newInputStream(versionFile.toPath()), StandardCharsets.UTF_8))) {
                    String version = reader.readLine();
                    if (version != null && !version.trim().isEmpty()) {
                        return version.trim();
                    }
                }
            }
        } catch (Exception e) {
            // Log silently - version loading should not crash the app
            System.err.println("Warning: Could not load version from VERSION file: " + e.getMessage());
        }

        return defaultVersion;
    }
}
