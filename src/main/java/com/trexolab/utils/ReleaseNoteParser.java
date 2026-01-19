package com.trexolab.utils;

/**
 * Utility class for wrapping HTML content with dark theme styling for Swing JEditorPane.
 * Works with pre-rendered HTML from GitHub API - no external dependencies needed.
 */
public class ReleaseNoteParser {

    /**
     * Wraps HTML content with dark theme CSS styling for display in JEditorPane.
     * Designed to style GitHub's pre-rendered HTML release notes.
     *
     * @param htmlContent The HTML content to wrap (from GitHub API body_html)
     * @return Styled HTML string ready for JEditorPane display
     */
    public static String wrapHtmlWithStyle(String htmlContent) {
        if (htmlContent == null || htmlContent.isEmpty()) {
            return "";
        }

        return "<html><head><style>"
                // Base styles
                + "body { "
                + "  font-family: 'Segoe UI', Arial, sans-serif; "
                + "  font-size: 11px; "
                + "  color: #CCCCCC; "
                + "  margin: 0; "
                + "  padding: 10px; "
                + "  background-color: #232323; "
                + "  line-height: 1.5; "
                + "}"

                // Headings
                + "h1, h2, h3, h4, h5, h6 { color: #FFFFFF; margin-top: 16px; margin-bottom: 8px; }"
                + "h1 { font-size: 18px; border-bottom: 1px solid #444444; padding-bottom: 6px; }"
                + "h2 { font-size: 16px; border-bottom: 1px solid #3a3a3a; padding-bottom: 4px; }"
                + "h3 { font-size: 14px; }"
                + "h4 { font-size: 12px; }"
                + "h5 { font-size: 11px; }"
                + "h6 { font-size: 10px; color: #AAAAAA; }"

                // Paragraphs
                + "p { margin: 8px 0; line-height: 1.6; }"

                // Lists
                + "ul, ol { margin: 8px 0; padding-left: 24px; }"
                + "li { margin: 4px 0; line-height: 1.5; }"
                + "li p { margin: 4px 0; }"

                // Code - inline
                + "code { "
                + "  background-color: #2d2d2d; "
                + "  color: #E8E8E8; "
                + "  padding: 2px 6px; "
                + "  border-radius: 4px; "
                + "  font-family: 'Consolas', 'Courier New', monospace; "
                + "  font-size: 10px; "
                + "}"

                // Code - blocks
                + "pre { "
                + "  background-color: #1e1e1e; "
                + "  padding: 12px; "
                + "  border-radius: 6px; "
                + "  overflow-x: auto; "
                + "  border: 1px solid #3d3d3d; "
                + "  margin: 10px 0; "
                + "}"
                + "pre code { "
                + "  padding: 0; "
                + "  background-color: transparent; "
                + "  font-size: 10px; "
                + "}"

                // Links
                + "a { color: #4CAF50; text-decoration: none; }"

                // Text formatting
                + "strong, b { color: #FFFFFF; font-weight: bold; }"
                + "em, i { font-style: italic; color: #DDDDDD; }"
                + "del, s { text-decoration: line-through; color: #888888; }"

                // Blockquotes
                + "blockquote { "
                + "  border-left: 4px solid #4CAF50; "
                + "  margin: 12px 0; "
                + "  padding: 8px 16px; "
                + "  color: #AAAAAA; "
                + "  background-color: #2a2a2a; "
                + "}"
                + "blockquote p { margin: 4px 0; }"

                // Horizontal rule
                + "hr { "
                + "  border: none; "
                + "  border-top: 1px solid #444444; "
                + "  margin: 16px 0; "
                + "}"

                // Tables
                + "table { "
                + "  border-collapse: collapse; "
                + "  margin: 12px 0; "
                + "  width: 100%; "
                + "  border: 1px solid #444444; "
                + "}"
                + "th { "
                + "  background-color: #333333; "
                + "  color: #FFFFFF; "
                + "  font-weight: bold; "
                + "  padding: 8px 12px; "
                + "  text-align: left; "
                + "  border: 1px solid #444444; "
                + "}"
                + "td { "
                + "  padding: 6px 12px; "
                + "  border: 1px solid #444444; "
                + "  background-color: #2a2a2a; "
                + "}"

                // Images
                + "img { max-width: 100%; height: auto; border-radius: 4px; }"

                + "</style></head><body>" + htmlContent + "</body></html>";
    }

    /**
     * Alias for wrapHtmlWithStyle for backward compatibility.
     * @deprecated Use {@link #wrapHtmlWithStyle(String)} instead
     */
    public static String markdownToHtml(String content) {
        return wrapHtmlWithStyle(content);
    }
}
