import { assertEquals } from "assertEquals";
import { assertExists } from "assertExists";
import { downloadArxivPaper } from "../silverbullet-arxiv.ts";

Deno.test("downloadArxivPaper - correctly downloads and saves a file with mock data", async () => {
    // Define the mock responses
    const mockMetadataResponse = `
        <feed xmlns="http://www.w3.org/2005/Atom">
            <entry>
                <title>Sample Paper Title for Testing</title>
            </entry>
        </feed>
    `;
    const mockPdfContent = new TextEncoder().encode("Mock PDF content");

    // Mock fetch for metadata and PDF
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (
        input: string | URL | Request,
        init?: RequestInit,
    ) => {
        const url = input instanceof Request ? input.url : input.toString();
        if (url.includes("api/query")) {
            // Mock metadata response
            return new Response(mockMetadataResponse, { status: 200 });
        } else if (url.includes("pdf")) {
            // Mock PDF response
            return new Response(mockPdfContent, { status: 200 });
        }
        return originalFetch(input, init);
    };

    // Temporary output directory
    const outputDir = "./test_downloads";
    const paperId = "2410.19414"; // Mock ID
    const version = "";

    try {
        // Run the function
        const filePath = await downloadArxivPaper(paperId, version, outputDir);

        // Verify the file was saved with the correct filename
        assertExists(filePath);

        // Check that the file contains the correct content
        const fileContent = await Deno.readFile(filePath);
        assertEquals(fileContent, mockPdfContent);

        console.log("Test passed: File downloaded and verified.");
    } finally {
        // Clean up: remove the downloaded file and directory
        await Deno.remove(outputDir, { recursive: true });
    }

    // Restore original fetch
    globalThis.fetch = originalFetch;
});

// Utility function to create a temporary directory for tests
async function createTempDir() {
    const tempDir = await Deno.makeTempDir();
    console.log(`Temporary directory created at: ${tempDir}`);
    return tempDir;
}

Deno.test("downloadArxivPaper - correctly downloads a real paper from arXiv", async () => {
    // Example paper ID from arXiv
    const paperTitle = "Attention Is All You Need";
    const paperId = "1706.03762";
    const version = "";

    // Create a temporary directory
    const outputDir = await createTempDir();

    try {
        // Run the function to download the paper
        const filePath = await downloadArxivPaper(paperId, version, outputDir);

        // Verify the file was saved
        assertExists(filePath);

        // Read the downloaded file's content
        const fileContent = await Deno.readFile(filePath);

        // Convert the binary content to string to look for title in the PDF content
        const textContent = new TextDecoder("utf-8").decode(fileContent);

        // Since PDF content is binary, just check for some keywords to verify it's a PDF file
        // (Note: for a more thorough check, you'd use a PDF parser library, but here we'll keep it simple)
        assertEquals(
            textContent.includes("%PDF"),
            true,
            "File content should contain %PDF, indicating a PDF file",
        );

        // Metadata Check: ensure that the filename is based on the title
        // Since titles can contain various symbols, we sanitize the filename in our function
        const expectedTitleInFilename = paperTitle
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "_");
        const fileName = filePath.split("/").pop();

        assertEquals(
            fileName?.includes(expectedTitleInFilename),
            true,
            "Filename should be based on the paper title",
        );

        console.log("Test passed: Real paper downloaded and verified.");
    } finally {
        // Clean up: remove the downloaded file and directory
        await Deno.remove(outputDir, { recursive: true });
    }
});
