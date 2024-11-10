import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { fetchArxivMetadata } from "../silverbullet-arxiv.ts"; // Adjust the path if needed

// Mock metadata XML (as provided)
const mockMetadataXML = `
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <link href="http://arxiv.org/api/query?search_query%3D%26id_list%3D1706.03762%26start%3D0%26max_results%3D10" rel="self" type="application/atom+xml"/>
  <title type="html">ArXiv Query: search_query=&amp;id_list=1706.03762&amp;start=0&amp;max_results=10</title>
  <id>http://arxiv.org/api/zUwBFJ+vAUSpXAR7QFveSY/bZos</id>
  <updated>2024-11-10T00:00:00-05:00</updated>
  <opensearch:totalResults xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">1</opensearch:totalResults>
  <opensearch:startIndex xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">0</opensearch:startIndex>
  <opensearch:itemsPerPage xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/">10</opensearch:itemsPerPage>
  <entry>
    <id>http://arxiv.org/abs/1706.03762v7</id>
    <updated>2023-08-02T00:41:18Z</updated>
    <published>2017-06-12T17:57:34Z</published>
    <title>Attention Is All You Need</title>
    <summary>  The dominant sequence transduction models are based on complex recurrent or
convolutional neural networks in an encoder-decoder configuration. The best
performing models also connect the encoder and decoder through an attention
mechanism. We propose a new simple network architecture, the Transformer, based
solely on attention mechanisms, dispensing with recurrence and convolutions
entirely. Experiments on two machine translation tasks show these models to be
superior in quality while being more parallelizable and requiring significantly
less time to train. Our model achieves 28.4 BLEU on the WMT 2014
English-to-German translation task, improving over the existing best results,
including ensembles by over 2 BLEU. On the WMT 2014 English-to-French
translation task, our model establishes a new single-model state-of-the-art
BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction
of the training costs of the best models from the literature. We show that the
Transformer generalizes well to other tasks by applying it successfully to
English constituency parsing both with large and limited training data.
</summary>
    <author>
      <name>Ashish Vaswani</name>
    </author>
    <author>
      <name>Noam Shazeer</name>
    </author>
    <author>
      <name>Niki Parmar</name>
    </author>
    <author>
      <name>Jakob Uszkoreit</name>
    </author>
    <author>
      <name>Llion Jones</name>
    </author>
    <author>
      <name>Aidan N. Gomez</name>
    </author>
    <author>
      <name>Lukasz Kaiser</name>
    </author>
    <author>
      <name>Illia Polosukhin</name>
    </author>
    <arxiv:comment xmlns:arxiv="http://arxiv.org/schemas/atom">15 pages, 5 figures</arxiv:comment>
    <link href="http://arxiv.org/abs/1706.03762v7" rel="alternate" type="text/html"/>
    <link title="pdf" href="http://arxiv.org/pdf/1706.03762v7" rel="related" type="application/pdf"/>
    <arxiv:primary_category xmlns:arxiv="http://arxiv.org/schemas/atom" term="cs.CL" scheme="http://arxiv.org/schemas/atom"/>
    <category term="cs.CL" scheme="http://arxiv.org/schemas/atom"/>
    <category term="cs.LG" scheme="http://arxiv.org/schemas/atom"/>
  </entry>
</feed>
`;

Deno.test("fetchArxivMetadata - parses metadata correctly with mocked XML response", async () => {
  // Mock the fetch function to return the mock XML response
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(mockMetadataXML, { status: 200 });

  try {
    const metadata = await fetchArxivMetadata("1706.03762");

    console.log(metadata);

    assertEquals(metadata.id, "http://arxiv.org/abs/1706.03762v7");
    assertEquals(metadata.title, "Attention Is All You Need");
    assertEquals(metadata.authors, [
      "Ashish Vaswani",
      "Noam Shazeer",
      "Niki Parmar",
      "Jakob Uszkoreit",
      "Llion Jones",
      "Aidan N. Gomez",
      "Lukasz Kaiser",
      "Illia Polosukhin",
    ]);
    assertEquals(metadata.publishedDate, "2017-06-12T17:57:34Z");
    assertEquals(metadata.updatedDate, "2023-08-02T00:41:18Z");
    assertEquals(
      metadata.abstract.includes("The dominant sequence transduction models"),
      true,
    );
    assertEquals(metadata.comment, "15 pages, 5 figures");
    assertEquals(metadata.categories, ["cs.CL", "cs.LG"]);
    assertEquals(metadata.pdfUrl, "http://arxiv.org/pdf/1706.03762v7");

    console.log("Mocked test passed: Metadata parsed correctly.");
  } finally {
    // Restore the original fetch function
    globalThis.fetch = originalFetch;
  }
});

Deno.test("fetchArxivMetadata - retrieves real metadata from arXiv", async () => {
  const paperId = "1706.03762";

  // Fetch real metadata
  const metadata = await fetchArxivMetadata(paperId);

  // Check that the metadata fields are populated
  assertEquals(metadata.title, "Attention Is All You Need");
  assertEquals(metadata.authors.includes("Ashish Vaswani"), true);
  assertEquals(metadata.authors.length > 0, true); // Ensure there are authors
  assertEquals(
    metadata.abstract.includes("The dominant sequence transduction models"),
    true,
  );
  assertEquals(
    metadata.pdfUrl.includes("http://arxiv.org/pdf/1706.03762"),
    true,
  );

  console.log("Real request test passed: Metadata retrieved and validated.");
});
