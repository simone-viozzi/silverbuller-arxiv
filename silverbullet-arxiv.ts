import { editor } from "@silverbulletmd/silverbullet/syscalls";
import { parse } from "https://deno.land/x/xml@6.0.1/mod.ts";

/**
 * Type representing the structured metadata of an arXiv paper.
 */
interface ArxivMetadata {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  publishedDate: string;
  updatedDate: string;
  comment?: string;
  categories: string[];
  pdfUrl: string;
}

/**
 * Fetches and parses the metadata of a paper from arXiv given its paper ID.
 * @param {string} paperId - The arXiv paper ID (e.g., "1706.03762").
 * @param {string} version - The version of the paper, if applicable (e.g., "v7").
 * @returns {Promise<ArxivMetadata>} - A structured metadata object.
 */
export async function fetchArxivMetadata(
  paperId: string,
  version: string = "",
): Promise<ArxivMetadata> {
  const apiUrl =
    `https://export.arxiv.org/api/query?id_list=${paperId}${version}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Error fetching metadata: ${response.statusText}`);
  }

  const metadata = await response.text();
  const xmlDoc = parse(metadata);

  // Ensure correct pathing through XML structure
  const entry = xmlDoc?.feed?.entry || {};

  const extractText = (field: any): string => {
    if (typeof field === "string") {
      return field.trim();
    } else if (field["#text"]) {
      return field["#text"].trim();
    }
    return "";
  };

  const title = extractText(entry.title);
  const abstract = extractText(entry.summary);

  const authors = Array.isArray(entry.author)
    ? entry.author.map((author: any) => extractText(author.name))
    : [extractText(entry.author?.name)];

  const publishedDate = extractText(entry.published);
  const updatedDate = extractText(entry.updated);
  const id = extractText(entry.id);
  const comment = extractText(entry["arxiv:comment"]);

  const pdfLink = Array.isArray(entry.link)
    ? entry.link.find((link: any) => link["@title"] === "pdf")
    : entry.link;

  const pdfUrl = pdfLink?.["@href"] || "";

  const categories = Array.isArray(entry.category)
    ? entry.category.map((cat: any) => cat["@term"] || "")
    : [entry.category?.["@term"] || ""];

  return {
    id,
    title,
    abstract,
    authors,
    publishedDate,
    updatedDate,
    comment,
    categories,
    pdfUrl,
  };
}

/**
 * Extracts the abstract of a paper from its metadata.
 * @param {string} paperId - The arXiv paper ID (e.g., "2203.06115").
 * @param {string} version - The version of the paper, if applicable (e.g., "v1").
 * @returns {Promise<string>} - The abstract of the paper.
 */
export async function getPaperAbstract(
  paperId: string,
  version: string = "",
): Promise<string> {
  const metadata = await fetchArxivMetadata(paperId, version);
  return metadata.abstract;
}

/**
 * Downloads a paper from arXiv given its paper ID and optional version, saving it with a filename based on the paper's title.
 * @param {string} paperId - The arXiv paper ID (e.g., "2203.06115").
 * @param {string} version - The version of the paper, if applicable (e.g., "v1").
 * @param {string} outputDir - The directory to save the downloaded PDF.
 * @returns {Promise<string | undefined>} - The file path of the downloaded PDF, or undefined if an error occurred.
 */
export async function downloadArxivPaper(
  paperId: string,
  version: string = "",
  outputDir: string = "./downloads",
): Promise<string | undefined> {
  try {
    // Fetch metadata to get the title
    const metadata = await fetchArxivMetadata(paperId, version);
    const title = metadata.title;

    // Sanitize the title to create a valid filename
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    // Construct the PDF URL
    const pdfUrl = `https://arxiv.org/pdf/${paperId}${version}.pdf`;

    // Ensure the output directory exists
    await Deno.mkdir(outputDir, { recursive: true });

    // Define the output file path
    const filePath = `${outputDir}/${sanitizedTitle}.pdf`;

    // Fetch and download the PDF
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.body) {
      throw new Error("Unable to download the PDF.");
    }

    // Write the PDF to the file system
    const file = await Deno.open(filePath, { write: true, create: true });
    await pdfResponse.body.pipeTo(file.writable);

    console.log(`Paper downloaded to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Error downloading the paper:", (error as Error).message);
  }
}

export async function helloWorld() {
  await editor.flashNotification("Hello world!");
}
