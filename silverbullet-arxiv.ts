import { editor } from "@silverbulletmd/silverbullet/syscalls";

// Funzione per scaricare un paper da arXiv con Deno
export async function downloadArxivPaper(
  paperId: string,
  version = "",
  outputDir = "./downloads",
) {
  try {
    // Costruisci l'URL API per ottenere i metadati del paper
    const apiUrl =
      `https://export.arxiv.org/api/query?id_list=${paperId}${version}`;

    // Recupera i metadati del paper
    const metadataResponse = await fetch(apiUrl);
    const metadata = await metadataResponse.text();

    // Estrai il titolo dai metadati
    const titleMatch = metadata.match(/<title>(.*?)<\/title>/);
    if (!titleMatch || !titleMatch[1]) {
      throw new Error("Impossibile estrarre il titolo dai metadati.");
    }

    const title = titleMatch[1].replace(/\s+/g, " ").trim();

    // Sanitize il titolo per creare un nome file valido
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    // Costruisci l'URL PDF
    const pdfUrl = `https://arxiv.org/pdf/${paperId}${version}.pdf`;

    // Verifica che la directory di output esista, altrimenti creala
    await Deno.mkdir(outputDir, { recursive: true });

    // Definisci il percorso del file di output
    const filePath = `${outputDir}/${sanitizedTitle}.pdf`;

    // Scarica il PDF
    const pdfResponse = await fetch(pdfUrl);
    if (!pdfResponse.body) {
      throw new Error("Impossibile scaricare il PDF.");
    }

    // Scrivi il PDF nel file system
    const file = await Deno.open(filePath, { write: true, create: true });
    await pdfResponse.body.pipeTo(file.writable);

    console.log(`Paper scaricato su ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Errore durante il download del paper:", (error as Error).message);
  }
}

export async function helloWorld() {
  await editor.flashNotification("Hello world!");
}
