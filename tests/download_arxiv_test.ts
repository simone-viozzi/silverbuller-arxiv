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
    globalThis.fetch = async (input: string | URL | Request, init?: RequestInit) => {
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
